import { animals } from '@/content/animals';

import { contrastRatio, paletteForAnimal } from '../animalColor';

describe('animal palettes', () => {
  it('every animal has a signature colour', () => {
    animals.forEach((animal) => expect(animal.color).toMatch(/^#[0-9A-F]{6}$/i));
  });

  it('keeps text readable for every animal', () => {
    for (const animal of animals) {
      const p = paletteForAnimal(animal);
      expect(contrastRatio(p.strong, '#FFFFFF')).toBeGreaterThanOrEqual(3);
      expect(contrastRatio(p.text, p.wash)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
