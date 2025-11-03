import { useState, useEffect } from 'react';
import { orpcClient } from '@/lib/orpc-client';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  colors?: string[];
  brand?: string;
  rating?: number;
}

export function useSearch() {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const result = await orpcClient.searchProducts({ query });
      setResults(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const trackSearchClick = async (productId: string) => {
    try {
      await orpcClient.trackSearchClick({ productId });
    } catch (err) {
      console.error('Failed to track search click:', err);
    }
  };

  return { results, loading, error, searchProducts, trackSearchClick };
}

interface SearchTerm {
  term: string;
  color?: string;
}

export function usePopularSearches() {
  const [searches, setSearches] = useState<SearchTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearches = async () => {
      try {
        const result = await orpcClient.getPopularSearches();
        setSearches(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch searches');
      } finally {
        setLoading(false);
      }
    };

    fetchSearches();
  }, []);

  return { searches, loading, error };
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const result = await orpcClient.getUserSearchHistory();
      setHistory(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch search history');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await orpcClient.clearSearchHistory();
      setHistory([]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear search history');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return { history, loading, error, clearHistory, refetch: fetchHistory };
}