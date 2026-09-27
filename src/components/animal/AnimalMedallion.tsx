import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

import { AnimalImage } from './AnimalImage';

/** The circular legacy illustration framed as a medallion, for use on scenes. */
export function AnimalMedallion({
  animalId,
  size,
  dimmed = false,
}: {
  animalId: string;
  size: number;
  dimmed?: boolean;
}) {
  const ring = Math.max(3, Math.round(size * 0.035));
  return (
    <View style={[styles.ring, { width: size + ring * 2, height: size + ring * 2, borderRadius: size, padding: ring }]}>
      <AnimalImage animalId={animalId} size={size} dimmed={dimmed} />
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    backgroundColor: colors.white,
    boxShadow: '0px 8px 20px rgba(52, 54, 47, 0.18)',
  },
});
