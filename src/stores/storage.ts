import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/** Local-only persistence. Nothing leaves the device. */
export const localStorage = createJSONStorage(() => AsyncStorage);
