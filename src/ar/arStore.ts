import { create } from 'zustand';

/** AR placement state, shared by the Viro scene and the 2D overlay around it. */
export type ArStatus = 'starting' | 'searching' | 'surfaceFound' | 'placed' | 'error';

interface ArState {
  status: ArStatus;
  setStatus: (status: ArStatus) => void;
}

export const useArStore = create<ArState>((set) => ({
  status: 'starting',
  setStatus: (status) => set({ status }),
}));
