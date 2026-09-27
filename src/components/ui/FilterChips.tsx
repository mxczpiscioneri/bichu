import { ScrollView, StyleSheet } from 'react-native';

import { colors, fonts, radius, spacing } from '@/theme';

import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

export interface FilterOption {
  id: string;
  label: string;
  /** Optional progress shown in the pill, e.g. "3/11". */
  count?: string;
}

interface FilterChipsProps {
  options: FilterOption[];
  selected: string;
  onSelect: (id: string) => void;
}

export function FilterChips({ options, selected, onSelect }: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroller}>
      {options.map((option) => {
        const active = option.id === selected;
        return (
          <PressableScale
            key={option.id}
            onPress={() => onSelect(option.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Filtro: ${option.label}${option.count ? `, ${option.count}` : ''}`}
            style={[styles.chip, active && styles.chipActive]}>
            <AppText style={[styles.label, active && styles.labelActive]}>{option.label}</AppText>
            {option.count ? (
              <AppText style={[styles.count, active && styles.labelActive]}>{option.count}</AppText>
            ) : null}
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroller: { marginHorizontal: -spacing.lg + 4, flexGrow: 0 },
  row: { gap: spacing.sm, paddingHorizontal: spacing.lg - 4, paddingVertical: 2 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: spacing.md + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  chipActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  label: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  count: { fontFamily: fonts.body, fontSize: 13, color: colors.inkSoft },
  labelActive: { color: colors.white },
});
