import { StyleSheet, View } from 'react-native';

import type { Animal } from '@/domain/animal';
import { spacing } from '@/theme';

import { AnimalCard } from './AnimalCard';

/** Two-column grid (content is small, so a plain View beats a virtualized list). */
export function AnimalGrid({ animals, veiled = false }: { animals: readonly Animal[]; veiled?: boolean }) {
  const rows: Animal[][] = [];
  for (let i = 0; i < animals.length; i += 2) rows.push(animals.slice(i, i + 2));
  return (
    <View style={styles.grid}>
      {rows.map((row) => (
        <View key={row.map((a) => a.id).join('-')} style={styles.row}>
          {row.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} veiled={veiled} />
          ))}
          {row.length === 1 ? <View style={styles.spacer} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md },
  spacer: { flex: 1 },
});
