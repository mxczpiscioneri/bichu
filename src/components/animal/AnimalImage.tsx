import { Image } from 'expo-image';
import type { ImageStyle, StyleProp } from 'react-native';

import { getAnimal } from '@/content/animals';
import { mediaFor } from '@/content/media';
import { colors } from '@/theme';

interface AnimalImageProps {
  animalId: string;
  size: number;
  dimmed?: boolean;
  style?: StyleProp<ImageStyle>;
}

/** Plain animal illustration. Dimmed cutouts turn into a silhouette ("who is it?"). */
export function AnimalImage({ animalId, size, dimmed = false, style }: AnimalImageProps) {
  const cutout = getAnimal(animalId)?.media.imageStyle === 'cutout';
  return (
    <Image
      source={mediaFor(animalId).image}
      style={[{ width: size, height: size, opacity: dimmed ? (cutout ? 0.5 : 0.35) : 1 }, style]}
      tintColor={dimmed && cutout ? colors.cacao : undefined}
      contentFit="contain"
      transition={120}
    />
  );
}
