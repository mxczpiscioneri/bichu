import type { Animal, ChallengeFlagKey } from '@/domain/animal';
import {
  ANIMAL_CLASSES,
  BODY_COVERINGS,
  foodFamilyOf,
  habitatGroupOf,
  REPRODUCTIONS,
  type AnimalClass,
  type BodyCovering,
  type Diet,
  type Food,
  type FoodFamily,
  type Habitat,
  type HabitatGroup,
  type Locomotion,
  type Reproduction,
} from '@/domain/taxonomy';
import {
  BODY_COVERING_LABELS,
  CLASS_LABELS,
  FOOD_LABELS,
  HABITAT_LABELS,
  LOCOMOTION_LABELS,
  REPRODUCTION_LABELS,
  type TaxonomyLabel,
} from '@/content/labels';

import type { ChallengeTemplateId } from './types';

/**
 * A rule turns one attribute of an Animal into a question.
 *
 * - `correct`: every value that is a right answer for this animal.
 * - `distractors`: values that are SAFELY wrong, in order of preference.
 *   Anything biologically plausible for the animal must be left out — when in
 *   doubt, leave it out. If a rule cannot find a safe distractor the engine
 *   simply does not generate the challenge.
 */
export interface AttributeRule<T extends string = string> {
  templateId: Exclude<ChallengeTemplateId, 'sound_to_animal'>;
  flag: ChallengeFlagKey;
  correct(animal: Animal): T[];
  distractors(animal: Animal): T[];
  label(value: T): TaxonomyLabel;
}

// ---------------------------------------------------------------- food

/** Which food families are clearly wrong for each diet (ordered). */
const SAFE_FOOD_FAMILIES_BY_DIET: Record<Diet, FoodFamily[]> = {
  carnivore: ['greens', 'flower_food', 'fruits_seeds'],
  herbivore: ['animal_protein', 'flower_food'],
  // Omnivores eat almost anything; only flower nectar is clearly wrong.
  omnivore: ['flower_food'],
  insectivore: ['greens', 'fruits_seeds', 'flower_food'],
  nectar_pollen: ['animal_protein', 'greens'],
  varies: [],
};

/** Iconic food shown for a family when used as a wrong answer. */
const FAMILY_REPRESENTATIVES: Record<FoodFamily, Food[]> = {
  animal_protein: ['meat', 'fish'],
  small_creatures: ['insects'],
  greens: ['grass', 'leaves'],
  fruits_seeds: ['fruits', 'seeds'],
  flower_food: ['nectar'],
  prepared: [],
};

/** Round-robin across families so options look different from each other. */
function interleave<T>(groups: T[][]): T[] {
  const result: T[] = [];
  const longest = Math.max(0, ...groups.map((g) => g.length));
  for (let i = 0; i < longest; i += 1) groups.forEach((g) => i < g.length && result.push(g[i]));
  return result;
}

export const foodRule: AttributeRule<Food> = {
  templateId: 'food',
  flag: 'food',
  correct: (animal) => animal.foods,
  distractors: (animal) => {
    const eaten = new Set(animal.foods.map(foodFamilyOf));
    const families = SAFE_FOOD_FAMILIES_BY_DIET[animal.diet].filter((family) => !eaten.has(family));
    return interleave(families.map((family) => FAMILY_REPRESENTATIVES[family]));
  },
  label: (value) => FOOD_LABELS[value],
};

// ---------------------------------------------------------------- habitat

/** Preference order for wrong places. `farm`/`urban` are never wrong enough. */
const HABITAT_DISTRACTORS: Habitat[] = ['ocean', 'desert', 'home', 'forest', 'savanna', 'mountains'];

/** Landscapes that blend into each other (savanna woodland, forest edges). */
const ADJACENT_GROUPS: Partial<Record<HabitatGroup, HabitatGroup[]>> = {
  open_land: ['woods'],
  woods: ['open_land'],
};

