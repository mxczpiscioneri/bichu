import Constants from 'expo-constants';

export type ViroModule = typeof import('@reactvision/react-viro');

let cached: ViroModule | null | undefined;

/**
 * Loads ViroReact lazily. Returns null when the native module is not linked
 * (Expo Go or a build without BICHU_AR=1), so the rest of the app never breaks.
 */
export function loadViro(): ViroModule | null {
  if (cached !== undefined) return cached;
  if (Constants.expoConfig?.extra?.arEnabled !== true) {
    cached = null;
    return cached;
  }
  try {
    // Lazy require on purpose: a static import would crash builds without the native module.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cached = require('@reactvision/react-viro') as ViroModule;
  } catch (error) {
    console.warn('[AR] ViroReact indisponível neste build:', error);
    cached = null;
  }
  return cached;
}
