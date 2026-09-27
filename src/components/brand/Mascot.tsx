import { Image } from 'expo-image';
import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { BRAND_IMAGES, type MascotPose } from '@/content/media';

const RATIOS: Record<MascotPose, number> = {
  wave: 570 / 819,
  hug: 307 / 327,
  explore: 325 / 325,
  cheer: 325 / 335,
  avatar: 1,
};

interface MascotProps {
  pose?: MascotPose;
  height: number;
  /** Gentle idle bounce (disabled when the OS asks for reduced motion). */
  animated?: boolean;
}

/** Bichu — Guardião da Floresta. */
export function Mascot({ pose = 'wave', height, animated = true }: MascotProps) {
  const reduceMotion = useReducedMotion();
  const offset = useSharedValue(0);

  useEffect(() => {
    if (!animated || reduceMotion) return;
    offset.set(
      withRepeat(
        withSequence(
          withTiming(-6, { duration: 900, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
      ),
    );
  }, [animated, offset, reduceMotion]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: offset.get() }] }));

  return (
    <Animated.View style={style} accessibilityLabel="Bichu, o guardião da floresta" accessible>
      <Image source={BRAND_IMAGES[pose]} style={{ height, width: height * RATIOS[pose] }} contentFit="contain" />
    </Animated.View>
  );
}
