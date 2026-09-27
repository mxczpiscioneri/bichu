import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  applyProgressEvent,
  emptyProgress,
  type AnimalProgress,
  type ApplyResult,
  type ProgressEvent,
} from '@/progress/progress';
import type { ProgressMap } from '@/progress/selectors';

import { localStorage } from './storage';

interface ProgressState {
  byAnimal: ProgressMap;
  record: (animalId: string, event: ProgressEvent) => ApplyResult;
  reset: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      byAnimal: {},
      record: (animalId, event) => {
        const current = get().byAnimal[animalId] ?? emptyProgress(animalId);
        const result = applyProgressEvent(current, event);
        set((state) => ({ byAnimal: { ...state.byAnimal, [animalId]: result.progress } }));
        return result;
      },
      reset: () => set({ byAnimal: {} }),
    }),
    {
      name: 'bichu.progress',
      version: 1,
      storage: localStorage,
      partialize: (state) => ({ byAnimal: state.byAnimal }),
    },
  ),
);

export function useAnimalProgress(animalId: string): AnimalProgress | undefined {
  return useProgressStore((state) => state.byAnimal[animalId]);
}
