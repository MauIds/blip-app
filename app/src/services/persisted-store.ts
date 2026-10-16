import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { createJSONStorage } from 'zustand/middleware';

/** JSON storage on the phone for zustand's persist middleware. */
export function deviceStorage<State>() {
  return createJSONStorage<State>(() => AsyncStorage);
}

type PersistedStore = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (listener: () => void) => () => void;
  };
};

/** True once the store has finished loading what was saved on the phone. */
export function useHasHydrated(store: PersistedStore): boolean {
  return useSyncExternalStore(store.persist.onFinishHydration, store.persist.hasHydrated, () => false);
}
