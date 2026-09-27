import type { Animal } from '@/domain/animal';
import { hashString } from '@/utils/random';

import { discoveryState, type AnimalProgress } from './progress';

export type ProgressMap = Record<string, AnimalProgress>;

export function countDiscovered(animals: readonly Animal[], progress: ProgressMap): number {
  return animals.filter((a) => discoveryState(progress[a.id]) === 'discovered').length;
}

export function totalStars(progress: ProgressMap): number {
  return Object.values(progress).reduce((sum, p) => sum + p.stars, 0);
}

/** Most recently seen animals, newest first. */
export function recentAnimals(animals: readonly Animal[], progress: ProgressMap, limit = 8): Animal[] {
  return animals
    .filter((a) => progress[a.id]?.lastSeenAt)
    .sort((a, b) => (progress[b.id].lastSeenAt ?? '').localeCompare(progress[a.id].lastSeenAt ?? ''))
    .slice(0, limit);
}

/** Same animal for everyone on a given local day. */
export function animalOfTheDay(animals: readonly Animal[], date: Date = new Date()): Animal {
  const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  return animals[hashString(key) % animals.length];
}

/** Suggestions when there is no history yet: undiscovered animals first. */
export function suggestedAnimals(animals: readonly Animal[], progress: ProgressMap, exclude: string[], limit = 6): Animal[] {
  return animals
    .filter((a) => !exclude.includes(a.id) && discoveryState(progress[a.id]) !== 'discovered')
    .slice(0, limit);
}
