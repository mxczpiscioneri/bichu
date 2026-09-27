import { useEffect, useRef, useState } from 'react';

import { getAnimal } from '@/content/animals';
import type { Animal } from '@/domain/animal';
import { discoveryState } from '@/progress/progress';
import { useProgressStore } from '@/stores/progressStore';

/**
 * Watches animals and returns the one that just became "discovered" while the
 * screen was open (so the celebration can be shown exactly once).
 */
export function useDiscoveryWatcher(animalIds: readonly string[]): [Animal | null, () => void] {
  const byAnimal = useProgressStore((state) => state.byAnimal);
  const known = useRef<Set<string> | null>(null);
  const [celebrating, setCelebrating] = useState<Animal | null>(null);

  useEffect(() => {
    const discoveredNow = animalIds.filter((id) => discoveryState(byAnimal[id]) === 'discovered');
    if (known.current === null) {
      known.current = new Set(discoveredNow);
      return;
    }
    const fresh = discoveredNow.find((id) => !known.current?.has(id));
    discoveredNow.forEach((id) => known.current?.add(id));
    if (fresh) setCelebrating(getAnimal(fresh) ?? null);
  }, [animalIds, byAnimal]);

  return [celebrating, () => setCelebrating(null)];
}
