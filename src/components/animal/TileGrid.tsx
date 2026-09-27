import { StyleSheet, View } from 'react-native';

import type { Animal } from '@/domain/animal';
import { useGridWidth } from '@/hooks/useGridWidth';

import { AnimalTile } from './AnimalTile';

interface TileGridProps {
  animals: readonly Animal[];
  columns: 2 | 3;
  lockUndiscovered?: boolean;
}

/** Content is small (tens of animals), so a wrapped View beats a virtualized list. */
export function TileGrid({ animals, columns, lockUndiscovered }: TileGridProps) {
  const gap = columns === 2 ? 14 : 10;
  const width = useGridWidth(columns, gap);
  return (
    <View style={[styles.grid, { gap }]}>
      {animals.map((animal) => (
        <AnimalTile key={animal.id} animal={animal} width={width} lockUndiscovered={lockUndiscovered} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
});
