import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { hasModel3d, type Animal } from '@/domain/animal';

import { loadViro } from './viro';

/** AR is opt-in at build time (BICHU_AR=1) and requires a native Dev Client build. */
export function isArBuild(): boolean {
  return Platform.OS !== 'web' && Constants.expoConfig?.extra?.arEnabled === true;
}

/** The "Ver no meu mundo" CTA only appears when everything needed is present. */
export function isArAvailableFor(animal: Animal): boolean {
  return hasModel3d(animal) && isArBuild() && loadViro() !== null;
}
