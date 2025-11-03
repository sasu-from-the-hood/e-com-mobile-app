import { useState, useEffect } from 'react';
import { orpcClient } from '@/lib/orpc-client';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const result = await orpcClient.getFavorites();
      setFavorites(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (productId: string) => {
    try {
      await orpcClient.addToFavorites(productId);
      await fetchFavorites();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to favorites');
    }
  };

  const removeFromFavorites = async (productId: string) => {
    try {
      await orpcClient.removeFromFavorites(productId);
      await fetchFavorites();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from favorites');
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some((fav: any) => fav.product.id === productId);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return { 
    favorites, 
    loading, 
    error, 
    addToFavorites, 
    removeFromFavorites,
    isFavorite,
    refetch: fetchFavorites 
  };
}