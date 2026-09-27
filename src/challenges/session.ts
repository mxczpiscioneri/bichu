import type { Animal, Level } from '@/domain/animal';
import { shuffle, type Rng } from '@/utils/random';

import { availableTemplatesFor, generateChallenge } from './engine';
import { templatesForLevel } from './templates';
import type { Challenge, ChallengeTemplateId } from './types';

/** Read-only view of progress the session builder needs (keeps it pure). */
export interface ProgressLookup {
  completedTemplates(animalId: string): readonly string[];
  isDiscovered(animalId: string): boolean;
}

export const ROUNDS_PER_ANIMAL = 3;
export const ROUNDS_PER_GAME = 5;

/** Challenges about one animal ("Brincar" from the animal page). */
export function buildAnimalSession(params: {
  animal: Animal;
  level: Level;
  animals: readonly Animal[];
  progress: ProgressLookup;
  rng: Rng;
  rounds?: number;
}): Challenge[] {
  const { animal, level, animals, progress, rng, rounds = ROUNDS_PER_ANIMAL } = params;
  const templateIds = templatesForLevel(level).map((t) => t.id);
  const available = availableTemplatesFor(animal, level, animals, templateIds, rng);
  const done = new Set(progress.completedTemplates(animal.id));
  // Not-yet-completed challenges first, so each visit moves discovery forward.
  const ordered = [...shuffle(available.filter((id) => !done.has(id)), rng), ...shuffle(available.filter((id) => done.has(id)), rng)];
  return ordered
    .slice(0, rounds)
    .map((templateId) => generateChallenge({ templateId, animal, level, animals, rng }))
    .filter((challenge): challenge is Challenge => challenge !== null);
}

/** A game of one challenge type across several animals ("Brincar" tab). */
export function buildTypeSession(params: {
  templateId: ChallengeTemplateId;
  level: Level;
  animals: readonly Animal[];
  progress: ProgressLookup;
  rng: Rng;
  rounds?: number;
}): Challenge[] {
  const { templateId, level, animals, progress, rng, rounds = ROUNDS_PER_GAME } = params;
  const priority = (animal: Animal) => {
    if (progress.isDiscovered(animal.id)) return 2;
    return progress.completedTemplates(animal.id).includes(templateId) ? 1 : 0;
  };
  const ordered = [0, 1, 2].flatMap((p) => shuffle(animals.filter((a) => priority(a) === p), rng));
  const challenges: Challenge[] = [];
  for (const animal of ordered) {
    if (challenges.length >= rounds) break;
    const challenge = generateChallenge({ templateId, animal, level, animals, rng });
    if (challenge) challenges.push(challenge);
  }
  // Varied order even when priorities cluster animals by category.
  return shuffle(challenges, rng);
}
