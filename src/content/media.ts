import type { AudioSource } from 'expo-audio';
import type { ImageSourcePropType } from 'react-native';

import { ANIMAL_MEDIA } from './media.generated';

/** Bundled modules for one animal (resolved `require()` results). */
export interface AnimalMediaModules {
  image: ImageSourcePropType;
  sound: AudioSource;
  nameAudio: AudioSource;
  model3d: number | null;
}

export function mediaFor(animalId: string): AnimalMediaModules {
  const media = ANIMAL_MEDIA[animalId];
  if (!media) throw new Error(`Mídia não registrada para "${animalId}". Rode \`npm run assets:registry\`.`);
  return media;
}

export const UI_SOUNDS = {
  correct: require('../../assets/ui/sounds/correct.mp3') as AudioSource,
};

export const BRAND_IMAGES = {
  logo: require('../../assets/brand/logo.png') as ImageSourcePropType,
  wordmark: require('../../assets/brand/wordmark.png') as ImageSourcePropType,
  avatar: require('../../assets/brand/mascot-avatar.png') as ImageSourcePropType,
  wave: require('../../assets/brand/mascot-wave.png') as ImageSourcePropType,
  hug: require('../../assets/brand/mascot-hug.png') as ImageSourcePropType,
  explore: require('../../assets/brand/mascot-explore.png') as ImageSourcePropType,
  cheer: require('../../assets/brand/mascot-cheer.png') as ImageSourcePropType,
};

export type MascotPose = 'wave' | 'hug' | 'explore' | 'cheer' | 'avatar';
