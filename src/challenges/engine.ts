import type { Animal, Level } from '@/domain/animal';
import { fillTemplate } from '@/domain/language';
import { pickOne, shuffle, type Rng } from '@/utils/random';

import { ATTRIBUTE_RULES, type AttributeRule } from './rules';
import { getTemplate, optionCountFor } from './templates';
import type { Challenge, ChallengeOption, ChallengeTemplate, ChallengeTemplateId } from './types';

export interface GenerateInput {
  templateId: ChallengeTemplateId;
  animal: Animal;
  level: Level;
  /** Pool used to pick other animals (sound_to_animal). */
  animals: readonly Animal[];
  rng: Rng;
}

/** True when this animal's sound could be confused with the other's. */
function soundsConfusable(a: Animal, b: Animal): boolean {
  if (a.id === b.id) return true;
  if (a.soundGroup && a.soundGroup === b.soundGroup) return true;
  return (
    a.parentAnimalId === b.id ||
    b.parentAnimalId === a.id ||
    (!!a.parentAnimalId && a.parentAnimalId === b.parentAnimalId)
  );
}

function makeChallenge(
  template: ChallengeTemplate,
  animal: Animal,
  level: Level,
  options: ChallengeOption[],
  correct: ChallengeOption,
  answerPhrase: string,
  rng: Rng,
): Challenge {
  return {
    id: `${template.id}:${animal.id}:${Math.floor(rng() * 1e9).toString(36)}`,
    templateId: template.id,
    animalId: animal.id,
    level,
    interaction: template.interaction,
    prompt: fillTemplate(template.prompt, { animal }),
    explanation: fillTemplate(template.explanation, { animal, answer: answerPhrase }),
    options,
    correctOptionIds: [correct.id],
    promptIsAnimalSound: template.id === 'sound_to_animal',
  };
}

function generateSoundChallenge(
  input: GenerateInput,
  template: ChallengeTemplate,
  optionCount: number,
): Challenge | null {
  const { animal, animals, level, rng } = input;
  const pool = animals.filter((other) => !soundsConfusable(animal, other));
  const distractors: Animal[] = [];
  for (const candidate of shuffle(pool, rng)) {
    if (distractors.length >= optionCount - 1) break;
    // Distractors must also be distinguishable from each other.
    if (distractors.some((picked) => soundsConfusable(picked, candidate))) continue;
    distractors.push(candidate);
  }
  if (distractors.length < optionCount - 1) return null;

  const toOption = (a: Animal): ChallengeOption => ({ id: a.id, label: a.name.ptBR, animalId: a.id });
  const correct = toOption(animal);
  const options = shuffle([correct, ...distractors.map(toOption)], rng);
  return makeChallenge(template, animal, level, options, correct, '', rng);
}

function generateAttributeChallenge(
  input: GenerateInput,
  template: ChallengeTemplate,
  rule: AttributeRule,
  optionCount: number,
): Challenge | null {
  const { animal, level, rng } = input;
  if (!animal.challengeFlags[rule.flag]) return null;

  const correctValues = rule.correct(animal);
  if (correctValues.length === 0) return null;
  const distractors = rule.distractors(animal).filter((value) => !correctValues.includes(value));
  if (distractors.length === 0) return null;

  // Fewer safe distractors than requested → smaller question, never an unsafe one.
  const chosenDistractors = distractors.slice(0, optionCount - 1);
  const correctValue = pickOne(correctValues, rng);
  const toOption = (value: string): ChallengeOption => {
    const label = rule.label(value);
    return { id: value, label: label.label, icon: label.icon };
  };
  const correct = toOption(correctValue);
  const options = shuffle([correct, ...chosenDistractors.map(toOption)], rng);
  return makeChallenge(template, animal, level, options, correct, rule.label(correctValue).phrase, rng);
}

/**
 * Generates one challenge, or `null` when the animal/level cannot support it
 * (flag disabled, level disabled, or no safe wrong answers).
 */
export function generateChallenge(input: GenerateInput): Challenge | null {
  const template = getTemplate(input.templateId);
  const optionCount = optionCountFor(template, input.level);
  if (optionCount === null) return null;

  if (template.id === 'sound_to_animal') return generateSoundChallenge(input, template, optionCount);
  return generateAttributeChallenge(input, template, ATTRIBUTE_RULES[template.id], optionCount);
}

/** Templates this animal can play at this level. */
export function availableTemplatesFor(
  animal: Animal,
  level: Level,
  animals: readonly Animal[],
  templateIds: readonly ChallengeTemplateId[],
  rng: Rng,
): ChallengeTemplateId[] {
  return templateIds.filter((templateId) => generateChallenge({ templateId, animal, level, animals, rng }) !== null);
}
