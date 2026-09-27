import type { BottomTabBarProps } from 'expo-router/tabs';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, spacing } from '@/theme';

import { AppText } from '../ui/AppText';
import { LineIcon, type LineIconName } from '../ui/LineIcon';
import { PressableScale } from '../ui/PressableScale';

const TABS: Record<string, { label: string; icon: LineIconName }> = {
  index: { label: 'Início', icon: 'home' },
  explore: { label: 'Explorar', icon: 'explore' },
  play: { label: 'Brincar', icon: 'play' },
  collection: { label: 'Bichupédia', icon: 'book' },
};

export const TAB_BAR_HEIGHT = 72;

/** Bottom bar with large touch targets; the active tab is green, icon + label. */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]} accessibilityRole="tablist">
      {state.routes.map((route, index) => {
        const tab = TABS[route.name];
        if (!tab) return null;
        const focused = state.index === index;
        const color = focused ? colors.forest : colors.inkSoft;
        return (
          <PressableScale
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={tab.label}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
            }}
            style={styles.item}>
            <View style={[styles.iconWrap, focused && styles.iconActive]}>
              <LineIcon name={tab.icon} size={26} color={color} strokeWidth={focused ? 2.4 : 2} />
            </View>
            <AppText style={[styles.label, { color }]} numberOfLines={1}>
              {tab.label}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    boxShadow: '0px -4px 18px rgba(116, 66, 31, 0.08)',
  },
  item: { flex: 1, minHeight: TAB_BAR_HEIGHT - 12, alignItems: 'center', justifyContent: 'center', gap: 2 },
  iconWrap: { width: 52, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  iconActive: { backgroundColor: colors.leafSoft },
  label: { fontFamily: fonts.bodyBold, fontSize: 13, lineHeight: 16 },
});
