import { TurboModuleRegistry } from 'react-native';

import type { AnalyticsBackend } from './backend';

export type { AnalyticsBackend } from './backend';

type FirebaseAnalyticsModule = typeof import('@react-native-firebase/analytics');

const noop = () => undefined;
/** RNFB calls return Promises: never let a rejection reach the app. */
const quiet = (result: unknown) => {
  if (result && typeof (result as Promise<void>).catch === 'function') (result as Promise<void>).catch(noop);
};

let cached: AnalyticsBackend | null | undefined;

/**
 * Native Firebase Analytics, loaded lazily. Returns null (no-op) when the native module is
 * missing: Expo Go, Jest, or an older binary without Firebase that received this JS through
 * an OTA update. So `npx expo start` with Expo Go keeps working.
 */
export function getBackend(): AnalyticsBackend | null {
  if (cached !== undefined) return cached;
  cached = null;
  try {
    if (!TurboModuleRegistry.get('NativeRNFBTurboApp') || !TurboModuleRegistry.get('NativeRNFBTurboAnalytics')) {
      return null;
    }
    // Lazy require on purpose: a static import would throw where the native module is missing.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fa = require('@react-native-firebase/analytics') as FirebaseAnalyticsModule;
    const analytics = fa.getAnalytics();
    // Consent Mode: no advertising at all, only the anonymous counts (also fixed in firebase.json).
    quiet(
      fa.setConsent(analytics, {
        analytics_storage: true,
        ad_storage: false,
        ad_user_data: false,
        ad_personalization: false,
      }),
    );
    cached = {
      logEvent: (name, params) => {
        try {
          quiet(fa.logEvent(analytics, name, params));
        } catch {
          // name/parameter rejected by the SDK: ignore, statistics must never break the app
        }
      },
      logScreenView: (screenName) => {
        try {
          quiet(fa.logScreenView(analytics, { screen_name: screenName, screen_class: screenName }));
        } catch {
          // same as above
        }
      },
      setCollectionEnabled: (enabled) => {
        try {
          quiet(fa.setAnalyticsCollectionEnabled(analytics, enabled));
        } catch {
          // same as above
        }
      },
    };
  } catch {
    cached = null;
  }
  return cached;
}
