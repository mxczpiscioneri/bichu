import { StyleSheet, View } from 'react-native';

import { colors, fonts, radius, spacing } from '@/theme';

import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface SegmentedTabsProps<T extends string> {
  tabs: { id: T; label: string }[];
  selected: T;
  onSelect: (id: T) => void;
}

export function SegmentedTabs<T extends string>({ tabs, selected, onSelect }: SegmentedTabsProps<T>) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {tabs.map((tab) => {
        const active = tab.id === selected;
        return (
          <PressableScale
            key={tab.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(tab.id)}
            style={[styles.tab, active && styles.active]}>
            <AppText style={[styles.label, active && styles.labelActive]}>{tab.label}</AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  tab: {
    minHeight: 44,
    paddingHorizontal: spacing.md + 4,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cacaoSoft,
  },
  active: { backgroundColor: colors.forest },
  label: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.cacao },
  labelActive: { color: colors.white },
});
