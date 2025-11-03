import { useState, useEffect } from 'react';
import { orpcClient } from '@/lib/orpc-client';

export function useNewArrivals(limit: number = 10) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNewArrivals = async () => {
    try {
      setLoading(true);
      const result = await orpcClient.getNewArrivals({ limit });
      setProducts(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch new arrivals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewArrivals();
  }, [limit]);

  return { products, loading, error, refetch: fetchNewArrivals };
}