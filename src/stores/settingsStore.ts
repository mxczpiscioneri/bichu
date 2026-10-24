import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Level } from '@/domain/animal';

import { localStorage } from './storage';

interface SettingsState {
  level: Level;
  soundEnabled: boolean;
  /** First-run welcome + mode choice already shown. */
  onboarded: boolean;
  /** Anonymous usage counts (parents can turn them off). */
  analyticsEnabled: boolean;
  setLevel: (level: Level) => void;
  setSoundEnabled: (enabled: boolean) => void;
  completeOnboarding: () => void;
  setAnalyticsEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      level: 'explorer',
      soundEnabled: true,
      onboarded: false,
      analyticsEnabled: true,
      setLevel: (level) => set({ level }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      completeOnboarding: () => set({ onboarded: true }),
      setAnalyticsEnabled: (analyticsEnabled) => set({ analyticsEnabled }),
    }),
    {
      name: 'bichu.settings',
      version: 3,
      storage: localStorage,
      // v1 had only `level`; existing users skip the welcome flow. v3 adds analyticsEnabled.
      migrate: (persisted, version) => {
        let state = (persisted ?? {}) as Partial<SettingsState>;
        if (version < 2) state = { ...state, soundEnabled: true, onboarded: true };
        if (version < 3) state = { ...state, analyticsEnabled: true };
        return state;
      },
    },
  ),
);

export function useLevel(): Level {
  return useSettingsStore((state) => state.level);
}
