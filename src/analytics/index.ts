/**
 * Anonymous usage counts sent to our own Aptabase server (client.ts): no device, install or
 * user identifier, only aggregate counts (how many children play, open and discover each
 * animal, finish challenges). Parents can turn it off in the Parents area
 * (settings.analyticsEnabled). Web and Jest send nothing.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { createAnonClient, type AnonClient, type Props } from './client';

/** "Bichu" app on the self-hosted Aptabase. The App Key is public (it only names the app). */
const APP_KEY = 'A-SH-9587199788';
const HOST = 'https://stats.4mtecnologia.com.br';

let client: AnonClient | null = null;

function deviceLocale(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().locale || 'pt';
  } catch {
    return 'pt';
  }
}

/** Starts once, after the stores hydrate; `enabled` is the parents' switch. */
export function startAnalytics(enabled: boolean): void {
  if (client || Platform.OS === 'web' || process.env.NODE_ENV === 'test') return;
  client = createAnonClient({
    appKey: APP_KEY,
    host: HOST,
    mode: 'kids',
    appVersion: Constants.expoConfig?.version ?? '0.0.0',
    osName: Platform.OS === 'ios' ? 'iOS' : 'Android',
    osVersion:
      Platform.OS === 'android' ? String(Platform.constants.Release ?? Platform.Version) : String(Platform.Version),
    locale: deviceLocale(),
    isDebug: __DEV__,
    storage: AsyncStorage,
    storageKey: 'bichu:stats',
  });
  client.setEnabled(enabled);
  client.track('app_open');
  client.trackOnce('first_open', 'first_open');
}

export function setAnalyticsEnabled(enabled: boolean): void {
  client?.setEnabled(enabled);
}

/** App in foreground/background: heartbeat only while open, and flush on the way out. */
export function setAnalyticsAppActive(active: boolean): void {
  client?.setActive(active);
}

/** Only technical ids and numbers leave the device. */
const ID = /^[a-z0-9_-]{1,40}$/i;
function clean(props: Record<string, string | number | boolean>): Props {
  const out: Props = {};
  for (const [k, v] of Object.entries(props)) {
    if (typeof v === 'boolean') out[k] = v ? 1 : 0;
    else if (typeof v === 'number' && Number.isFinite(v)) out[k] = Math.round(v);
    else if (typeof v === 'string' && ID.test(v)) out[k] = v;
  }
  return out;
}

export function track(event: string, props: Record<string, string | number | boolean> = {}): void {
  client?.track(event, clean(props));
}

/** Milestone counted once per install (e.g. first time an animal is discovered). */
export function trackOnce(key: string, event: string, props: Record<string, string | number | boolean> = {}): void {
  client?.trackOnce(key, event, clean(props));
}
