import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  background?: string;
  contentStyle?: StyleProp<ViewStyle>;
  /** Extra bottom space so content clears the floating tab bar. */
  bottomInset?: number;
}

export function Screen({
  children,
  scroll = true,
  edges = ['top'],
  background = colors.cream,
  contentStyle,
  bottomInset = spacing.xl,
}: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: background }]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: bottomInset }, contentStyle]}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.fill, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  fill: { flex: 1 },
  content: { paddingHorizontal: spacing.lg - 4, paddingTop: spacing.md, gap: spacing.lg },
});
