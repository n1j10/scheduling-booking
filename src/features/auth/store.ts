import { create } from 'zustand';
import { getErrorMessage } from '@/lib/axios';
import type { ActionResult } from '@/types';
import * as authApi from './api';
import type { UpdateProfileInput, UserProfile } from './types';

type ProfileState = {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<ActionResult>;
  clearProfile: () => void;
};

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    // Avoid sending the same request twice if two components ask at once
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const profile = await authApi.getMe();
      set({ profile, isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },

  updateProfile: async (input) => {
    try {
      const profile = await authApi.updateMe(input);
      set({ profile });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error) };
    }
  },

  clearProfile: () => set({ profile: null, isLoading: false, error: null }),
}));
