import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, type Product } from '../services/api';
import { useAuth } from './AuthContext';

interface FavoritesContextValue {
  favorites: Product[];
  isFavorite: (id: number) => boolean;
  addFavorite: (id: number) => Promise<void>;
  removeFavorite: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      api
        .fetchFavorites()
        .then(setFavorites)
        .catch(() => setFavorites([]));
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated]);

  const isFavorite = useCallback(
    (id: number) => favorites.some((p) => p.id === id),
    [favorites]
  );

  const addFavorite = useCallback(async (id: number) => {
    const product = await api.addFavorite(id);
    setFavorites((prev) => {
      if (prev.some((p) => p.id === id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFavorite = useCallback(async (id: number) => {
    await api.removeFavorite(id);
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleFavorite = useCallback(
    async (id: number) => {
      if (isFavorite(id)) {
        await removeFavorite(id);
      } else {
        await addFavorite(id);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  const value: FavoritesContextValue = {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
