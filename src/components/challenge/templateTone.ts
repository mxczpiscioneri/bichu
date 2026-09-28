import type { ChallengeTemplateId } from '@/challenges/types';
import type { Tone } from '@/theme';

/** Card colour per game, shared by the Brincar tab and the home shortcuts. */
export const TONE_BY_TEMPLATE: Record<ChallengeTemplateId, Tone> = {
  sound_to_animal: 'savanna',
  food: 'home',
  habitat: 'forest',
  locomotion: 'sky',
  body_covering: 'farm',
  reproduction: 'ocean',
  class: 'forest',
};
