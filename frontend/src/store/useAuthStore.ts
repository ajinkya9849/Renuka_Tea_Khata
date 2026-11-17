import { create } from 'zustand';
import { User } from '../types';
import { api } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  demoLogin: () => Promise<boolean>;
  register: (name: string, email: string, pass: string, shopName?: string) => Promise<boolean>;
  logout: () => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    try {
      const u = localStorage.getItem('renuka_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem('renuka_token') || null,
  isLoading: false,
  error: null,

  login: async (email: string, pass: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.auth.login(email, pass);
      localStorage.setItem('renuka_token', data.access_token);
      localStorage.setItem('renuka_user', JSON.stringify(data.user));
      set({ token: data.access_token, user: data.user, isLoading: false, error: null });
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Invalid email or password';
      set({ error: msg, isLoading: false });
      return false;
    }
  },

  demoLogin: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.auth.demoLogin();
      localStorage.setItem('renuka_token', data.access_token);
      localStorage.setItem('renuka_user', JSON.stringify(data.user));
      set({ token: data.access_token, user: data.user, isLoading: false, error: null });
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Demo login failed';
      set({ error: msg, isLoading: false });
      return false;
    }
  },

  register: async (name: string, email: string, pass: string, shopName?: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.auth.register(name, email, pass, shopName);
      localStorage.setItem('renuka_token', data.access_token);
      localStorage.setItem('renuka_user', JSON.stringify(data.user));
      set({ token: data.access_token, user: data.user, isLoading: false, error: null });
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Registration failed';
      set({ error: msg, isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('renuka_token');
    localStorage.removeItem('renuka_user');
    set({ user: null, token: null, error: null });
  },

  initAuth: async () => {
    const token = localStorage.getItem('renuka_token');
    if (!token) return;
    try {
      const user = await api.auth.getMe();
      localStorage.setItem('renuka_user', JSON.stringify(user));
      set({ user });
    } catch {
      localStorage.removeItem('renuka_token');
      localStorage.removeItem('renuka_user');
      set({ user: null, token: null });
    }
  }
}));
