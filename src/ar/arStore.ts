import { create } from 'zustand';

import type { SizeMode } from './scale';

/** AR placement state, shared by the Viro scene and the 2D overlay around it. */
export type ArStatus = 'starting' | 'searching' | 'surfaceFound' | 'placed' | 'error';

interface ArState {
  status: ArStatus;
  sizeMode: SizeMode;
  setStatus: (status: ArStatus) => void;
  setSizeMode: (sizeMode: SizeMode) => void;
}

export const useArStore = create<ArState>((set) => ({
  status: 'starting',
  sizeMode: 'real',
  setStatus: (status) => set({ status }),
  setSizeMode: (sizeMode) => set({ sizeMode }),
}));
