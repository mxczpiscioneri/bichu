import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AudioService } from '@/audio/AudioService';
import type { Animal } from '@/domain/animal';
import { colors, radius, shadows, spacing, toneForAnimal, tones } from '@/theme';

import { AnimalImage } from '../animal/AnimalImage';
import { AppText } from '../ui/AppText';
import { BigButton } from '../ui/BigButton';
import { Icon } from '../ui/Icon';
import { PressableScale } from '../ui/PressableScale';

export function AnimalOfTheDayCard({ animal }: { animal: Animal }) {
  const tone = tones[toneForAnimal(animal)];
  return (
    <View style={[styles.card, { backgroundColor: tone.background }]}>
      <View style={styles.tag}>
        <Icon name="glowing" size={20} />
        <AppText variant="overline">Animal do dia</AppText>
      </View>
      <PressableScale
        onPress={() => void AudioService.playAnimalName(animal.id)}
        accessibilityLabel={`Ouvir o nome: ${animal.name.ptBR}`}
        style={styles.imageButton}
        pressedScale={0.97}
      >
        <View style={styles.halo} />
        <AnimalImage animalId={animal.id} size={188} />
      </PressableScale>
      <AppText variant="hero" align="center">
        {animal.name.ptBR}
      </AppText>
      <BigButton
        label="Descobrir"
        icon="magnifier"
        onPress={() => router.push({ pathname: '/animal/[id]', params: { id: animal.id } })}
        style={styles.cta}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg + 8,
    padding: spacing.lg,
    paddingTop: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.card,
  },
  tag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm + 4,
  },
  imageButton: { alignItems: 'center', justifyContent: 'center', padding: spacing.sm },
  halo: {
    position: 'absolute',
    width: 216,
    height: 216,
    borderRadius: 108,
    backgroundColor: colors.white,
    opacity: 0.55,
  },
  cta: { alignSelf: 'stretch', marginTop: spacing.xs },
});
