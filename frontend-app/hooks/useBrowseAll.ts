import { useState, useEffect } from 'react';
import { orpcClient } from '@/lib/orpc-client';

export function useBrowseAll(excludeIds: string[] = [], limit: number = 6) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await orpcClient.getBrowseAllProducts({ excludeIds, limit });
        setProducts(result);
      } catch (error) {
        console.error('Error fetching browse all products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [excludeIds.join(','), limit]);

  return { products, loading };
}
