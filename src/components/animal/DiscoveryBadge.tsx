import { StyleSheet, View } from 'react-native';

import type { IconName } from '@/content/icons';
import type { DiscoveryState } from '@/progress/progress';
import { colors, radius, spacing } from '@/theme';

import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';

const BADGES: Record<DiscoveryState, { label: string; icon: IconName; background: string; color: string }> = {
  discovered: { label: 'Descoberto', icon: 'star', background: colors.sunSoft, color: colors.cacao },
  found: { label: 'Visto', icon: 'footprints', background: colors.leafSoft, color: colors.forest },
  unknown: { label: 'Novo', icon: 'sparkles', background: colors.cacaoSoft, color: colors.cacao },
};

/** Icon + text, never colour alone. `compact` shows only the icon. */
export function DiscoveryBadge({ state, compact = false }: { state: DiscoveryState; compact?: boolean }) {
  const badge = BADGES[state];
  return (
    <View
      style={[styles.badge, { backgroundColor: badge.background }, compact && styles.compact]}
      accessibilityLabel={badge.label}>
      <Icon name={badge.icon} size={compact ? 22 : 20} />
      {compact ? null : (
        <AppText variant="caption" style={[styles.text, { color: badge.color }]}>
          {badge.label}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radius.pill,
  },
  compact: { paddingHorizontal: 5, paddingVertical: 5 },
  text: { fontFamily: 'Nunito_800ExtraBold', fontSize: 13 },
});
