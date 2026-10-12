/**
 * Expo Router route → fixed screen name for `screen_view`. Built from the route *pattern*
 * (`animal/[id]`), never from the URL, so no id or search text ever ends up in a screen name.
 * Routes not listed here are not reported.
 */
const SCREEN_NAMES: Record<string, string> = {
  '': 'Home',
  index: 'Home',
  explore: 'Explore',
  play: 'Play',
  collection: 'Collection',
  'animal/[id]': 'Animal',
  'challenge/[type]': 'Challenge',
  'ar/[animalId]': 'Ar',
  parents: 'Parents',
  credits: 'Credits',
  welcome: 'Welcome',
  'choose-level': 'ChooseLevel',
  '+not-found': 'NotFound',
};

/** `useSegments()` output → screen name, or null for an unknown route. */
export function screenNameFor(segments: readonly string[]): string | null {
  const key = segments.filter((segment) => !/^\(.*\)$/.test(segment)).join('/');
  return SCREEN_NAMES[key] ?? null;
}
