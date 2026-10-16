import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { DEFAULT_SHARE_SETTINGS, type ShareSettings, type ShareableField } from '@/domain/sharing';
import { deviceStorage } from '@/services/persisted-store';

type ShareState = {
  settings: ShareSettings;
  setShared: (field: ShareableField, shared: boolean) => void;
};

type PersistedShare = Pick<ShareState, 'settings'>;

export const useShareStore = create<ShareState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SHARE_SETTINGS,
      setShared: (field, shared) => set((state) => ({ settings: { ...state.settings, [field]: shared } })),
    }),
    {
      name: 'blipz.share-settings',
      version: 1,
      storage: deviceStorage<PersistedShare>(),
      partialize: ({ settings }) => ({ settings }),
    },
  ),
);
