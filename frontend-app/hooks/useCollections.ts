import { useState, useEffect } from 'react';
import { orpcClient } from '@/lib/orpc-client';

export function useCollections(limit: number = 6) {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[useCollections] Fetching products...');
      
      // Fetch products and filter collections client-side
      const allProducts = await orpcClient.getProducts({
        limit: 50 // Fetch more to ensure we get enough collections
      });

      console.log('[useCollections] Total products fetched:', allProducts.length);
      console.log('[useCollections] First product type:', allProducts[0]?.type);

      // Filter only collection products
      const collectionProducts = allProducts
        .filter((p: any) => p.type === 'collection')
        .slice(0, limit);
      
      console.log('[useCollections] Collections found:', collectionProducts.length);
      
      setCollections(collectionProducts);
    } catch (err: any) {
      console.error('[useCollections] Failed to fetch collections:', err);
      setError(err.message || 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [limit]);

  return {
    collections,
    loading,
    error,
    refetch: fetchCollections
  };
}
