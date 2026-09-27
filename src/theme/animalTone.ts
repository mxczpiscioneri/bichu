import type { Animal } from '@/domain/animal';

import type { Tone } from './tokens';

/** Picks a habitat palette from the animal's first (main) habitat. */
export function toneForAnimal(animal: Animal): Tone {
  switch (animal.habitats[0]) {
    case 'farm':
      return 'farm';
    case 'home':
    case 'urban':
      return 'home';
    case 'savanna':
    case 'grassland':
    case 'desert':
      return 'savanna';
    case 'ocean':
    case 'coast':
    case 'freshwater':
    case 'wetland':
      return 'ocean';
    default:
      return 'forest';
  }
}
