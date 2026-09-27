import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Level } from '@/domain/animal';

import { localStorage } from './storage';

interface SettingsState {
  level: Level;
  setLevel: (level: Level) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      level: 'explorer',
      setLevel: (level) => set({ level }),
    }),
    { name: 'bichu.settings', version: 1, storage: localStorage },
  ),
);

export function useLevel(): Level {
  return useSettingsStore((state) => state.level);
}
