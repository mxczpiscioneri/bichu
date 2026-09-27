import { useEffect } from 'react';

import { AudioService } from '@/audio/AudioService';
import { useProgressStore } from '@/stores/progressStore';

/** Records "heard name" / "heard sound" whenever those clips start, from any screen. */
export function useListeningTracker(): void {
  useEffect(
    () =>
      AudioService.onClipStart((clip) => {
        if (!clip.animalId) return;
        const { record } = useProgressStore.getState();
        if (clip.kind === 'name') record(clip.animalId, { type: 'heardName' });
        if (clip.kind === 'sound') record(clip.animalId, { type: 'heardSound' });
      }),
    [],
  );
}
