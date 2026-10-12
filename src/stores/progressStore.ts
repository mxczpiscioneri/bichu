import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { track } from '@/analytics';
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
        if (result.justDiscovered) {
          const total = Object.values(get().byAnimal).filter((p) => p.discoveredAt).length;
          track('animal_discovered', { animal_id: animalId, discovered_total: total });
        }
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
