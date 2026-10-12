import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Level } from '@/domain/animal';

import { localStorage } from './storage';

interface SettingsState {
  level: Level;
  soundEnabled: boolean;
  /** First-run welcome + mode choice already shown. */
  onboarded: boolean;
  /** "Estatísticas anônimas de uso" (parents area). On by default; saves without it get the default. */
  analyticsEnabled: boolean;
  setLevel: (level: Level) => void;
  setSoundEnabled: (enabled: boolean) => void;
  completeOnboarding: () => void;
  setAnalytics: (enabled: boolean) => void;
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
      setAnalytics: (analyticsEnabled) => set({ analyticsEnabled }),
    }),
    {
      name: 'bichu.settings',
      version: 2,
      storage: localStorage,
      // v1 had only `level`; existing users skip the welcome flow.
      migrate: (persisted, version) => {
        const state = (persisted ?? {}) as Partial<SettingsState>;
        return version < 2 ? { ...state, soundEnabled: true, onboarded: true } : state;
      },
      // Explicit (it is zustand's default): saved fields win, fields added later
      // (analyticsEnabled) keep their default for older saves.
      merge: (persisted, current) => ({ ...current, ...(persisted as Partial<SettingsState> | undefined) }),
    },
  ),
);

export function useLevel(): Level {
  return useSettingsStore((state) => state.level);
}
