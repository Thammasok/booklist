import { authApi } from '@/services/auth.service';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
};

type AuthStore = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  loadUser: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { token, user } = await authApi.login({ email, password });
          localStorage.setItem('token', token);
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false 
          });
          window.location.href = '/overview';
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Login failed. Please try again.',
            isLoading: false 
          });
        }
      },
      
      register: async (username: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.register({ username, email, password });
          set({ isLoading: false });
          window.location.href = '/login?registered=true';
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Registration failed. Please try again.',
            isLoading: false 
          });
        }
      },
      
      logout: async () => {
        try {
          // Clear all local storage items
          localStorage.clear();
          
          // Clear session storage as well
          sessionStorage.clear();
          
          // Clear all cookies
          document.cookie.split(';').forEach(cookie => {
            const [name] = cookie.split('=');
            document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
          });
          
          // Reset the store state
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
          
          // Redirect to login page with a full page reload to ensure all state is cleared
          window.location.href = '/login';
        } catch (error) {
          console.error('Error during logout:', error);
          // If there's an error, still try to redirect to login
          window.location.href = '/login';
        }
      },
      
      clearError: () => set({ error: null }),
  
  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, isLoading: false });
      return;
    }
    
    try {
      set({ isLoading: true });
      const { data } = await authApi.getMe();
      set({ 
        user: data,
        token,
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error) {
      localStorage.removeItem('token');
      set({ 
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false 
      });
    }
  },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
