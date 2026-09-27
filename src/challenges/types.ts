import type { Level } from '@/domain/animal';
import type { IconName } from '@/content/icons';

export const CHALLENGE_TEMPLATE_IDS = [
  'sound_to_animal',
  'food',
  'habitat',
  'locomotion',
  'body_covering',
  'reproduction',
  'class',
] as const;
export type ChallengeTemplateId = (typeof CHALLENGE_TEMPLATE_IDS)[number];

export type Interaction = 'tap' | 'drag';

export interface LevelConfig {
  options?: number;
  enabled?: boolean;
}

/** Shape of an entry in content/challenges/templates.json. */
export interface ChallengeTemplate {
  id: ChallengeTemplateId;
  type: string;
  interaction: Interaction;
  title: string;
  subtitle: string;
  icon: IconName;
  levels: Record<Level, LevelConfig>;
  prompt: string;
  explanation: string;
  source?: string;
}

export interface ChallengeOption {
  id: string;
  label: string;
  /** Taxonomy options show an icon… */
  icon?: IconName;
  /** …animal options show the animal illustration. */
  animalId?: string;
}

export interface Challenge {
  id: string;
  templateId: ChallengeTemplateId;
  /** The animal the challenge is about (credited in progress when solved). */
  animalId: string;
  level: Level;
  interaction: Interaction;
  prompt: string;
  explanation: string;
  options: ChallengeOption[];
  correctOptionIds: string[];
  /** When true the UI plays the animal's real sound as the prompt. */
  promptIsAnimalSound: boolean;
}

export function isCorrect(challenge: Challenge, optionId: string): boolean {
  return challenge.correctOptionIds.includes(optionId);
}
