import type { Model3dMeta } from '@/domain/animal';

export const SCALE_LIMITS = { min: 0.5, max: 2 } as const;

/** Keeps pinch-to-scale within a friendly range around the model's default scale. */
export function clampScale(value: number, meta: Model3dMeta | null | undefined): number {
  const base = meta?.defaultScale ?? 1;
  return Math.min(base * SCALE_LIMITS.max, Math.max(base * SCALE_LIMITS.min, value));
}
