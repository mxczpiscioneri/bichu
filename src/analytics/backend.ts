/**
 * Analytics backend for web (and any platform without the native module): does nothing.
 * The real backend lives in backend.native.ts (native Firebase Analytics, only in development/
 * production builds). No firebase-js-sdk on purpose: the web build sends nothing.
 */
export interface AnalyticsBackend {
  logEvent(name: string, params: Record<string, string | number>): void;
  logScreenView(screenName: string): void;
  setCollectionEnabled(enabled: boolean): void;
}

export function getBackend(): AnalyticsBackend | null {
  return null;
}
