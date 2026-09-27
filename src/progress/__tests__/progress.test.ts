import { animals } from '@/content/animals';

import {
  applyProgressEvent,
  discoveryState,
  emptyProgress,
  MAX_STARS_PER_ANIMAL,
  type AnimalProgress,
  type ProgressEvent,
} from '../progress';
import { animalOfTheDay, countDiscovered, recentAnimals } from '../selectors';

const NOW = new Date('2026-09-27T10:00:00Z');

function run(events: ProgressEvent[], start: AnimalProgress = emptyProgress('lion')) {
  return events.reduce(
    (acc, event) => {
      const result = applyProgressEvent(acc.progress, event, NOW);
      return { progress: result.progress, discoveredEvents: acc.discoveredEvents + (result.justDiscovered ? 1 : 0) };
    },
    { progress: start, discoveredEvents: 0 },
  );
}

describe('progression rules', () => {
  it('starts unknown, becomes found when opened', () => {
    expect(discoveryState(undefined)).toBe('unknown');
    expect(discoveryState(emptyProgress('lion'))).toBe('unknown');
    expect(discoveryState(run([{ type: 'opened' }]).progress)).toBe('found');
  });

  it('discovers after name + sound + 2 different challenges', () => {
    const { progress, discoveredEvents } = run([
      { type: 'heardName' },
      { type: 'heardSound' },
      { type: 'challengeCompleted', templateId: 'food' },
      { type: 'challengeCompleted', templateId: 'habitat' },
    ]);
    expect(discoveryState(progress)).toBe('discovered');
    expect(progress.discoveredAt).toBe(NOW.toISOString());
    expect(discoveredEvents).toBe(1);
  });

  it('does not discover without hearing the name', () => {
    const { progress } = run([
      { type: 'heardSound' },
      { type: 'challengeCompleted', templateId: 'food' },
      { type: 'challengeCompleted', templateId: 'habitat' },
    ]);
    expect(discoveryState(progress)).toBe('found');
  });

  it('repeating the same challenge does not count twice', () => {
    const { progress } = run([
      { type: 'heardName' },
      { type: 'heardSound' },
      { type: 'challengeCompleted', templateId: 'food' },
      { type: 'challengeCompleted', templateId: 'food' },
    ]);
    expect(progress.challengesCompleted).toEqual(['food']);
    expect(progress.stars).toBe(1);
    expect(discoveryState(progress)).toBe('found');
  });

  it('caps stars per animal', () => {
    const templates = ['food', 'habitat', 'locomotion', 'body_covering', 'sound_to_animal'];
    const { progress } = run(templates.map((templateId) => ({ type: 'challengeCompleted', templateId })));
    expect(progress.stars).toBe(MAX_STARS_PER_ANIMAL);
  });

  it('fires "just discovered" only once and never un-discovers', () => {
    const { progress, discoveredEvents } = run([
      { type: 'heardName' },
      { type: 'heardSound' },
      { type: 'challengeCompleted', templateId: 'food' },
      { type: 'challengeCompleted', templateId: 'habitat' },
      { type: 'challengeCompleted', templateId: 'locomotion' },
      { type: 'heardName' },
    ]);
    expect(discoveredEvents).toBe(1);
    expect(discoveryState(progress)).toBe('discovered');
  });

  it('does not mutate the previous state', () => {
    const before = emptyProgress('lion');
    applyProgressEvent(before, { type: 'challengeCompleted', templateId: 'food' }, NOW);
    expect(before.challengesCompleted).toEqual([]);
  });
});

describe('selectors', () => {
  it('counts discovered animals and orders recent ones', () => {
    const lion = { ...emptyProgress('lion'), discoveredAt: 'x', lastSeenAt: '2026-01-02' };
    const cat = { ...emptyProgress('cat'), opened: true, lastSeenAt: '2026-01-03' };
    const map = { lion, cat };
    expect(countDiscovered(animals, map)).toBe(1);
    expect(recentAnimals(animals, map).map((a) => a.id)).toEqual(['cat', 'lion']);
  });

  it('animal of the day is stable within a day', () => {
    const a = animalOfTheDay(animals, new Date(2026, 8, 27, 8));
    const b = animalOfTheDay(animals, new Date(2026, 8, 27, 20));
    expect(a.id).toBe(b.id);
  });
});
