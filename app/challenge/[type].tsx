import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MascotBubble } from '@/components/brand/MascotBubble';
import { DragBoard } from '@/components/challenge/DragBoard';
import { FeedbackPanel } from '@/components/challenge/FeedbackPanel';
import { RoundProgress } from '@/components/challenge/RoundProgress';
import { SessionSummary } from '@/components/challenge/SessionSummary';
import { TapOptions } from '@/components/challenge/TapOptions';
import { DiscoveryCelebration } from '@/components/feedback/DiscoveryCelebration';
import { NotFound } from '@/components/feedback/NotFound';
import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { RoundButton } from '@/components/ui/RoundButton';
import { isTemplateId } from '@/challenges/templates';
import { useChallengeSession, type SessionSource } from '@/challenges/useChallengeSession';
import { getAnimal } from '@/content/animals';
import { phrase, PHRASES } from '@/content/phrases';
import { useLevel } from '@/stores/settingsStore';
import { colors, radius, spacing, toneForAnimal, tones } from '@/theme';

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

function ChallengeFlow({ source }: { source: SessionSource }) {
  const level = useLevel();
  const session = useChallengeSession(source, level);
  const { current, finished, solved, rounds, index } = session;
  // Celebrate each newly discovered animal once; derived, not stored.
  const [celebrated, setCelebrated] = useState(0);
  const latestDiscovery = session.discovered.length > celebrated ? session.discovered.at(-1) : undefined;
  const celebrating = latestDiscovery ? (getAnimal(latestDiscovery) ?? null) : null;

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  if (rounds.length === 0) {
    return <NotFound message="Ainda não há desafios aqui. Que tal explorar outro animal?" />;
  }

  const animal = current ? getAnimal(current.animalId) : undefined;
  const tone = animal ? tones[toneForAnimal(animal)] : tones.forest;
  const bubbleText = session.lastWrongAt && !solved ? phrase(PHRASES.tryAgain, session.tried.length) : (current?.prompt ?? '');

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: finished ? colors.cream : tone.background }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <RoundButton glyph="×" accessibilityLabel="Sair da brincadeira" onPress={close} />
        <RoundProgress total={rounds.length} current={index} />
        <View style={styles.stars} accessibilityLabel={`${session.starsEarned} estrelas`} accessible>
          <Icon name="star" size={26} />
          <AppText variant="label">{session.starsEarned}</AppText>
        </View>
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
        <View style={styles.body}>
          <MascotBubble
            size="lg"
            text={bubbleText}
            accessory={
              <RoundButton
                icon="speaker"
                size={52}
                background={colors.sunSoft}
                accessibilityLabel={current.promptIsAnimalSound ? 'Ouvir o som de novo' : 'Ouvir o nome do animal'}
                onPress={session.playPrompt}
              />
            }
          />
          <View style={styles.stage}>
            {current.interaction === 'drag' ? (
              <DragBoard key={current.id} challenge={current} statusOf={session.statusOf} onChoose={session.choose} disabled={solved} />
            ) : (
              <TapOptions key={current.id} challenge={current} statusOf={session.statusOf} onChoose={session.choose} disabled={solved} />
            )}
          </View>
          {solved ? (
            <FeedbackPanel
              title={phrase(PHRASES.correct, index)}
              explanation={current.explanation}
              earnedStar={session.roundStar}
              continueLabel={index + 1 >= rounds.length ? 'Terminar' : 'Continuar'}
              onContinue={session.next}
            />
          ) : null}
        </View>
      ) : null}
      <DiscoveryCelebration animal={celebrating} onClose={() => setCelebrated(session.discovered.length)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: spacing.sm + 6,
    minWidth: 64,
    justifyContent: 'center',
  },
  body: { flex: 1, padding: spacing.md, gap: spacing.lg },
  stage: { flex: 1, justifyContent: 'center' },
});
