import type { Animal } from '@/domain/animal';

import { toneForAnimal } from './animalTone';
import { tones } from './tokens';

/** Colours derived from an animal's signature colour. */
export interface AnimalPalette {
  /** The signature colour itself (icons, accents). */
  base: string;
  /** Very light tint: screen and card backgrounds. */
  wash: string;
  /** Light tint: chips, tags, secondary surfaces. */
  soft: string;
  /** Dark enough for white bold text on it (≥ 3:1, WCAG large text). */
  strong: string;
  /** Dark enough for text on the wash background (≥ 4.5:1). */
  text: string;
}

type Rgb = [number, number, number];

function parseHex(hex: string): Rgb {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHex([r, g, b]: Rgb): string {
  return `#${[r, g, b]
    .map((c) => Math.round(c).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
}

/** t = 0 keeps `from`, t = 1 returns `to`. */
function mix(from: Rgb, to: Rgb, t: number): Rgb {
  return [0, 1, 2].map((i) => from[i] + (to[i] - from[i]) * t) as Rgb;
}

function luminance(rgb: Rgb): number {
  const [r, g, b] = rgb.map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [l1, l2] = [luminance(parseHex(a)), luminance(parseHex(b))].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const WHITE: Rgb = [255, 255, 255];
const BLACK: Rgb = [0, 0, 0];

/** Darkens `base` in small steps until it reaches `ratio` against `against`. */
function darkenUntil(base: Rgb, against: string, ratio: number): string {
  for (let t = 0; t <= 1; t += 0.04) {
    const candidate = toHex(mix(base, BLACK, t));
    if (contrastRatio(candidate, against) >= ratio) return candidate;
  }
  return toHex(BLACK);
}

export function paletteFromColor(hex: string): AnimalPalette {
  const base = parseHex(hex);
  const wash = toHex(mix(base, WHITE, 0.86));
  return {
    base: toHex(base),
    wash,
    soft: toHex(mix(base, WHITE, 0.7)),
    strong: darkenUntil(base, '#FFFFFF', 3),
    text: darkenUntil(base, wash, 4.5),
  };
}

export function paletteForAnimal(animal: Animal): AnimalPalette {
  return paletteFromColor(animal.color ?? tones[toneForAnimal(animal)].accent);
}
