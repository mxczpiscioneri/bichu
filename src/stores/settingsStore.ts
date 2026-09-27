import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Level } from '@/domain/animal';

import { localStorage } from './storage';

interface SettingsState {
  level: Level;
  soundEnabled: boolean;
  /** First-run welcome + mode choice already shown. */
  onboarded: boolean;
  setLevel: (level: Level) => void;
  setSoundEnabled: (enabled: boolean) => void;
  completeOnboarding: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      level: 'explorer',
      soundEnabled: true,
      onboarded: false,
      setLevel: (level) => set({ level }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      completeOnboarding: () => set({ onboarded: true }),
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
    },
  ),
);

export function useLevel(): Level {
  return useSettingsStore((state) => state.level);
}
