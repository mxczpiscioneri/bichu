import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimalFacts } from '@/components/animal/AnimalFacts';
import { AnimalImage } from '@/components/animal/AnimalImage';
import { AnimalTraits } from '@/components/animal/AnimalTraits';
import { AudioButton } from '@/components/animal/AudioButton';
import { DiscoveryBadge } from '@/components/animal/DiscoveryBadge';
import { DiscoverySteps } from '@/components/animal/DiscoverySteps';
import { SyllableRow } from '@/components/animal/SyllableRow';
import { DiscoveryCelebration } from '@/components/feedback/DiscoveryCelebration';
import { NotFound } from '@/components/feedback/NotFound';
import { AppText } from '@/components/ui/AppText';
import { BigButton } from '@/components/ui/BigButton';
import { PressableScale } from '@/components/ui/PressableScale';
import { RoundButton } from '@/components/ui/RoundButton';
import { isArAvailableFor } from '@/ar/availability';
import { AudioService, clipKeys } from '@/audio/AudioService';
import { getAnimal } from '@/content/animals';
import { soundNameOf } from '@/content/labels';
import type { Animal } from '@/domain/animal';
import { useDiscoveryWatcher } from '@/hooks/useDiscoveryWatcher';
import { discoveryState } from '@/progress/progress';
import { useAnimalProgress, useProgressStore } from '@/stores/progressStore';
import { useLevel } from '@/stores/settingsStore';
import { colors, radius, spacing, toneForAnimal, tones } from '@/theme';

const AUTOPLAY_DELAY_MS = 450;

export default function AnimalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const animal = id ? getAnimal(id) : undefined;
  if (!animal) return <NotFound />;
  return <AnimalDetail animal={animal} />;
}

function AnimalDetail({ animal }: { animal: Animal }) {
  const level = useLevel();
  const progress = useAnimalProgress(animal.id);
  const record = useProgressStore((state) => state.record);
  const tone = tones[toneForAnimal(animal)];
  const [celebrating, closeCelebration] = useDiscoveryWatcher([animal.id]);
  const soundLabel = `Ouvir o ${soundNameOf(animal)}`;

  useEffect(() => {
    record(animal.id, { type: 'opened' });
  }, [animal.id, record]);

  // Explorer mode is audio-first: say the name, then play the real sound.
  // Clips run in sequence on the single audio channel — never overlapping.
  useFocusEffect(
    useCallback(() => {
      const timer = level === 'explorer' ? setTimeout(() => void AudioService.playNameThenSound(animal.id), AUTOPLAY_DELAY_MS) : undefined;
      return () => {
        if (timer) clearTimeout(timer);
        AudioService.stop();
      };
    }, [animal.id, level]),
  );

  return (
    <SafeAreaView edges={['top']} style={[styles.root, { backgroundColor: tone.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.topBar}>
            <RoundButton glyph="‹" accessibilityLabel="Voltar" onPress={() => router.back()} />
            <DiscoveryBadge state={discoveryState(progress)} />
          </View>
          <PressableScale
            onPress={() => void AudioService.playAnimalName(animal.id)}
            accessibilityLabel={`Ouvir o nome: ${animal.name.ptBR}`}
            style={styles.imageButton}
            pressedScale={0.97}
          >
            <View style={styles.halo} />
            <AnimalImage animalId={animal.id} size={220} />
          </PressableScale>
          <AppText variant="hero" align="center" accessibilityRole="header">
            {animal.name.ptBR}
          </AppText>
          <SyllableRow syllables={animal.name.syllables} clipKey={clipKeys.name(animal.id)} />
        </View>

        <View style={styles.body}>
          <View style={styles.audioRow}>
            <AudioButton label="Ouvir o nome" clipKey={clipKeys.name(animal.id)} onPress={() => void AudioService.playAnimalName(animal.id)} />
            <AudioButton
              label={soundLabel}
              clipKey={clipKeys.sound(animal.id)}
              accent={colors.flame}
              onPress={() => void AudioService.playAnimalSound(animal.id)}
            />
          </View>

          <DiscoverySteps progress={progress} />
          <AnimalTraits animal={animal} />
          <AnimalFacts animal={animal} level={level} />

          <View style={styles.actions}>
            <BigButton
              label="Brincar"
              icon="puzzle"
              variant="warm"
              onPress={() => router.push({ pathname: '/challenge/[type]', params: { type: 'animal', animalId: animal.id } })}
            />
            {isArAvailableFor(animal) ? (
              <BigButton
                label="Ver no meu mundo"
                icon="camera"
                variant="light"
                onPress={() => router.push({ pathname: '/ar/[animalId]', params: { animalId: animal.id } })}
              />
            ) : null}
          </View>
        </View>
      </ScrollView>
      <DiscoveryCelebration animal={celebrating} onClose={closeCelebration} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: spacing.xxl },
  hero: { paddingHorizontal: spacing.lg - 4, paddingTop: spacing.sm, paddingBottom: spacing.lg, gap: spacing.sm, alignItems: 'center' },
  topBar: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  imageButton: { alignItems: 'center', justifyContent: 'center', padding: spacing.sm },
  halo: { position: 'absolute', width: 250, height: 250, borderRadius: 125, backgroundColor: colors.white, opacity: 0.6 },
  body: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: radius.lg + 12,
    borderTopRightRadius: radius.lg + 12,
    paddingHorizontal: spacing.lg - 4,
    paddingTop: spacing.lg,
    gap: spacing.lg,
    minHeight: 600,
  },
  audioRow: { flexDirection: 'row', gap: spacing.sm + 4 },
  actions: { gap: spacing.md },
});
