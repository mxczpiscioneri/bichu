import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AudioButton } from '@/components/animal/AudioButton';
import { Mascot } from '@/components/brand/Mascot';
import { TapOptions } from '@/components/challenge/TapOptions';
import { NotFound } from '@/components/feedback/NotFound';
import { AppText } from '@/components/ui/AppText';
import { BigButton } from '@/components/ui/BigButton';
import { RoundButton } from '@/components/ui/RoundButton';
import { ArExperience } from '@/ar/ArExperience';
import { useArStore, type ArStatus } from '@/ar/arStore';
import { isArAvailableFor } from '@/ar/availability';
import { loadViro } from '@/ar/viro';
import { AudioService, clipKeys } from '@/audio/AudioService';
import { useChallengeSession } from '@/challenges/useChallengeSession';
import { getAnimal } from '@/content/animals';
import { soundNameOf } from '@/content/labels';
import type { Animal } from '@/domain/animal';
import { withArticle } from '@/domain/language';
import { useLevel } from '@/stores/settingsStore';
import { colors, radius, spacing } from '@/theme';

const STATUS_TEXT: Record<ArStatus, (animal: Animal) => string> = {
  starting: () => 'Abrindo a câmera…',
  searching: () => 'Aponte para o chão e mexa o aparelho devagar.',
  surfaceFound: (animal) => `Encontrei um lugar! Toque para colocar ${withArticle(animal)}.`,
  placed: () => 'Gire com dois dedos e faça pinça para mudar o tamanho.',
  error: () => 'Não consegui carregar o animal. Vamos tentar de novo?',
};

export default function ArScreen() {
  const { animalId } = useLocalSearchParams<{ animalId: string }>();
  const animal = animalId ? getAnimal(animalId) : undefined;
  if (!animal) return <NotFound />;
  const viro = loadViro();
  if (!viro || !isArAvailableFor(animal)) return <ArUnavailable animal={animal} />;
  return <ArScreenContent animal={animal} viro={viro} />;
}

function ArScreenContent({ animal, viro }: { animal: Animal; viro: NonNullable<ReturnType<typeof loadViro>> }) {
  const status = useArStore((state) => state.status);
  const setStatus = useArStore((state) => state.setStatus);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setStatus('starting');
    return () => {
      setStatus('starting');
      AudioService.stop();
    };
  }, [setStatus]);

  return (
    <View style={styles.root}>
      <ArExperience viro={viro} animal={animal} />
      <SafeAreaView style={styles.overlay}>
        <View style={styles.top}>
          <RoundButton
            icon="back"
            size={48}
            accessibilityLabel="Sair da realidade aumentada"
            onPress={() => router.back()}
          />
          <AppText variant="subheading" color={colors.white} style={styles.title}>
            Ver no meu mundo
          </AppText>
          <View style={styles.tag}>
            <AppText variant="overline">Teste</AppText>
          </View>
        </View>
        <View style={styles.spacer} />
        <View style={styles.instruction}>
          <AppText variant="bodyStrong" color={colors.white} align="center">
            {STATUS_TEXT[status](animal)}
          </AppText>
        </View>
        {status === 'placed' ? (
          playing ? (
            <ArChallenge animal={animal} onDone={() => setPlaying(false)} />
          ) : (
            <View style={styles.panel}>
              <AppText variant="title" align="center">
                {animal.name.ptBR}
              </AppText>
              <View style={styles.row}>
                <AudioButton
                  label="Ouvir nome"
                  clipKey={clipKeys.name(animal.id)}
                  onPress={() => void AudioService.playAnimalName(animal.id)}
                />
                <AudioButton
                  label={`Ouvir ${soundNameOf(animal)}`}
                  clipKey={clipKeys.sound(animal.id)}
                  color={colors.terra}
                  onPress={() => void AudioService.playAnimalSound(animal.id)}
                />
              </View>
              <BigButton label="Desafio" icon="puzzle" variant="warm" onPress={() => setPlaying(true)} />
            </View>
          )
        ) : null}
      </SafeAreaView>
    </View>
  );
}

/** Same Challenge Engine and state machine as the 2D screen, rendered as an overlay. */
function ArChallenge({ animal, onDone }: { animal: Animal; onDone: () => void }) {
  const level = useLevel();
  const session = useChallengeSession({ kind: 'animal', animal }, level);
  const { current, solved } = session;

  if (!current || session.finished) {
    return (
      <View style={styles.panel}>
        <AppText variant="heading" align="center">
          Muito bem!
        </AppText>
        <BigButton label="Continuar" onPress={onDone} />
      </View>
    );
  }

  return (
    <View style={styles.panel}>
      <AppText variant="subheading" align="center">
        {solved ? current.explanation : current.prompt}
      </AppText>
      <TapOptions challenge={current} statusOf={session.statusOf} onChoose={session.choose} disabled={solved} />
      {solved ? <BigButton label="Próximo" onPress={session.next} /> : null}
    </View>
  );
}

function ArUnavailable({ animal }: { animal: Animal }) {
  return (
    <SafeAreaView style={styles.unavailable}>
      <Mascot pose="explore" height={180} />
      <AppText variant="title" align="center">
        Realidade aumentada em teste
      </AppText>
      <AppText variant="body" align="center">
        {`Em breve você poderá ver ${withArticle(animal)} no seu mundo. Por enquanto, vamos brincar por aqui!`}
      </AppText>
      <BigButton label="Voltar" icon="footprints" onPress={() => router.back()} style={styles.back} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  overlay: { ...StyleSheet.absoluteFill, padding: spacing.md, gap: spacing.md, pointerEvents: 'box-none' },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: 'rgba(52, 54, 47, 0.55)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  instruction: { backgroundColor: 'rgba(52, 54, 47, 0.6)', borderRadius: radius.lg, padding: spacing.md },
  tag: {
    backgroundColor: colors.sunSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  spacer: { flex: 1, pointerEvents: 'none' },
  panel: { backgroundColor: colors.cream, borderRadius: radius.lg, padding: spacing.md, gap: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-evenly' },
  unavailable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.cream,
  },
  back: { alignSelf: 'stretch' },
});
