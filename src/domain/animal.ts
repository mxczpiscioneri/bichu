import type {
  Activity,
  AnimalClass,
  AnimalScope,
  BodyCovering,
  Diet,
  Domestication,
  Food,
  Habitat,
  Locomotion,
  Reproduction,
  SizeClass,
} from './taxonomy';

export type {
  Activity,
  AnimalClass,
  AnimalScope,
  BodyCovering,
  Diet,
  Domestication,
  Food,
  Habitat,
  Locomotion,
  Reproduction,
  SizeClass,
} from './taxonomy';

/** Optional metadata for a 3D model. Animation is never required. */
export interface Model3dMeta {
  defaultScale?: number;
  realWorldHeightMeters?: number;
  groundOffset?: number;
  animations?: string[];
  license: string;
  author: string;
  sourceUrl?: string;
}

/** Media paths are repository-relative and follow `assets/animals/<kind>/<id>…`. */
/**
 * badge: legacy circular illustration (assets/animals/images).
 * cutout: new full-body art on a transparent background (assets/animals/art).
 */
export type ImageStyle = 'badge' | 'cutout';

export interface AnimalMedia {
  image: string;
  /** Defaults to 'badge'. */
  imageStyle?: ImageStyle;
  sound: string;
  nameAudio: string;
  model3d?: string | null;
  model3dMeta?: Model3dMeta | null;
}

export interface AnimalContent {
  /** One-idea sentences for Explorer mode (2–4 years). */
  preschool: string[];
  /** Short explanations for Adventurer mode (5–8 years). */
  kids: string[];
  /** Optional fun facts. Never used as the basis of a challenge. */
  curiosities: string[];
}

export type ChallengeFlagKey = 'food' | 'habitat' | 'locomotion' | 'bodyCovering' | 'reproduction' | 'class';
export type ChallengeFlags = Record<ChallengeFlagKey, boolean>;

export interface Animal {
  /** Stable English slug; also the asset file name. */
  id: string;
  scope: AnimalScope;
  parentAnimalId?: string | null;
  name: {
    ptBR: string;
    /** Definite article used to build sentences: "o leão", "a abelha". */
    article: 'o' | 'a';
    syllables: string[];
  };
  taxonomy: {
    scientificName?: string | null;
    class: AnimalClass;
    group?: string | null;
  };
  media: AnimalMedia;
  /** Name of the animal's sound ("rugido"). Falls back to "som". */
  soundName?: { ptBR: string };
  /** Animals with confusable sounds share a group (e.g. lion/tiger/bear). */
  soundGroup?: string | null;
  habitats: Habitat[];
  regions: string[];
  diet: Diet;
  foods: Food[];
  locomotion: Locomotion[];
  bodyCovering: BodyCovering;
  reproduction: Reproduction;
  activity: Activity[];
  domestication: Domestication;
  sizeClass: SizeClass;
  content: AnimalContent;
  challengeFlags: ChallengeFlags;
}

export const CHALLENGE_FLAG_KEYS: readonly ChallengeFlagKey[] = [
  'food',
  'habitat',
  'locomotion',
  'bodyCovering',
  'reproduction',
  'class',
];

export type Level = 'explorer' | 'adventurer';
export const LEVELS: readonly Level[] = ['explorer', 'adventurer'];

export function hasModel3d(animal: Animal): boolean {
  return typeof animal.media.model3d === 'string' && animal.media.model3d.length > 0;
}
