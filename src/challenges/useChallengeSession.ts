import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { track } from '@/analytics';
import type { AnalyticsEvents, Surface } from '@/analytics/events';
import { AudioService } from '@/audio/AudioService';
import { animals } from '@/content/animals';
import type { Animal, Level } from '@/domain/animal';
import { discoveryState } from '@/progress/progress';
import { useProgressStore } from '@/stores/progressStore';
import { createRng } from '@/utils/random';

import { buildAnimalSession, buildTypeSession, type ProgressLookup } from './session';
import { isCorrect, type Challenge, type ChallengeOption, type ChallengeTemplateId } from './types';

export type SessionSource = { kind: 'animal'; animal: Animal } | { kind: 'type'; templateId: ChallengeTemplateId };

function progressLookup(): ProgressLookup {
  const { byAnimal } = useProgressStore.getState();
  return {
    completedTemplates: (id) => byAnimal[id]?.challengesCompleted ?? [],
    isDiscovered: (id) => discoveryState(byAnimal[id]) === 'discovered',
  };
}

function buildRounds(source: SessionSource, level: Level): Challenge[] {
  const rng = createRng(Date.now());
  const progress = progressLookup();
  return source.kind === 'animal'
    ? buildAnimalSession({ animal: source.animal, level, animals, progress, rng })
    : buildTypeSession({ templateId: source.templateId, level, animals, progress, rng });
}

type SessionParams = AnalyticsEvents['level_retry'];

/** Anonymous statistics parameters: game id, mode and surface (plus the animal id for animal sessions). */
function sessionParams(source: SessionSource, level: Level, surface: Surface): SessionParams {
  return source.kind === 'animal'
    ? { level_id: 'animal', mode: level, surface, animal_id: source.animal.id }
    : { level_id: source.templateId, mode: level, surface };
}

/**
 * Challenge-state machine shared by every renderer (2D screen today, AR
 * overlay later): rounds, attempts, stars and discoveries.
 */
export function useChallengeSession(source: SessionSource, level: Level, surface: Surface = 'screen') {
  const [rounds, setRounds] = useState<Challenge[]>(() => buildRounds(source, level));
  const [index, setIndex] = useState(0);
  const [tried, setTried] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [starsEarned, setStarsEarned] = useState(0);
  const [roundStar, setRoundStar] = useState(false);
  const [discovered, setDiscovered] = useState<string[]>([]);
  const [lastWrongAt, setLastWrongAt] = useState<number | null>(null);
  const record = useProgressStore((state) => state.record);
  const sourceRef = useRef(source);

  const current = rounds[index] as Challenge | undefined;
  const finished = rounds.length > 0 && index >= rounds.length;

  // Anonymous statistics: one start per session (also on "Brincar de novo"), then one complete or one quit.
  const stats = useRef({
    params: sessionParams(source, level, surface),
    mistakes: 0,
    round: 0,
    session: { done: false },
  });
  useEffect(() => {
    stats.current.round = index;
  }, [index]);
  useEffect(() => {
    if (rounds.length === 0) return;
    // Same mutable object for the whole hook: the cleanup reads the round reached when leaving.
    const live = stats.current;
    const session = { done: false };
    live.session = session;
    live.mistakes = 0;
    track('level_start', { ...live.params, rounds: rounds.length });
    return () => {
      if (!session.done) track('level_quit', { ...live.params, round: live.round + 1 });
    };
  }, [rounds]);
  useEffect(() => {
    if (!finished) return;
    stats.current.session.done = true;
    track('level_complete', {
      ...stats.current.params,
      rounds: rounds.length,
      stars: starsEarned,
      mistakes: stats.current.mistakes,
      discovered: discovered.length,
    });
    // Only when the session ends; rounds, stars and discoveries are final by then.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const playPrompt = useCallback(() => {
    if (!current) return;
    if (current.promptIsAnimalSound) void AudioService.playAnimalSound(current.animalId);
    else void AudioService.playAnimalName(current.animalId);
  }, [current]);

  // Each round opens with audio: the real sound, or the animal's name.
  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(playPrompt, 350);
    return () => clearTimeout(timer);
  }, [current, playPrompt]);

  useEffect(() => () => AudioService.stop(), []);

  const choose = useCallback(
    (option: ChallengeOption): boolean => {
      if (!current || solved) return false;
      if (!isCorrect(current, option.id)) {
        stats.current.mistakes += 1;
        setTried((list) => (list.includes(option.id) ? list : [...list, option.id]));
        setLastWrongAt(Date.now());
        return false;
      }
      setSolved(true);
      void AudioService.playFeedback('correct');
      const result = record(current.animalId, { type: 'challengeCompleted', templateId: current.templateId });
      setRoundStar(result.starsEarned > 0);
      if (result.starsEarned) setStarsEarned((n) => n + result.starsEarned);
      if (result.justDiscovered) setDiscovered((list) => [...list, current.animalId]);
      return true;
    },
    [current, record, solved],
  );

  const next = useCallback(() => {
    AudioService.stop();
    setTried([]);
    setSolved(false);
    setRoundStar(false);
    setLastWrongAt(null);
    setIndex((i) => i + 1);
  }, []);

  const restart = useCallback(() => {
    track('level_retry', stats.current.params);
    setRounds(buildRounds(sourceRef.current, level));
    setIndex(0);
    setTried([]);
    setSolved(false);
    setStarsEarned(0);
    setRoundStar(false);
    setDiscovered([]);
    setLastWrongAt(null);
  }, [level]);

  const statusOf = useCallback(
    (optionId: string) => {
      if (solved && current && isCorrect(current, optionId)) return 'correct' as const;
      return tried.includes(optionId) ? ('tried' as const) : ('idle' as const);
    },
    [current, solved, tried],
  );

  return useMemo(
    () => ({
      rounds,
      index,
      current,
      finished,
      solved,
      tried,
      starsEarned,
      roundStar,
      discovered,
      lastWrongAt,
      choose,
      next,
      restart,
      statusOf,
      playPrompt,
    }),
    [
      rounds,
      index,
      current,
      finished,
      solved,
      tried,
      starsEarned,
      roundStar,
      discovered,
      lastWrongAt,
      choose,
      next,
      restart,
      statusOf,
      playPrompt,
    ],
  );
}
