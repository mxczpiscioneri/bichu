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

import { track, trackOnce } from '@/analytics';

import { localStorage } from './storage';

interface ProgressState {
  byAnimal: ProgressMap;
  record: (animalId: string, event: ProgressEvent) => ApplyResult;
  reset: () => void;
}

/** Anonymous counts of the child's progress (see src/analytics). */
function reportProgress(animalId: string, event: ProgressEvent, result: ApplyResult) {
  if (event.type === 'opened') {
    track('animal_opened', { animal_id: animalId });
    trackOnce(`opened:${animalId}`, 'animal_first_opened', { animal_id: animalId });
  } else if (event.type === 'challengeCompleted') {
    track('challenge_completed', { animal_id: animalId, template_id: event.templateId, stars: result.starsEarned });
  }
  if (result.justDiscovered) trackOnce(`discovered:${animalId}`, 'animal_discovered', { animal_id: animalId });
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      byAnimal: {},
      record: (animalId, event) => {
        const current = get().byAnimal[animalId] ?? emptyProgress(animalId);
        const result = applyProgressEvent(current, event);
        set((state) => ({ byAnimal: { ...state.byAnimal, [animalId]: result.progress } }));
        reportProgress(animalId, event, result);
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
