import { useEffect, useState } from 'react';

import { useProgressStore } from './progressStore';
import { useSettingsStore } from './settingsStore';

const stores = [useProgressStore, useSettingsStore];

/** True once every persisted store has been read from local storage. */
export function useStoresHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => stores.every((s) => s.persist.hasHydrated()));
  useEffect(() => {
    if (hydrated) return;
    const check = () => setHydrated(stores.every((s) => s.persist.hasHydrated()));
    const unsubscribers = stores.map((s) => s.persist.onFinishHydration(check));
    check();
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [hydrated]);
  return hydrated;
}
