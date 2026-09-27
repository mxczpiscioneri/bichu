import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { IconName } from '@/content/icons';
import { colors, fonts, radius, shadows, spacing, touch } from '@/theme';

import { AppText } from './AppText';
import { Icon } from './Icon';
import { PressableScale } from './PressableScale';

type Variant = 'primary' | 'warm' | 'light';

const VARIANTS: Record<Variant, { background: string; text: string; shadow: string }> = {
  primary: { background: colors.forest, text: colors.white, shadow: 'rgba(35, 70, 33, 0.35)' },
  warm: { background: colors.terra, text: colors.white, shadow: 'rgba(160, 70, 20, 0.35)' },
  light: { background: colors.white, text: colors.forest, shadow: 'rgba(116, 66, 31, 0.14)' },
};

interface BigButtonProps {
  label: string;
  onPress: () => void;
  icon?: IconName;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
}

/** Primary child-facing action: at least 64dp tall, icon + label. */
export function BigButton({ label, onPress, icon, variant = 'primary', style, accessibilityHint }: BigButtonProps) {
  const palette = VARIANTS[variant];
  return (
    <PressableScale
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      style={[
        styles.button,
        { backgroundColor: palette.background, boxShadow: `0px 5px 0px ${palette.shadow}` },
        style,
      ]}>
      <View style={styles.content}>
        {icon ? <Icon name={icon} size={36} /> : null}
        <AppText style={[styles.label, { color: palette.text }]} numberOfLines={1}>
          {label}
        </AppText>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: touch.childPreferred + 4,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    ...shadows.button,
  },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm + 4 },
  label: { fontFamily: fonts.displayBold, fontSize: 22, lineHeight: 28 },
});
