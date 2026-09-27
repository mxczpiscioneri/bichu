import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, motion, radius } from '@/theme';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  track?: string;
  height?: number;
}

export function ProgressBar({
  value,
  max,
  color = colors.leaf,
  track = colors.cacaoSoft,
  height = 14,
}: ProgressBarProps) {
  const ratio = max > 0 ? Math.min(1, value / max) : 0;
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.set(withTiming(ratio, { duration: motion.celebrationMs }));
  }, [progress, ratio]);
  const fill = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));

  return (
    <View
      style={[styles.track, { height, backgroundColor: track }]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max, now: value }}>
      <Animated.View style={[styles.fill, { backgroundColor: color }, fill]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
});
