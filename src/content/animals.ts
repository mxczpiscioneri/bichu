import seed from '../../content/animals/legacy-seed.json';

import type { Animal } from '@/domain/animal';

import { formatIssue, validateAnimals } from './validation';

export const CONTENT_STATUS: string = seed.status;
export const CONTENT_LOCALE: string = seed.locale;

function load(): Animal[] {
  const { animals, issues } = validateAnimals(seed.animals);
  const errors = issues.filter((issue) => issue.severity === 'error');
  if (errors.length > 0) {
    // Broken content must never ship silently; `npm run validate:content` catches this in CI.
    throw new Error(`Conteúdo de animais inválido:\n${errors.map(formatIssue).join('\n')}`);
  }
  return [...animals].sort((a, b) => a.name.ptBR.localeCompare(b.name.ptBR, 'pt-BR'));
}

/** All animals, sorted alphabetically by their pt-BR name. */
export const animals: readonly Animal[] = load();

const byId = new Map(animals.map((animal) => [animal.id, animal]));

export function getAnimal(id: string): Animal | undefined {
  return byId.get(id);
}

export function requireAnimal(id: string): Animal {
  const animal = byId.get(id);
  if (!animal) throw new Error(`Animal desconhecido: ${id}`);
  return animal;
}
