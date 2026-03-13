// frontend/src/stores/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Login
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', credentials);
          const { token, user } = response.data;
          
          // Set token in axios defaults
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });

          return response.data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Register
      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/register', userData);
          const { token, user } = response.data;
          
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });

          toast.success('تم إنشاء الحساب بنجاح');
          return response.data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Logout
      logout: () => {
        delete api.defaults.headers.common['Authorization'];
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
        toast.success('تم تسجيل الخروج');
      },

      // Check auth status
      checkAuth: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await api.get('/auth/me');
          set({
            user: response.data.user,
            isAuthenticated: true
          });
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false
          });
        }
      },

      // Update user
      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      },

      // Update settings
      updateSettings: (settings) => {
        const { user } = get();
        set({
          user: {
            ...user,
            settings: { ...user.settings, ...settings }
          }
        });
      }
    }),
    {
      name: 'omnia-auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user ? {
          id: state.user.id,
          username: state.user.username,
          email: state.user.email,
          role: state.user.role,
          plan: state.user.plan,
          settings: state.user.settings
        } : null
      })
    }
  )
);
