import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useSettingsStore } from '@/stores/settingsStore';

import { setAnalyticsAppActive, setAnalyticsEnabled, startAnalytics } from './index';

/** Starts the anonymous counts once the stores are hydrated and follows the parents' switch. */
export function useAnalytics(hydrated: boolean) {
  useEffect(() => {
    if (!hydrated) return;
    startAnalytics(useSettingsStore.getState().analyticsEnabled);
    const unsubscribe = useSettingsStore.subscribe((state, prev) => {
      if (state.analyticsEnabled !== prev.analyticsEnabled) setAnalyticsEnabled(state.analyticsEnabled);
    });
    const sub = AppState.addEventListener('change', (next) => setAnalyticsAppActive(next === 'active'));
    return () => {
      unsubscribe();
      sub.remove();
    };
  }, [hydrated]);
}
