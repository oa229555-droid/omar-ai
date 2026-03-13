// frontend/src/stores/themeStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      darkMode: true,
      fontSize: 'medium',
      
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      setDarkMode: (value) => set({ darkMode: value }),
      
      setFontSize: (size) => set({ fontSize: size })
    }),
    {
      name: 'omnia-theme-storage'
    }
  )
);
