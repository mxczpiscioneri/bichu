import { withArticle, withDe } from '@/domain/language';

import { animals, getAnimal, requireAnimal } from '../animals';
import { animalsInCollection } from '../collections';

describe('animal loader', () => {
  it('loads all 22 legacy animals', () => {
    expect(animals).toHaveLength(22);
  });

  it('is sorted by pt-BR name and looks animals up by id', () => {
    const names = animals.map((a) => a.name.ptBR);
    expect([...names].sort((a, b) => a.localeCompare(b, 'pt-BR'))).toEqual(names);
    expect(getAnimal('lion')?.name.ptBR).toBe('Leão');
    expect(getAnimal('dragon')).toBeUndefined();
    expect(() => requireAnimal('dragon')).toThrow();
  });

  it('keeps media paths predictable (id-based)', () => {
    for (const animal of animals) {
      expect(animal.media.image).toBe(`assets/animals/images/${animal.id}.png`);
      expect(animal.media.sound).toBe(`assets/animals/sounds/${animal.id}.mp3`);
      expect(animal.media.nameAudio).toBe(`assets/animals/names/${animal.id}_name.mp3`);
    }
  });

  it('builds pt-BR phrases with the right article', () => {
    expect(withArticle(requireAnimal('lion'))).toBe('o leão');
    expect(withDe(requireAnimal('bee'))).toBe('da abelha');
  });

  it('derives collections from data', () => {
    const farm = animalsInCollection(animals, 'farm').map((a) => a.id);
    expect(farm).toEqual(expect.arrayContaining(['cow', 'pig', 'sheep', 'horse']));
    expect(farm).not.toContain('lion');
    expect(animalsInCollection(animals, 'birds').every((a) => a.taxonomy.class === 'bird')).toBe(true);
  });
});
