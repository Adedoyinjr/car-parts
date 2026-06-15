import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: string[]) => boolean;
}

const CURRENT_USER_STORAGE_KEY = 'auth-current-user';

const AuthContext = createContext<AuthContextType | null>(null);

function loadCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) as User : null;
  } catch {
    return null;
  }
}

function saveCurrentUser(user: User | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  }
}

async function apiRequest(path: string, body: object) {
  const API_BASE = (import.meta.env.VITE_API_BASE as string) || '';

  function joinUrl(base: string, p: string) {
    if (!base) return p;
    return base.replace(/\/+$|$/, '') + '/' + p.replace(/^\/+/, '');
  }

  const url = joinUrl(API_BASE, path);
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || 'Failed to authenticate');
  }
  return json;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadCurrentUser());

  const login = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const data = await apiRequest('/api/auth/login', { email: normalizedEmail, password });
    setUser(data.user);
    saveCurrentUser(data.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const data = await apiRequest('/api/auth/register', { name: name.trim(), email: normalizedEmail, password });
    setUser(data.user);
    saveCurrentUser(data.user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveCurrentUser(null);
  }, []);

  const hasRole = useCallback((roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
