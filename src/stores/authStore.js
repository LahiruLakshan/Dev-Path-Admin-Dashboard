// src/stores/authStore.js
import { create } from 'zustand';
import { auth } from '../firebase/config';

export const useAuthStore = create((set) => ({
  currentUser: null,
  loading: false,
  error: null,

  setUser: (user) => set({ currentUser: user, loading: false }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  logout: async () => {
    try {
      await auth.signOut();
      set({ currentUser: null });
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

