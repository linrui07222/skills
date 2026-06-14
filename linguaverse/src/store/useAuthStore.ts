import { create } from 'zustand';

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const API_BASE = '/api';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string>) },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: '请求失败' }));
    throw new Error(error.message || '请求失败');
  }
  return res.json();
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email: string, password: string) => {
    const data = await apiFetch<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('token', data.token);
    set({ token: data.token, user: data.user, isAuthenticated: true });
  },

  register: async (username: string, email: string, password: string) => {
    const data = await apiFetch<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    localStorage.setItem('token', data.token);
    set({ token: data.token, user: data.user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    try {
      const data = await apiFetch<User>('/auth/me');
      set({ user: data, isAuthenticated: true });
    } catch {
      localStorage.removeItem('token');
      set({ token: null, user: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
