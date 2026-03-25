import { useState, useEffect } from 'react';
import { orpcClient } from '@/lib/orpc-client';

export function useProducts(filters?: { category?: string; search?: string; limit?: number; sortBy?: string; order?: string }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await orpcClient.getProducts(filters || {});
      // Sort or shuffle products based on filters
      let processedProducts = [...result];
      if (filters?.sortBy === 'price' && filters?.order === 'asc') {
        processedProducts.sort((a, b) => a.price - b.price);
      } else {
        // Shuffle products on refresh for other cases
        processedProducts.sort(() => Math.random() - 0.5);
      }
      setProducts(processedProducts);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters?.category, filters?.search, filters?.limit, filters?.sortBy, filters?.order]);

  return { products, loading, error, refetch: fetchProducts };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const result = await orpcClient.getProduct(id);
        setProduct(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const result = await orpcClient.getCategories();
        console.log('=== FRONTEND CATEGORIES ===');
        console.log('Total categories received:', result.length);
        console.log('First category:', result[0]);
        console.log('Categories with image field:', result.filter((c: any) => c.image).length);
        setCategories(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}