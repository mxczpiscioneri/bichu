import { animals } from '@/content/animals';

import { clampScale, COMFORT_HEIGHT, initialScale, SCALE_LIMITS, sizeModeFor } from '../scale';

const meta = (height: number) => ({ license: 'x', author: 'y', realWorldHeightMeters: height });

describe('AR scale', () => {
  it('keeps comfortable animals life-size', () => {
    expect(initialScale(meta(0.5))).toBe(1);
    expect(sizeModeFor(1, meta(0.5))).toBe('real');
  });

  it('enlarges tiny animals and shrinks huge ones to the comfort range', () => {
    expect(initialScale(meta(0.01)) * 0.01).toBeCloseTo(COMFORT_HEIGHT.min);
    expect(initialScale(meta(3.2)) * 3.2).toBeCloseTo(COMFORT_HEIGHT.max);
    expect(sizeModeFor(initialScale(meta(0.01)), meta(0.01))).toBe('enlarged');
    expect(sizeModeFor(initialScale(meta(3.2)), meta(3.2))).toBe('reduced');
  });

  it('limits pinching around the starting scale', () => {
    const m = meta(1.36);
    const base = initialScale(m);
    expect(clampScale(100, m)).toBeCloseTo(base * SCALE_LIMITS.max);
    expect(clampScale(0, m)).toBeCloseTo(base * SCALE_LIMITS.min);
  });

  it('every animal with a model starts at a visible, room-friendly height', () => {
    for (const animal of animals) {
      const m = animal.media.model3dMeta;
      if (!m?.realWorldHeightMeters) continue;
      const shown = initialScale(m) * m.realWorldHeightMeters;
      expect(shown).toBeGreaterThanOrEqual(COMFORT_HEIGHT.min - 1e-9);
      expect(shown).toBeLessThanOrEqual(COMFORT_HEIGHT.max + 1e-9);
    }
  });
});
