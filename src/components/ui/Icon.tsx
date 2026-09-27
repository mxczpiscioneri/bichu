import { Image } from 'expo-image';
import type { StyleProp, ImageStyle } from 'react-native';

import { ICONS, type IconName } from '@/content/icons';

interface IconProps {
  name: IconName;
  size?: number;
  style?: StyleProp<ImageStyle>;
}

/** Decorative (images are not accessibility elements by default): label the parent instead. */
export function Icon({ name, size = 32, style }: IconProps) {
  return <Image source={ICONS[name]} style={[{ width: size, height: size }, style]} contentFit="contain" />;
}
