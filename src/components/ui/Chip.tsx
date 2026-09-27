import { StyleSheet, View } from 'react-native';

import type { IconName } from '@/content/icons';
import { colors, radius, spacing } from '@/theme';

import { AppText } from './AppText';
import { Icon } from './Icon';

interface ChipProps {
  label: string;
  icon?: IconName;
  background?: string;
}

export function Chip({ label, icon, background = colors.surface }: ChipProps) {
  return (
    <View style={[styles.chip, { backgroundColor: background }]} accessibilityLabel={label}>
      {icon ? <Icon name={icon} size={26} /> : null}
      <AppText variant="label">{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingLeft: spacing.sm + 2,
    paddingRight: spacing.md,
    borderRadius: radius.pill,
    minHeight: 44,
  },
});
