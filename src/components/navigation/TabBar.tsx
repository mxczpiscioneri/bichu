import type { BottomTabBarProps } from 'expo-router/tabs';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { IconName } from '@/content/icons';
import { colors, fonts, radius, shadows, spacing } from '@/theme';

import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';
import { PressableScale } from '../ui/PressableScale';

const TABS: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Início', icon: 'house' },
  explore: { label: 'Explorar', icon: 'magnifier' },
  play: { label: 'Brincar', icon: 'puzzle' },
  collection: { label: 'Bichupédia', icon: 'books' },
};

export const TAB_BAR_HEIGHT = 84;

/** Floating, icon-first tab bar with large touch targets. */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]} pointerEvents="box-none">
      <View style={styles.bar} accessibilityRole="tablist">
        {state.routes.map((route, index) => {
          const tab = TABS[route.name];
          if (!tab) return null;
          const focused = state.index === index;
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
              style={[styles.item, focused && styles.itemActive]}
            >
              <Icon name={tab.icon} size={focused ? 34 : 30} style={!focused && styles.iconIdle} />
              <AppText style={[styles.label, focused && styles.labelActive]} numberOfLines={1}>
                {tab.label}
              </AppText>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: spacing.md },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 6,
    gap: 4,
    ...shadows.raised,
  },
  item: {
    flex: 1,
    height: TAB_BAR_HEIGHT - 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    gap: 2,
  },
  itemActive: { backgroundColor: colors.leafSoft },
  iconIdle: { opacity: 0.8 },
  label: { fontFamily: fonts.bodyBold, fontSize: 13, lineHeight: 16, color: colors.inkSoft },
  labelActive: { color: colors.forest },
});
