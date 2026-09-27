import { StyleSheet, View } from 'react-native';

import { getAnimal } from '@/content/animals';
import { colors } from '@/theme';

import { AnimalImage } from './AnimalImage';

interface AnimalArtProps {
  animalId: string;
  size: number;
  /** Locked (undiscovered): cutouts become a silhouette, badges fade. */
  dimmed?: boolean;
}

/**
 * The animal as shown on a scene. New full-body art ("cutout") stands on a
 * soft ground shadow; legacy circular art ("badge") is framed as a medallion
 * until its new illustration arrives.
 */
export function AnimalArt({ animalId, size, dimmed = false }: AnimalArtProps) {
  if (getAnimal(animalId)?.media.imageStyle === 'cutout') {
    const artSize = Math.round(size * 1.12);
    return (
      <View style={{ width: artSize, height: artSize, justifyContent: 'flex-end', alignItems: 'center' }}>
        <View style={[styles.shadow, { width: artSize * 0.6, height: artSize * 0.08, bottom: artSize * 0.02 }]} />
        <AnimalImage animalId={animalId} size={artSize} dimmed={dimmed} style={StyleSheet.absoluteFill} />
      </View>
    );
  }
  const ring = Math.max(3, Math.round(size * 0.035));
  return (
    <View style={[styles.ring, { width: size + ring * 2, height: size + ring * 2, borderRadius: size, padding: ring }]}>
      <AnimalImage animalId={animalId} size={size} dimmed={dimmed} />
    </View>
  );
}

const styles = StyleSheet.create({
  ring: { backgroundColor: colors.white, boxShadow: '0px 8px 20px rgba(52, 54, 47, 0.18)' },
  shadow: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(52, 54, 47, 0.18)' },
});
