import { StyleSheet, View } from 'react-native';

import type { IconName } from '@/content/icons';
import { colors, radius, spacing } from '@/theme';

import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';

export function FactCard({ text, icon = 'leaves', highlight = false }: { text: string; icon?: IconName; highlight?: boolean }) {
  return (
    <View style={[styles.card, highlight && styles.highlight]}>
      <Icon name={icon} size={34} />
      <AppText variant="body" style={styles.text}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  highlight: { backgroundColor: colors.sunSoft },
  text: { flex: 1 },
});
