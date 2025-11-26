import { User } from '@/lib/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        // Check if we're on the client side
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        // Return a dummy storage for SSR
        return {
          getItem: () => null,
          setItem: () => { },
          removeItem: () => { },
        };
      }),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);