import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import type { IconName } from '@/content/icons';
import { colors, shadows, touch } from '@/theme';

import { AppText } from './AppText';
import { Icon } from './Icon';
import { PressableScale } from './PressableScale';

interface RoundButtonProps {
  onPress: () => void;
  accessibilityLabel: string;
  icon?: IconName;
  /** Text glyph for simple controls (close/back) to avoid mixing icon families. */
  glyph?: string;
  size?: number;
  background?: string;
  style?: StyleProp<ViewStyle>;
}

export function RoundButton({ onPress, accessibilityLabel, icon, glyph, size = touch.childPreferred - 8, background = colors.white, style }: RoundButtonProps) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={[styles.button, { width: size, height: size, borderRadius: size / 2, backgroundColor: background }, style]}
    >
      {icon ? <Icon name={icon} size={size * 0.55} /> : null}
      {glyph ? <AppText style={[styles.glyph, { fontSize: size * 0.46, lineHeight: size * 0.56 }]}>{glyph}</AppText> : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: 'center', justifyContent: 'center', ...shadows.card },
  glyph: { color: colors.forest, fontFamily: 'Fredoka_700Bold' },
});
