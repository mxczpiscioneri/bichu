import { animals, requireAnimal } from '@/content/animals';
import type { Animal, Level } from '@/domain/animal';
import { foodFamilyOf, habitatGroupOf } from '@/domain/taxonomy';
import { createRng } from '@/utils/random';

import { generateChallenge } from '../engine';
import { ATTRIBUTE_RULES } from '../rules';
import { buildAnimalSession, buildTypeSession, type ProgressLookup } from '../session';
import { CHALLENGE_TEMPLATE_IDS, type ChallengeTemplateId } from '../types';

const LEVELS: Level[] = ['explorer', 'adventurer'];
const noProgress: ProgressLookup = { completedTemplates: () => [], isDiscovered: () => false };

function gen(templateId: ChallengeTemplateId, animal: Animal, level: Level, seed = 1) {
  return generateChallenge({ templateId, animal, level, animals, rng: createRng(seed) });
}

describe('Challenge Engine — invariants for every animal, type and level', () => {
  for (const animal of animals) {
    for (const templateId of CHALLENGE_TEMPLATE_IDS) {
      for (const level of LEVELS) {
        it(`${animal.id} / ${templateId} / ${level}`, () => {
          for (let seed = 1; seed <= 5; seed += 1) {
            const challenge = gen(templateId, animal, level, seed);
            if (!challenge) continue;
            const ids = challenge.options.map((o) => o.id);
            expect(new Set(ids).size).toBe(ids.length); // no duplicate options
            expect(challenge.correctOptionIds.length).toBeGreaterThanOrEqual(1);
            challenge.correctOptionIds.forEach((id) => expect(ids).toContain(id));
            expect(challenge.options.length).toBeGreaterThanOrEqual(2);
            expect(challenge.options.length).toBeLessThanOrEqual(level === 'explorer' ? 2 : 3);
            expect(challenge.prompt).not.toMatch(/[{}]/);
            expect(challenge.explanation).not.toMatch(/[{}]/);
            expect(challenge.animalId).toBe(animal.id);
          }
        });
      }
    }
  }
});

describe('challengeFlags', () => {
  it('never generates a food challenge when flags.food is false (bear, monkey)', () => {
    for (const id of ['bear', 'monkey']) {
      const animal = requireAnimal(id);
      expect(animal.challengeFlags.food).toBe(false);
      LEVELS.forEach((level) => expect(gen('food', animal, level)).toBeNull());
    }
  });

  it('respects a flag switched off at runtime', () => {
    const lion = requireAnimal('lion');
    const noHabitat: Animal = { ...lion, challengeFlags: { ...lion.challengeFlags, habitat: false } };
    expect(gen('habitat', noHabitat, 'explorer')).toBeNull();
    expect(gen('habitat', lion, 'explorer')).not.toBeNull();
  });
});

describe('levels', () => {
  it('Explorer shows 2 options, Adventurer 3 when enough safe distractors exist', () => {
    const lion = requireAnimal('lion');
    expect(gen('food', lion, 'explorer')?.options).toHaveLength(2);
    expect(gen('food', lion, 'adventurer')?.options).toHaveLength(3);
    expect(gen('sound_to_animal', lion, 'explorer')?.options).toHaveLength(2);
    expect(gen('sound_to_animal', lion, 'adventurer')?.options).toHaveLength(3);
  });

  it('"class" is disabled for Explorer', () => {
    expect(gen('class', requireAnimal('lion'), 'explorer')).toBeNull();
    expect(gen('class', requireAnimal('lion'), 'adventurer')).not.toBeNull();
  });
});

