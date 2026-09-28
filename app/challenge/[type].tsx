import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AudioButton } from '@/components/animal/AudioButton';
import { MascotBubble } from '@/components/brand/MascotBubble';
import { DragBoard } from '@/components/challenge/DragBoard';
import { PlaceBoard } from '@/components/challenge/PlaceBoard';
import { RoundProgress } from '@/components/challenge/RoundProgress';
import { SessionSummary } from '@/components/challenge/SessionSummary';
import { SuccessScreen } from '@/components/challenge/SuccessScreen';
import { TapOptions } from '@/components/challenge/TapOptions';
import { DiscoveryCelebration } from '@/components/feedback/DiscoveryCelebration';
import { NotFound } from '@/components/feedback/NotFound';
import { AppText } from '@/components/ui/AppText';
import { RoundButton } from '@/components/ui/RoundButton';
import { clipKeys } from '@/audio/AudioService';
import { isTemplateId } from '@/challenges/templates';
import { isCorrect, type Challenge } from '@/challenges/types';
import { useChallengeSession, type SessionSource } from '@/challenges/useChallengeSession';
import { getAnimal } from '@/content/animals';
import { phrase, PHRASES } from '@/content/phrases';
import { useLevel } from '@/stores/settingsStore';
import { useLayout } from '@/hooks/useLayout';
import { colors, paletteForAnimal, spacing } from '@/theme';

function resolveSource(type: string | undefined, animalId: string | undefined): SessionSource | null {
  if (type === 'animal') {
    const animal = animalId ? getAnimal(animalId) : undefined;
    return animal ? { kind: 'animal', animal } : null;
  }
  return type && isTemplateId(type) ? { kind: 'type', templateId: type } : null;
}

export default function ChallengeScreen() {
  const { type, animalId } = useLocalSearchParams<{ type: string; animalId?: string }>();
  const source = resolveSource(type, animalId);
  if (!source) return <NotFound message="Essa brincadeira não existe." />;
  return <ChallengeFlow source={source} />;
}

function Stage({ challenge, session }: { challenge: Challenge; session: ReturnType<typeof useChallengeSession> }) {
  const common = { challenge, statusOf: session.statusOf, onChoose: session.choose, disabled: session.solved };
  const { isTablet } = useLayout();
  if (challenge.interaction === 'drag') return <DragBoard key={challenge.id} {...common} />;
  if (challenge.interaction === 'place') return <PlaceBoard key={challenge.id} {...common} />;
  return (
    <View style={styles.tapStage}>
      {challenge.promptIsAnimalSound ? (
        <AudioButton
          label="Ouvir o som de novo"
          clipKey={clipKeys.sound(challenge.animalId)}
          onPress={session.playPrompt}
          color={colors.leaf}
          size={isTablet ? 150 : 104}
          showLabel={false}
        />
      ) : null}
      <TapOptions key={challenge.id} {...common} />
    </View>
  );
}

function ChallengeFlow({ source }: { source: SessionSource }) {
  const session = useChallengeSession(source, useLevel());
  const { current, finished, solved, rounds, index } = session;
  // Celebrate each newly discovered animal once; derived, not stored.
  const [celebrated, setCelebrated] = useState(0);
  const latestDiscovery = session.discovered.length > celebrated ? session.discovered.at(-1) : undefined;
  const celebrating = latestDiscovery ? (getAnimal(latestDiscovery) ?? null) : null;

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));
  const { isTablet, padding } = useLayout();

  if (rounds.length === 0) {
    return <NotFound message="Ainda não há desafios aqui. Que tal explorar outro animal?" />;
  }

  // Each round takes the animal's colour; the sound quiz stays neutral so colour never hints the answer.
  const roundAnimal = current && !current.promptIsAnimalSound && !finished ? getAnimal(current.animalId) : undefined;
  const background = roundAnimal ? paletteForAnimal(roundAnimal).wash : colors.cream;
  const bubble =
    session.lastWrongAt && !solved ? phrase(PHRASES.tryAgain, session.tried.length) : (current?.hint ?? '');

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: background }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <RoundProgress total={rounds.length} current={index} />
        <RoundButton icon="close" size={48} accessibilityLabel="Sair da brincadeira" onPress={close} />
      </View>

      {finished ? (
        <SessionSummary
          rounds={rounds.length}
          starsEarned={session.starsEarned}
          discovered={session.discovered}
          onAgain={session.restart}
          onDone={close}
        />
      ) : current ? (
        <View style={[styles.body, isTablet && { paddingHorizontal: padding, gap: spacing.lg }]}>
          <AppText variant={isTablet ? 'hero' : 'title'} align="center" style={styles.prompt}>
            {current.prompt}
          </AppText>
          <MascotBubble
            text={bubble}
            accessory={
              current.promptIsAnimalSound ? null : (
                <RoundButton
                  icon="speaker"
                  size={48}
                  background={colors.sunSoft}
                  accessibilityLabel="Ouvir o nome do animal"
                  onPress={session.playPrompt}
                />
              )
            }
          />
          <Stage challenge={current} session={session} />
        </View>
      ) : null}

      {solved && current ? (
        <SuccessScreen
          title={phrase(PHRASES.correct, index)}
          explanation={current.explanation}
          answer={current.options.find((o) => isCorrect(current, o.id))}
          earnedStar={session.roundStar}
          isLast={index + 1 >= rounds.length}
          onContinue={session.next}
        />
      ) : null}
      <DiscoveryCelebration animal={celebrating} onClose={() => setCelebrated(session.discovered.length)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  body: { flex: 1, paddingHorizontal: spacing.md, paddingBottom: spacing.md, gap: spacing.md },
  prompt: { paddingHorizontal: spacing.sm },
  tapStage: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.xl },
});
