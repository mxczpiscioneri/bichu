import { StyleSheet, View } from 'react-native';

import type { IconName } from '@/content/icons';
import { spacing } from '@/theme';

import { AppText } from './AppText';
import { Icon } from './Icon';

export function SectionHeader({ title, icon }: { title: string; icon?: IconName }) {
  return (
    <View style={styles.row} accessibilityRole="header">
      {icon ? <Icon name={icon} size={30} /> : null}
      <AppText variant="heading">{title}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
