import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useLayout } from '@/hooks/useLayout';
import { spacing } from '@/theme';

import { AppText } from '../ui/AppText';

interface HomeRowProps {
  title: string;
  /** Tablets lay the items out as one full-width row; phones scroll them sideways. */
  children: ReactNode;
  gap?: number;
}

/** A titled home section: a swipeable row on phones, a row that fills the width on tablets. */
export function HomeRow({ title, children, gap = spacing.sm + 4 }: HomeRowProps) {
  const { isTablet, padding } = useLayout();
  return (
    <View style={styles.section}>
      <AppText variant={isTablet ? 'heading' : 'subheading'} accessibilityRole="header">
        {title}
      </AppText>
      {isTablet ? (
        <View style={[styles.fill, { gap }]}>{children}</View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: -padding }}
          contentContainerStyle={[styles.scroll, { gap, paddingHorizontal: padding }]}>
          {children}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.sm },
  fill: { flexDirection: 'row', paddingVertical: spacing.sm },
  scroll: { paddingVertical: spacing.sm },
});
