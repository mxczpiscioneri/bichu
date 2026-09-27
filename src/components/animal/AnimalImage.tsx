import { Image } from 'expo-image';
import type { StyleProp, ImageStyle } from 'react-native';

import { mediaFor } from '@/content/media';

interface AnimalImageProps {
  animalId: string;
  size: number;
  dimmed?: boolean;
  style?: StyleProp<ImageStyle>;
}

/** Legacy illustrations are circular, so they sit well on any tinted surface. */
export function AnimalImage({ animalId, size, dimmed = false, style }: AnimalImageProps) {
  return (
    <Image
      source={mediaFor(animalId).image}
      style={[{ width: size, height: size, opacity: dimmed ? 0.35 : 1 }, style]}
      contentFit="contain"
      transition={120}
      accessible={false}
    />
  );
}
