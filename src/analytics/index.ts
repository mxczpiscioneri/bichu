/**
 * Anonymous usage statistics (GA4 via Firebase Analytics). Minimal, typed API:
 *
 *   track('level_start', { level_id: 'habitat', mode: 'explorer', surface: 'screen', rounds: 5 })
 *   trackScreen('Home')
 *   setAnalyticsEnabled(false)   // parents' switch
 *
 * No setUserId / setUserProperty: we never identify who plays. On web, in Jest and in Expo Go
 * everything is a no-op (see backend.ts / backend.native.ts). Privacy rules: docs/ANALYTICS.md.
 */
import { getBackend } from './backend';
import { sanitizeParams, type AnalyticsEventName, type AnalyticsEvents } from './events';

export { BUTTON_NAMES, type AnalyticsEventName, type AnalyticsEvents, type ButtonName, type GameId } from './events';
export { screenNameFor } from './screens';

type Pending =
  { kind: 'event'; name: string; params: Record<string, string | number> } | { kind: 'screen'; name: string };

/** null = saved settings not loaded yet: hold the first events until we know whether we may send. */
let enabled: boolean | null = null;
let pending: Pending[] = [];
const MAX_PENDING = 20;

function devLog(what: string, payload?: unknown) {
  // eslint-disable-next-line no-console
  if (__DEV__ && process.env.NODE_ENV !== 'test') console.log(`[analytics] ${what}`, payload ?? '');
}

function send(item: Pending) {
  const backend = getBackend();
  if (!backend) return;
  if (item.kind === 'event') backend.logEvent(item.name, item.params);
  else backend.logScreenView(item.name);
}

function dispatch(item: Pending) {
  if (enabled === false) return;
  devLog(
    item.kind === 'event' ? item.name : `screen_view ${item.name}`,
    item.kind === 'event' ? item.params : undefined,
  );
  if (enabled === null) {
    if (pending.length < MAX_PENDING) pending.push(item);
    return;
  }
  send(item);
}

export function track<E extends AnalyticsEventName>(
  event: E,
  ...[params]: AnalyticsEvents[E] extends Record<string, never> ? [] : [AnalyticsEvents[E]]
): void {
  dispatch({ kind: 'event', name: event, params: sanitizeParams((params ?? {}) as Record<string, unknown>) });
}

/** Manual screen_view with a fixed screen name (see screens.ts). */
export function trackScreen(screenName: string): void {
  if (!/^[A-Za-z]{1,40}$/.test(screenName)) return;
  dispatch({ kind: 'screen', name: screenName });
}

/**
 * Turns collection on/off ("Estatísticas anônimas de uso" switch, on by default).
 * Firebase also keeps this choice on the device between launches.
 */
export function setAnalyticsEnabled(value: boolean): void {
  const changed = enabled !== value;
  enabled = value;
  if (changed) getBackend()?.setCollectionEnabled(value);
  const queued = pending;
  pending = [];
  if (value) queued.forEach(send);
}

/** Tests only. */
export function __resetAnalyticsForTests(): void {
  enabled = null;
  pending = [];
}
