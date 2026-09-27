import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useNowPlaying } from '@/audio/AudioService';
import { colors, fonts } from '@/theme';

import { AppText } from '../ui/AppText';
import { LineIcon } from '../ui/LineIcon';
import { PressableScale } from '../ui/PressableScale';

interface AudioButtonProps {
  label: string;
  clipKey: string;
  onPress: () => void;
  color?: string;
  size?: number;
  /** Hide the caption (e.g. when the prompt already says what it plays). */
  showLabel?: boolean;
}

/** Big round "listen" button. Pulses while its clip is playing. */
export function AudioButton({
  label,
  clipKey,
  onPress,
  color = colors.leaf,
  size = 76,
  showLabel = true,
}: AudioButtonProps) {
  const playing = useNowPlaying((state) => state.key === clipKey);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (playing) {
      pulse.set(withRepeat(withTiming(1.08, { duration: 420 }), -1, true));
    } else {
      cancelAnimation(pulse);
      pulse.set(withTiming(1, { duration: 150 }));
    }
  }, [playing, pulse]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: pulse.get() }] }));

  return (
    <PressableScale
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityState={{ busy: playing }}
      style={styles.wrap}>
      <Animated.View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            boxShadow: `0px 5px 0px ${color}66`,
          },
          playing && styles.playing,
          style,
        ]}>
        <LineIcon name="speaker" size={size * 0.46} color={colors.white} strokeWidth={2.6} />
      </Animated.View>
      {showLabel ? (
        <View style={styles.labelWrap}>
          <AppText style={[styles.label, { color }]} numberOfLines={1}>
            {label}
          </AppText>
        </View>
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8 },
  circle: { alignItems: 'center', justifyContent: 'center' },
  playing: { borderWidth: 4, borderColor: colors.sun },
  labelWrap: { minHeight: 22 },
  label: { fontFamily: fonts.bodyBold, fontSize: 16 },
});
