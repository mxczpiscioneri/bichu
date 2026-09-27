import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import type { Animal } from '@/domain/animal';
import { discoveryState } from '@/progress/progress';
import { useAnimalProgress } from '@/stores/progressStore';
import { colors, radius, shadows, spacing, toneForAnimal, tones } from '@/theme';

import { AppText } from '../ui/AppText';
import { PressableScale } from '../ui/PressableScale';
import { AnimalImage } from './AnimalImage';
import { DiscoveryBadge } from './DiscoveryBadge';

interface AnimalCardProps {
  animal: Animal;
  size?: 'md' | 'sm';
  /** Bichupédia hides undiscovered illustrations behind a soft veil. */
  veiled?: boolean;
  width?: number;
}

export function AnimalCard({ animal, size = 'md', veiled = false, width }: AnimalCardProps) {
  const progress = useAnimalProgress(animal.id);
  const state = discoveryState(progress);
  const tone = tones[toneForAnimal(animal)];
  const imageSize = size === 'md' ? 112 : 84;
  const hidden = veiled && state !== 'discovered';

  return (
    <PressableScale
      onPress={() => router.push({ pathname: '/animal/[id]', params: { id: animal.id } })}
      accessibilityLabel={hidden ? `${animal.name.ptBR}, ainda não descoberto` : animal.name.ptBR}
      style={[styles.card, size === 'sm' && styles.cardSm, width ? { width } : styles.flex]}
    >
      <View style={[styles.imageWrap, { backgroundColor: tone.background }]}>
        <AnimalImage animalId={animal.id} size={imageSize} dimmed={hidden} />
        {hidden ? (
          <View style={styles.veil}>
            <AppText style={styles.question}>?</AppText>
          </View>
        ) : null}
      </View>
      <AppText variant={size === 'md' ? 'subheading' : 'label'} align="center" numberOfLines={1}>
        {animal.name.ptBR}
      </AppText>
      <View style={styles.badgeRow}>
        <DiscoveryBadge state={state} compact={size === 'sm'} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.sm + 4,
    paddingBottom: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.card,
  },
  cardSm: { padding: spacing.sm, paddingBottom: spacing.sm + 4, gap: 6 },
  imageWrap: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 4,
  },
  veil: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  question: { fontFamily: 'Fredoka_700Bold', fontSize: 48, lineHeight: 56, color: colors.cacao },
  badgeRow: { alignItems: 'center' },
});
