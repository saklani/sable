import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AudioItem } from '../types';
import { mockApi } from '../services/mockApi';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
}

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

interface AudioState {
  items: AudioItem[];
  isLoading: boolean;
  error: string | null;
  loadItems: () => Promise<void>;
  addItem: (item: Omit<AudioItem, 'id' | 'createdAt'>) => Promise<void>;
  updateItem: (id: string, updates: Partial<AudioItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  generateAudio: (text: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      signIn: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          const user = await mockApi.auth.signIn(email, password);
          set({ user, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
      signUp: async (email, password, name) => {
        try {
          set({ isLoading: true, error: null });
          const user = await mockApi.auth.signUp(email, password, name);
          set({ user, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
      signOut: async () => {
        try {
          set({ isLoading: true, error: null });
          await mockApi.auth.signOut();
          set({ user: null, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
      getCurrentUser: async () => {
        try {
          set({ isLoading: true, error: null });
          const user = await mockApi.auth.getCurrentUser();
          set({ user, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      items: [],
      isLoading: false,
      error: null,
      loadItems: async () => {
        try {
          set({ isLoading: true, error: null });
          const items = await mockApi.audio.listItems();
          set({ items, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
      addItem: async (item) => {
        try {
          set({ isLoading: true, error: null });
          const newItem = await mockApi.audio.createItem(item);
          set((state) => ({ items: [...state.items, newItem], isLoading: false }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
      updateItem: async (id, updates) => {
        try {
          set({ isLoading: true, error: null });
          const updatedItem = await mockApi.audio.updateItem(id, updates);
          set((state) => ({
            items: state.items.map((item) => (item.id === id ? updatedItem : item)),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
      deleteItem: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await mockApi.audio.deleteItem(id);
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
      generateAudio: async (text) => {
        try {
          set({ isLoading: true, error: null });
          const newItem = await mockApi.audio.generateAudio(text);
          set((state) => ({ items: [...state.items, newItem], isLoading: false }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
    }),
    {
      name: 'audio-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 