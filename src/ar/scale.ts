import type { Model3dMeta } from '@/domain/animal';

/**
 * How big the animal first appears in AR. Real size is the goal, but a 1 cm bee
 * is invisible and a 3 m elephant swallows the camera, so the starting height is
 * kept between these bounds (metres). Inside them the animal is life-size.
 */
export const COMFORT_HEIGHT = { min: 0.25, max: 1 } as const;

/** Pinch range around the starting scale. */
export const SCALE_LIMITS = { min: 0.5, max: 2 } as const;

/** Within this tolerance of 1× the animal counts as life-size. */
const REAL_SIZE_TOLERANCE = 0.05;

export type SizeMode = 'real' | 'enlarged' | 'reduced';

/** Starting scale: life-size when comfortable, otherwise the nearest comfortable height. */
export function initialScale(meta: Model3dMeta | null | undefined): number {
  const height = meta?.realWorldHeightMeters;
  if (!height || height <= 0) return meta?.defaultScale ?? 1;
  const target = Math.min(COMFORT_HEIGHT.max, Math.max(COMFORT_HEIGHT.min, height));
  return target / height;
}

/** Keeps pinch-to-scale within a friendly range around the starting scale. */
export function clampScale(value: number, meta: Model3dMeta | null | undefined): number {
  const base = initialScale(meta);
  return Math.min(base * SCALE_LIMITS.max, Math.max(base * SCALE_LIMITS.min, value));
}

/** Whether the animal is currently shown at life size (models are authored in metres). */
export function sizeModeFor(scale: number, meta: Model3dMeta | null | undefined): SizeMode {
  if (!meta?.realWorldHeightMeters) return 'real';
  if (Math.abs(scale - 1) <= REAL_SIZE_TOLERANCE) return 'real';
  return scale > 1 ? 'enlarged' : 'reduced';
}