export const habitatRule: AttributeRule<Habitat> = {
  templateId: 'habitat',
  flag: 'habitat',
  correct: (animal) => animal.habitats.filter((h) => h !== 'mixed'),
  distractors: (animal) => {
    const groups = animal.habitats.map(habitatGroupOf).filter((g): g is HabitatGroup => g !== null);
    const touched = new Set<HabitatGroup>([...groups, ...groups.flatMap((g) => ADJACENT_GROUPS[g] ?? [])]);
    // Animals living with people can be found on almost any kind of land.
    const livesWithPeople = animal.domestication !== 'wild';
    return HABITAT_DISTRACTORS.filter((habitat) => {
      const group = habitatGroupOf(habitat);
      if (group === null || touched.has(group)) return false;
      if (livesWithPeople && (group === 'woods' || habitat === 'savanna')) return false;
      return true;
    });
  },
  label: (value) => HABITAT_LABELS[value],
};

// ---------------------------------------------------------------- locomotion

export const locomotionRule: AttributeRule<Locomotion> = {
  templateId: 'locomotion',
  flag: 'locomotion',
  correct: (animal) => animal.locomotion,
  distractors: (animal) => {
    const has = (value: Locomotion) => animal.locomotion.includes(value);
    const result: Locomotion[] = [];
    // Many land animals can swim, jump or climb a bit, so those are only
    // "safely wrong" for a few body plans.
    if (!has('fly') && animal.taxonomy.class !== 'bird' && animal.taxonomy.class !== 'insect') result.push('fly');
    // Seals and other swimmers wriggle on land, so "slithering" is only safely
    // wrong for animals that clearly run, jump, climb or fly.
    const clearlyLimbed = (['run', 'jump', 'climb', 'fly'] as Locomotion[]).some(has);
    if (!has('slither') && clearlyLimbed) result.push('slither');
    if (!has('swim') && animal.taxonomy.class === 'insect') result.push('swim');
    if (animal.locomotion.every((l) => l === 'swim')) result.push('walk', 'climb');
    return result;
  },
  label: (value) => LOCOMOTION_LABELS[value],
};

// ---------------------------------------------------------------- body covering

const FUR_LIKE: BodyCovering[] = ['fur', 'wool', 'skin'];

export const bodyCoveringRule: AttributeRule<BodyCovering> = {
  templateId: 'body_covering',
  flag: 'bodyCovering',
  correct: (animal) => [animal.bodyCovering],
  distractors: (animal) => {
    const own = animal.bodyCovering;
    const cls = animal.taxonomy.class;
    const preference: BodyCovering[] = ['feathers', 'scales', 'fur', 'exoskeleton'];
    return preference.filter((value) => {
      if (value === own) return false;
      // Mammal coats blur together (sparse hair, wool, thick skin).
      if (cls === 'mammal' && FUR_LIKE.includes(value)) return false;
      // Many insects are fuzzy; birds have scaly legs.
      if (cls === 'insect' && value === 'fur') return false;
      if (cls === 'bird' && value === 'scales') return false;
      return BODY_COVERINGS.includes(value);
    });
  },
  label: (value) => BODY_COVERING_LABELS[value],
};

// ---------------------------------------------------------------- reproduction

export const reproductionRule: AttributeRule<Reproduction> = {
  templateId: 'reproduction',
  flag: 'reproduction',
  correct: (animal) => [animal.reproduction],
  distractors: (animal) => REPRODUCTIONS.filter((value) => value !== animal.reproduction),
  label: (value) => REPRODUCTION_LABELS[value],
};

// ---------------------------------------------------------------- class

const CLASS_DISTRACTORS: AnimalClass[] = ['mammal', 'bird', 'fish', 'reptile', 'insect', 'amphibian'];

export const classRule: AttributeRule<AnimalClass> = {
  templateId: 'class',
  flag: 'class',
  correct: (animal) => [animal.taxonomy.class],
  distractors: (animal) =>
    CLASS_DISTRACTORS.filter((value) => value !== animal.taxonomy.class && ANIMAL_CLASSES.includes(value)),
  label: (value) => CLASS_LABELS[value],
};

export const ATTRIBUTE_RULES = {
  food: foodRule,
  habitat: habitatRule,
  locomotion: locomotionRule,
  body_covering: bodyCoveringRule,
  reproduction: reproductionRule,
  class: classRule,
} satisfies Record<Exclude<ChallengeTemplateId, 'sound_to_animal'>, AttributeRule>;
