import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IUser } from '@civichub/shared';

interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  setUser: (user: IUser | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setUser: (user) => set({ user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      logout: () => set({ user: null, accessToken: null }),
    }),
    {
      name: 'auth-storage', // name of item in storage
    }
  )
);
