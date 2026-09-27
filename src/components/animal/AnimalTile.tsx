import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import type { Animal } from '@/domain/animal';
import { discoveryState } from '@/progress/progress';
import { useAnimalProgress } from '@/stores/progressStore';
import { colors, paletteForAnimal, radius, shadows, spacing } from '@/theme';

import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';
import { PressableScale } from '../ui/PressableScale';
import { AnimalArt } from './AnimalArt';

interface AnimalTileProps {
  animal: Animal;
  width: number;
  /** Bichupédia: undiscovered animals are shown locked (dimmed, padlock). */
  lockUndiscovered?: boolean;
}

/** Animal on its signature colour. Star = discovered, padlock = still hidden. */
export function AnimalTile({ animal, width, lockUndiscovered = false }: AnimalTileProps) {
  const state = discoveryState(useAnimalProgress(animal.id));
  const discovered = state === 'discovered';
  const locked = lockUndiscovered && !discovered;
  const imageSize = Math.round(width * 0.66);
  const palette = paletteForAnimal(animal);

  return (
    <PressableScale
      onPress={() => router.push({ pathname: '/animal/[id]', params: { id: animal.id } })}
      accessibilityLabel={`${animal.name.ptBR}${discovered ? ', descoberto' : locked ? ', ainda não descoberto' : ''}`}
      style={[styles.card, { width }]}
      pressedScale={0.96}>
      <View
        style={[
          styles.scene,
          { height: Math.round(width * 0.88), backgroundColor: locked ? colors.cacaoSoft : palette.soft },
        ]}>
        <AnimalArt animalId={animal.id} size={imageSize} dimmed={locked} />
        {discovered ? (
          <View style={[styles.badge, styles.star]}>
            <Icon name="star-fill" size={20} />
          </View>
        ) : null}
        {locked ? (
          <View style={[styles.badge, styles.lock]}>
            <Icon name="lock" size={18} />
          </View>
        ) : null}
      </View>
      <AppText variant="label" align="center" numberOfLines={1} style={styles.name}>
        {animal.name.ptBR}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.md + 2, padding: 6, gap: 6, ...shadows.card },
  scene: {
    borderRadius: radius.md - 4,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  star: { backgroundColor: colors.sunSoft },
  lock: { backgroundColor: colors.white },
  name: { paddingBottom: spacing.xs },
});
