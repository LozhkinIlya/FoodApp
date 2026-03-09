import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, setToken, clearToken, isAuthenticated as checkAuth } from '../services/api';

export type LoginError = 'user_not_found' | 'invalid_password';

interface AuthContextValue {
  isAuthenticated: boolean;
  register: (login: string, password: string) => Promise<void>;
  login: (login: string, password: string) => Promise<{ success: true } | { success: false; error: LoginError }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticatedState] = useState(checkAuth);

  useEffect(() => {
    setAuthenticatedState(checkAuth());
  }, []);

  const register = useCallback(async (loginValue: string, password: string) => {
    const { token } = await api.register(loginValue, password);
    setToken(token);
    setAuthenticatedState(true);
  }, []);

  const login = useCallback(async (loginValue: string, password: string): Promise<{ success: true } | { success: false; error: LoginError }> => {
    try {
      const { token } = await api.login(loginValue, password);
      setToken(token);
      setAuthenticatedState(true);
      return { success: true };
    } catch (e) {
      const message = e instanceof Error ? e.message : '';
      if (message === 'user_not_found') {
        return { success: false, error: 'user_not_found' };
      }
      return { success: false, error: 'invalid_password' };
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setAuthenticatedState(false);
  }, []);

  const value: AuthContextValue = {
    isAuthenticated: authenticated,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
