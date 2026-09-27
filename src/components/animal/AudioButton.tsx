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
import type { IconName } from '@/content/icons';
import { colors, fonts, radius, shadows, spacing, touch } from '@/theme';

import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';
import { PressableScale } from '../ui/PressableScale';

interface AudioButtonProps {
  label: string;
  clipKey: string;
  onPress: () => void;
  icon?: IconName;
  accent?: string;
}

/** Big "listen" action. Pulses while its clip is playing. */
export function AudioButton({ label, clipKey, onPress, icon = 'speaker', accent = colors.forest }: AudioButtonProps) {
  const playing = useNowPlaying((state) => state.key === clipKey);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (playing) {
      pulse.set(withRepeat(withTiming(1.12, { duration: 420 }), -1, true));
    } else {
      cancelAnimation(pulse);
      pulse.set(withTiming(1, { duration: 150 }));
    }
  }, [playing, pulse]);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.get() }] }));

  return (
    <PressableScale
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityState={{ busy: playing }}
      style={[styles.button, playing && { borderColor: accent }]}
    >
      <Animated.View style={[styles.iconWrap, { backgroundColor: playing ? colors.sunSoft : colors.leafSoft }, iconStyle]}>
        <Icon name={icon} size={36} />
      </Animated.View>
      <View style={styles.textWrap}>
        <AppText style={[styles.label, { color: accent }]} numberOfLines={2}>
          {label}
        </AppText>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: touch.childPreferred + 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm + 2,
    borderWidth: 3,
    borderColor: 'transparent',
    ...shadows.card,
  },
  iconWrap: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  textWrap: { flex: 1 },
  label: { fontFamily: fonts.displayBold, fontSize: 19, lineHeight: 23 },
});
