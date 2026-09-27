/**
 * Closed taxonomies. They feed filters, chips and the Challenge Engine.
 * Labels live in `src/content/labels.ts` so the domain stays locale-free.
 */

export const ANIMAL_CLASSES = [
  'mammal',
  'bird',
  'reptile',
  'amphibian',
  'fish',
  'insect',
  'arachnid',
  'other',
] as const;
export type AnimalClass = (typeof ANIMAL_CLASSES)[number];

export const DIETS = ['herbivore', 'carnivore', 'omnivore', 'insectivore', 'nectar_pollen', 'varies'] as const;
export type Diet = (typeof DIETS)[number];

export const HABITATS = [
  'farm',
  'home',
  'forest',
  'savanna',
  'grassland',
  'wetland',
  'freshwater',
  'ocean',
  'coast',
  'desert',
  'mountains',
  'urban',
  'mixed',
] as const;
export type Habitat = (typeof HABITATS)[number];

export const LOCOMOTIONS = ['walk', 'run', 'jump', 'climb', 'swim', 'fly', 'slither'] as const;
export type Locomotion = (typeof LOCOMOTIONS)[number];

export const BODY_COVERINGS = ['fur', 'feathers', 'scales', 'skin', 'exoskeleton', 'wool'] as const;
export type BodyCovering = (typeof BODY_COVERINGS)[number];

export const REPRODUCTIONS = ['eggs', 'live_birth'] as const;
export type Reproduction = (typeof REPRODUCTIONS)[number];

export const ACTIVITIES = ['diurnal', 'nocturnal', 'crepuscular', 'varies'] as const;
export type Activity = (typeof ACTIVITIES)[number];

export const DOMESTICATIONS = ['domestic', 'wild', 'mixed'] as const;
export type Domestication = (typeof DOMESTICATIONS)[number];

export const SIZE_CLASSES = ['tiny', 'small', 'medium', 'large', 'very_large'] as const;
export type SizeClass = (typeof SIZE_CLASSES)[number];

export const SCOPES = ['species', 'domestic_species', 'generic', 'life_stage'] as const;
export type AnimalScope = (typeof SCOPES)[number];

/**
 * Foods are grouped in families. A family is the unit of "plausibility":
 * if an animal eats anything from a family, no food from that family may be
 * used as a wrong answer (e.g. an animal that eats `plants` never gets
 * `grass` as a distractor).
 */
export const FOOD_FAMILIES = {
  animal_protein: ['meat', 'fish', 'squid', 'crustaceans', 'small_aquatic_animals'],
  small_creatures: ['insects', 'small_invertebrates'],
  greens: ['grass', 'hay', 'leaves', 'plants', 'bark', 'roots', 'flowers'],
  fruits_seeds: ['fruits', 'seeds', 'nuts'],
  flower_food: ['nectar', 'pollen'],
  prepared: ['prepared_food'],
} as const;
export type FoodFamily = keyof typeof FOOD_FAMILIES;
export type Food = (typeof FOOD_FAMILIES)[FoodFamily][number];

export const FOODS: readonly Food[] = Object.values(FOOD_FAMILIES).flat();

export function foodFamilyOf(food: Food): FoodFamily {
  const entry = (Object.entries(FOOD_FAMILIES) as [FoodFamily, readonly Food[]][]).find(([, foods]) =>
    foods.includes(food),
  );
  if (!entry) throw new Error(`Unknown food: ${food}`);
  return entry[0];
}

/**
 * Habitats grouped by landscape. Distractors must come from a group the
 * animal does not touch at all — neighbouring landscapes are too plausible.
 * `mixed` is not a place and is never used as an option.
 */
export const HABITAT_GROUPS = {
  water: ['ocean', 'coast', 'freshwater', 'wetland'],
  open_land: ['savanna', 'grassland', 'desert'],
  woods: ['forest', 'mountains'],
  human: ['farm', 'home', 'urban'],
} as const;
export type HabitatGroup = keyof typeof HABITAT_GROUPS;

export function habitatGroupOf(habitat: Habitat): HabitatGroup | null {
  const entry = (Object.entries(HABITAT_GROUPS) as [HabitatGroup, readonly Habitat[]][]).find(([, habitats]) =>
    habitats.includes(habitat),
  );
  return entry ? entry[0] : null;
}

export function isFood(value: string): value is Food {
  return (FOODS as readonly string[]).includes(value);
}

export function isOneOf<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (list as readonly string[]).includes(value);
}
