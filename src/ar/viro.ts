/** Web / Expo Go fallback: ViroReact is never loaded. */
export type ViroModule = typeof import('@reactvision/react-viro');

export function loadViro(): ViroModule | null {
  return null;
}
