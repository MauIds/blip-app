import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Profile } from '@/domain/profile';
import { deviceStorage } from '@/services/persisted-store';

type ProfileState = {
  profile: Profile | null;
  saveProfile: (profile: Profile) => void;
};

type PersistedProfile = Pick<ProfileState, 'profile'>;

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      saveProfile: (profile) => set({ profile }),
    }),
    {
      name: 'blipz.profile',
      version: 1,
      storage: deviceStorage<PersistedProfile>(),
      partialize: ({ profile }) => ({ profile }),
    },
  ),
);
