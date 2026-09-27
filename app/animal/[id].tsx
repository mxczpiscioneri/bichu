import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimalFacts } from '@/components/animal/AnimalFacts';
import { AnimalMedallion } from '@/components/animal/AnimalMedallion';
import { AnimalTraits } from '@/components/animal/AnimalTraits';
import { AudioButton } from '@/components/animal/AudioButton';
import { DiscoveryBadge } from '@/components/animal/DiscoveryBadge';
import { DiscoverySteps } from '@/components/animal/DiscoverySteps';
import { SyllableRow } from '@/components/animal/SyllableRow';
import { Mascot } from '@/components/brand/Mascot';
import { DiscoveryCelebration } from '@/components/feedback/DiscoveryCelebration';
import { NotFound } from '@/components/feedback/NotFound';
import { AppText } from '@/components/ui/AppText';
import { BigButton } from '@/components/ui/BigButton';
import { HabitatScene, sceneForAnimal } from '@/components/ui/HabitatScene';
import { PressableScale } from '@/components/ui/PressableScale';
import { RoundButton } from '@/components/ui/RoundButton';
import { isArAvailableFor } from '@/ar/availability';
import { AudioService, clipKeys } from '@/audio/AudioService';
import { getAnimal } from '@/content/animals';
import { CLASS_LABELS, soundNameOf } from '@/content/labels';
import type { Animal } from '@/domain/animal';
import { useDiscoveryWatcher } from '@/hooks/useDiscoveryWatcher';
import { discoveryState } from '@/progress/progress';
import { useAnimalProgress, useProgressStore } from '@/stores/progressStore';
import { useLevel } from '@/stores/settingsStore';
import { colors, radius, spacing } from '@/theme';

const AUTOPLAY_DELAY_MS = 450;

export default function AnimalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const animal = id ? getAnimal(id) : undefined;
  if (!animal) return <NotFound />;
  return <AnimalDetail animal={animal} />;
}

function AnimalDetail({ animal }: { animal: Animal }) {
  const level = useLevel();
  const insets = useSafeAreaInsets();
  const progress = useAnimalProgress(animal.id);
  const record = useProgressStore((state) => state.record);
  const [celebrating, closeCelebration] = useDiscoveryWatcher([animal.id]);

  useEffect(() => {
    record(animal.id, { type: 'opened' });
  }, [animal.id, record]);

  // Explorer mode is audio-first: say the name, then play the real sound.
  // Clips run in sequence on the single audio channel — never overlapping.
  useFocusEffect(
    useCallback(() => {
      const timer =
        level === 'explorer'
          ? setTimeout(() => void AudioService.playNameThenSound(animal.id), AUTOPLAY_DELAY_MS)
          : undefined;
      return () => {
        if (timer) clearTimeout(timer);
        AudioService.stop();
      };
    }, [animal.id, level]),
  );

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={[styles.hero, { paddingTop: insets.top + spacing.sm }]}>
          <HabitatScene scene={sceneForAnimal(animal)} />
          <View style={[styles.topBar, { top: insets.top + spacing.sm }]}>
            <RoundButton icon="back" accessibilityLabel="Voltar" onPress={() => router.back()} size={48} />
            <DiscoveryBadge state={discoveryState(progress)} />
          </View>
          <PressableScale
            onPress={() => void AudioService.playAnimalName(animal.id)}
            accessibilityLabel={`Ouvir o nome: ${animal.name.ptBR}`}
            pressedScale={0.97}>
            <AnimalMedallion animalId={animal.id} size={210} />
          </PressableScale>
        </View>

        <View style={styles.sheet}>
          <View style={styles.titleRow}>
            <AppText
              variant="hero"
              accessibilityRole="header"
              style={styles.name}
              numberOfLines={1}
              adjustsFontSizeToFit>
              {animal.name.ptBR}
            </AppText>
            <View style={styles.classTag}>
              <AppText variant="caption" color={colors.forest} style={styles.classText}>
                {CLASS_LABELS[animal.taxonomy.class].label}
              </AppText>
            </View>
          </View>
          <SyllableRow syllables={animal.name.syllables} clipKey={clipKeys.name(animal.id)} />
          <AnimalTraits animal={animal} />

          <View style={styles.audioRow}>
            <AudioButton
              label="Ouvir nome"
              clipKey={clipKeys.name(animal.id)}
              color={colors.leaf}
              onPress={() => void AudioService.playAnimalName(animal.id)}
            />
            <AudioButton
              label={`Ouvir ${soundNameOf(animal)}`}
              clipKey={clipKeys.sound(animal.id)}
              color={colors.terra}
              onPress={() => void AudioService.playAnimalSound(animal.id)}
            />
          </View>

          <DiscoverySteps progress={progress} />
          <AnimalFacts animal={animal} level={level} />

          <View style={styles.actions}>
            <BigButton
              label="Brincar"
              icon="puzzle"
              variant="warm"
              onPress={() =>
                router.push({ pathname: '/challenge/[type]', params: { type: 'animal', animalId: animal.id } })
              }
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
          <View style={styles.peek}>
            <Mascot pose="explore" height={92} animated={false} />
          </View>
        </View>
      </ScrollView>
      <DiscoveryCelebration animal={celebrating} onClose={closeCelebration} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  scroll: { flexGrow: 1 },
  hero: {
    minHeight: 360,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: spacing.xl + 8,
    overflow: 'hidden',
  },
  topBar: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheet: {
    flexGrow: 1,
    marginTop: -spacing.lg,
    backgroundColor: colors.cream,
    borderTopLeftRadius: radius.lg + 6,
    borderTopRightRadius: radius.lg + 6,
    paddingHorizontal: spacing.lg - 4,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl + 60,
    gap: spacing.lg - 4,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 4 },
  name: { flexShrink: 1 },
  classTag: {
    backgroundColor: colors.leafSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 4,
  },
  classText: { fontFamily: 'Nunito_800ExtraBold' },
  audioRow: { flexDirection: 'row', justifyContent: 'space-evenly', paddingVertical: spacing.xs },
  actions: { gap: spacing.md },
  peek: { position: 'absolute', right: spacing.sm, bottom: 0 },
});
