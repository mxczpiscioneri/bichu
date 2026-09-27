import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import type { IconName } from '@/content/icons';
import { colors, shadows, touch } from '@/theme';

import { Icon } from './Icon';
import { PressableScale } from './PressableScale';

interface RoundButtonProps {
  onPress: () => void;
  accessibilityLabel: string;
  icon: IconName;
  size?: number;
  background?: string;
  style?: StyleProp<ViewStyle>;
}

export function RoundButton({
  onPress,
  accessibilityLabel,
  icon,
  size = touch.childPreferred - 8,
  background = colors.white,
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
      <Icon name={icon} size={size * 0.55} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: 'center', justifyContent: 'center', ...shadows.card },
});
