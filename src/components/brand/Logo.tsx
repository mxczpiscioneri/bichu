import { Image } from 'expo-image';

import { BRAND_IMAGES } from '@/content/media';

const LOGO_RATIO = 457 / 232;
const WORDMARK_RATIO = 457 / 176;

/** Provisional raster logo from the approved board (vector redesign pending, docs/BRAND.md). */
export function Logo({ width = 180, withTagline = true }: { width?: number; withTagline?: boolean }) {
  const ratio = withTagline ? LOGO_RATIO : WORDMARK_RATIO;
  return (
    <Image
      source={withTagline ? BRAND_IMAGES.logo : BRAND_IMAGES.wordmark}
      style={{ width, height: width / ratio }}
      contentFit="contain"
      accessibilityLabel={withTagline ? 'bichu — Descubra o mundo animal.' : 'bichu'}
    />
  );
}
