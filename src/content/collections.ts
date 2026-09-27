import type { Animal, AnimalClass, Domestication, Habitat } from '@/domain/animal';

import type { IconName } from './icons';

/**
 * Collections are declarative filters over the dataset. The same definitions
 * feed Explore filters and Bichupédia groups, so a new animal joins every
 * matching collection automatically.
 */
export interface CollectionDefinition {
  id: string;
  label: string;
  icon: IconName;
  /** Palette key from the theme (habitat palettes in docs/BRAND.md). */
  tone: 'farm' | 'forest' | 'savanna' | 'ocean' | 'home' | 'sky';
  match: {
    habitats?: Habitat[];
    classes?: AnimalClass[];
    domestication?: Domestication[];
  };
}

export const COLLECTIONS: readonly CollectionDefinition[] = [
  { id: 'farm', label: 'Fazenda', icon: 'tractor', tone: 'farm', match: { habitats: ['farm'] } },
  { id: 'home', label: 'Em casa', icon: 'house', tone: 'home', match: { habitats: ['home'] } },
  { id: 'savanna', label: 'Savana', icon: 'sunrise', tone: 'savanna', match: { habitats: ['savanna'] } },
  { id: 'forest', label: 'Floresta', icon: 'tree', tone: 'forest', match: { habitats: ['forest'] } },
  { id: 'ocean', label: 'Oceano', icon: 'wave', tone: 'ocean', match: { habitats: ['ocean', 'coast'] } },
  { id: 'birds', label: 'Aves', icon: 'feather', tone: 'sky', match: { classes: ['bird'] } },
  { id: 'wild', label: 'Selvagens', icon: 'footprints', tone: 'savanna', match: { domestication: ['wild'] } },
];

export const EXPLORE_FILTER_IDS = ['farm', 'wild', 'birds', 'ocean'] as const;
export const BICHUPEDIA_COLLECTION_IDS = ['farm', 'home', 'savanna', 'forest', 'ocean', 'birds'] as const;

export function matchesCollection(animal: Animal, collection: CollectionDefinition): boolean {
  const { habitats, classes, domestication } = collection.match;
  if (habitats && !habitats.some((h) => animal.habitats.includes(h))) return false;
  if (classes && !classes.includes(animal.taxonomy.class)) return false;
  if (domestication && !domestication.includes(animal.domestication)) return false;
  return true;
}

export function getCollection(id: string): CollectionDefinition {
  const collection = COLLECTIONS.find((c) => c.id === id);
  if (!collection) throw new Error(`Coleção desconhecida: ${id}`);
  return collection;
}

export function animalsInCollection(animals: readonly Animal[], id: string): Animal[] {
  const collection = getCollection(id);
  return animals.filter((animal) => matchesCollection(animal, collection));
}
