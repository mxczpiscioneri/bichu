import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import type { IconName } from '@/content/icons';
import { colors, shadows, touch } from '@/theme';

import { Icon } from './Icon';
import { LineIcon, type LineIconName } from './LineIcon';
import { PressableScale } from './PressableScale';

interface RoundButtonProps {
  onPress: () => void;
  accessibilityLabel: string;
  /** UI chrome icon (back, close, speaker…). */
  icon?: LineIconName;
  /** Colourful content icon, for playful buttons. */
  illustration?: IconName;
  size?: number;
  background?: string;
  iconColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function RoundButton({
  onPress,
  accessibilityLabel,
  icon,
  illustration,
  size = touch.childPreferred - 8,
  background = colors.white,
  iconColor = colors.forest,
  style,
}: RoundButtonProps) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={[
        styles.button,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: background },
        style,
      ]}>
      {icon ? <LineIcon name={icon} size={size * 0.5} color={iconColor} strokeWidth={2.6} /> : null}
      {illustration ? <Icon name={illustration} size={size * 0.55} /> : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: 'center', justifyContent: 'center', ...shadows.card },
});