describe('distractor safety', () => {
  it('food distractors never come from a family the animal eats', () => {
    for (const animal of animals) {
      const eaten = new Set(animal.foods.map(foodFamilyOf));
      ATTRIBUTE_RULES.food.distractors(animal).forEach((food) => {
        expect(animal.foods).not.toContain(food);
        expect(eaten.has(foodFamilyOf(food))).toBe(false);
      });
    }
  });

  it('lion food: meat is right, and only clearly wrong foods are offered', () => {
    const challenge = gen('food', requireAnimal('lion'), 'adventurer');
    expect(challenge?.correctOptionIds).toEqual(['meat']);
    challenge?.options
      .filter((o) => o.id !== 'meat')
      .forEach((o) => expect(['grass', 'nectar', 'fruits', 'leaves', 'seeds']).toContain(o.id));
    expect(challenge?.prompt).toBe('O que o leão come?');
    expect(challenge?.explanation).toBe('O leão come carne.');
  });

  it('habitat distractors never share a landscape with the animal', () => {
    for (const animal of animals) {
      const groups = new Set(animal.habitats.map(habitatGroupOf));
      ATTRIBUTE_RULES.habitat.distractors(animal).forEach((habitat) => {
        expect(animal.habitats).not.toContain(habitat);
        expect(groups.has(habitatGroupOf(habitat))).toBe(false);
      });
    }
  });

  it('does not offer "forest" as a wrong home for the lion (savanna woodland is plausible)', () => {
    expect(ATTRIBUTE_RULES.habitat.distractors(requireAnimal('lion'))).not.toContain('forest');
  });

  it('never says a bird cannot fly, nor that a seal cannot crawl', () => {
    animals
      .filter((a) => a.taxonomy.class === 'bird')
      .forEach((bird) => expect(ATTRIBUTE_RULES.locomotion.distractors(bird)).not.toContain('fly'));
    expect(ATTRIBUTE_RULES.locomotion.distractors(requireAnimal('seal'))).not.toContain('slither');
  });

  it('mammal coats are never used against each other (fur / wool / skin)', () => {
    for (const id of ['sheep', 'pig', 'elephant', 'dolphin']) {
      const d = ATTRIBUTE_RULES.body_covering.distractors(requireAnimal(id));
      ['fur', 'wool', 'skin'].forEach((coat) => expect(d).not.toContain(coat));
    }
  });
});

describe('sound_to_animal', () => {
  it('never mixes animals with confusable sounds', () => {
    const groups: Record<string, string[]> = {
      chicken: ['chick', 'chicken', 'cock'],
      roar: ['lion', 'tiger', 'bear'],
      canine: ['dog', 'wolf'],
    };
    for (const members of Object.values(groups)) {
      for (const id of members) {
        for (let seed = 1; seed <= 30; seed += 1) {
          const challenge = gen('sound_to_animal', requireAnimal(id), 'adventurer', seed);
          const others = challenge?.options.map((o) => o.id).filter((o) => o !== id) ?? [];
          others.forEach((other) => expect(members).not.toContain(other));
        }
      }
    }
  });

  it('options are animals and the prompt plays the real sound', () => {
    const challenge = gen('sound_to_animal', requireAnimal('cow'), 'explorer');
    expect(challenge?.promptIsAnimalSound).toBe(true);
    expect(challenge?.prompt).toBe('Quem faz este som?');
    challenge?.options.forEach((o) => expect(o.animalId).toBe(o.id));
  });
});

describe('determinism', () => {
  it('same seed → same challenge', () => {
    const a = gen('habitat', requireAnimal('elephant'), 'adventurer', 42);
    const b = gen('habitat', requireAnimal('elephant'), 'adventurer', 42);
    expect(a).toEqual(b);
  });
});

describe('sessions', () => {
  it('animal session prefers challenges not completed yet', () => {
    const lion = requireAnimal('lion');
    const progress: ProgressLookup = { completedTemplates: () => ['food', 'habitat'], isDiscovered: () => false };
    const session = buildAnimalSession({ animal: lion, level: 'explorer', animals, progress, rng: createRng(3) });
    expect(session).toHaveLength(3);
    expect(session.map((c) => c.templateId)).not.toContain('food');
    session.forEach((c) => expect(c.animalId).toBe('lion'));
  });

  it('type session uses distinct animals and skips animals without the flag', () => {
    const session = buildTypeSession({
      templateId: 'food',
      level: 'explorer',
      animals,
      progress: noProgress,
      rng: createRng(9),
      rounds: 20,
    });
    const ids = session.map((c) => c.animalId);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).not.toContain('bear');
    expect(ids).not.toContain('monkey');
  });

  it('every animal can be discovered at every level (≥ 2 challenge types)', () => {
    for (const animal of animals) {
      for (const level of LEVELS) {
        const session = buildAnimalSession({
          animal,
          level,
          animals,
          progress: noProgress,
          rng: createRng(5),
          rounds: 10,
        });
        expect(new Set(session.map((c) => c.templateId)).size).toBeGreaterThanOrEqual(2);
      }
    }
  });
});
