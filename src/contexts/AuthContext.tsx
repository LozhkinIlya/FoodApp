import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  getStoredUser,
  isAuthenticated as checkAuth,
  logout as authLogout,
  saveUser,
  setAuthenticated,
  type UserCredentials,
} from '../services/authService';

interface AuthContextValue {
  isAuthenticated: boolean;
  hasUser: boolean;
  register: (credentials: UserCredentials) => void;
  login: (credentials: UserCredentials) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticatedState] = useState(checkAuth);
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    setAuthenticatedState(checkAuth());
    setUser(getStoredUser());
  }, []);

  const register = useCallback((credentials: UserCredentials) => {
    saveUser(credentials);
    setUser(credentials);
  }, []);

  const login = useCallback((credentials: UserCredentials): boolean => {
    const stored = getStoredUser();
    if (!stored) return false;
    if (stored.login === credentials.login && stored.password === credentials.password) {
      setAuthenticated(true);
      setAuthenticatedState(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setAuthenticatedState(false);
  }, []);

  const value: AuthContextValue = {
    isAuthenticated: authenticated,
    hasUser: !!user,
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
