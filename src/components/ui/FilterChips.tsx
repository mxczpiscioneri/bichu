import { ScrollView, StyleSheet } from 'react-native';

import type { IconName } from '@/content/icons';
import { colors, radius, shadows, spacing } from '@/theme';

import { AppText } from './AppText';
import { Icon } from './Icon';
import { PressableScale } from './PressableScale';

export interface FilterOption {
  id: string;
  label: string;
  icon: IconName;
}

interface FilterChipsProps {
  options: FilterOption[];
  selected: string;
  onSelect: (id: string) => void;
}

export function FilterChips({ options, selected, onSelect }: FilterChipsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row} style={styles.scroller}>
      {options.map((option) => {
        const active = option.id === selected;
        return (
          <PressableScale
            key={option.id}
            onPress={() => onSelect(option.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Filtro: ${option.label}`}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Icon name={option.icon} size={28} />
            <AppText variant="label" color={active ? colors.white : colors.ink}>
              {option.label}
            </AppText>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroller: { marginHorizontal: -spacing.lg + 4 },
  row: { gap: spacing.sm, paddingHorizontal: spacing.lg - 4, paddingVertical: 4 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 52,
    paddingLeft: spacing.sm + 2,
    paddingRight: spacing.md + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  chipActive: { backgroundColor: colors.forest },
});
