import { StyleSheet, View } from 'react-native';

import { AnimalImage } from '../animal/AnimalImage';

/**
 * Welcome illustration: the new animal art arranged as a group, back row
 * first so the front row overlaps it. Positions are fractions of the box.
 */
const GROUP = [
  { id: 'seal', x: 0.0, y: 0.08, size: 0.42 },
  { id: 'parrot', x: 0.3, y: -0.02, size: 0.44 },
  { id: 'horse', x: 0.58, y: 0.02, size: 0.44 },
  { id: 'lion', x: -0.04, y: 0.38, size: 0.5 },
  { id: 'sheep', x: 0.56, y: 0.42, size: 0.46 },
  { id: 'monkey', x: 0.26, y: 0.4, size: 0.5 },
] as const;

export function AnimalGroup({ width }: { width: number }) {
  const height = width * 0.92;
  return (
    <View
      style={{ width, height }}
      accessible
      accessibilityLabel="Foca, papagaio, cavalo, leão, macaco e ovelha juntos">
      {GROUP.map((item) => (
        <View
          key={item.id}
          style={[styles.item, { left: item.x * width, top: item.y * width, width: item.size * width }]}>
          <AnimalImage animalId={item.id} size={item.size * width} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { position: 'absolute' },
});
