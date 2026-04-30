import { useState, useEffect } from 'react';
import { orpcClient } from '@/lib/orpc-client';

export function useRecommendations(limit = 10) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const result = await orpcClient.getRecommendations({ limit });
      // Filter out collections - only show single products
      const singleProducts = result.filter((p: any) => p.type !== 'collection');
      setRecommendations(singleProducts);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [limit]);

  const trackInteraction = async (productId: string, type: 'view' | 'favorite' | 'cart' | 'purchase') => {
    try {
      await orpcClient.trackInteraction({ productId, type });
    } catch (err) {
      console.error('Failed to track interaction:', err);
    }
  };

  return { recommendations, loading, error, trackInteraction, refetch: fetchRecommendations };
}