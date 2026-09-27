import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/theme';

/** ● ● ━━ ○ ○ — done, current, still to go. */
export function RoundProgress({ total, current }: { total: number; current: number }) {
  return (
    <View style={styles.row} accessibilityLabel={`Rodada ${Math.min(current + 1, total)} de ${total}`} accessible>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={[styles.dot, i < current && styles.done, i === current && styles.active]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: radius.pill, backgroundColor: colors.line },
  done: { backgroundColor: colors.leaf },
  active: { width: 36, backgroundColor: colors.sun },
});
