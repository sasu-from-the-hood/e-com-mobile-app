import { useState, useEffect } from 'react';
import { orpcClient } from '@/lib/orpc-client';

export function useCart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      console.log('Fetching cart...');
      const result = await orpcClient.getCart();
      console.log('Cart result:', result);
      setCart(result);
      setError(null);
    } catch (err) {
      console.error('Cart fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1, color?: string, size?: string) => {
    try {
      console.log('Adding to cart:', { productId, quantity, color, size });
      const result = await orpcClient.addToCart({ productId, quantity, color, size });
      console.log('Add to cart result:', result);
      await fetchCart();
    } catch (err) {
      console.error('Add to cart error:', err);
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
    }
  };

  const updateCart = async (id: string, quantity: number) => {
    try {
      await orpcClient.updateCart({ id, quantity });
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cart');
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      await orpcClient.removeFromCart(id);
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from cart');
    }
  };

  const clearCart = async () => {
    try {
      await orpcClient.clearCart();
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const toggleSelection = async (id: string, selected: boolean) => {
    try {
      await orpcClient.toggleCartItemSelection({ id, selected });
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle selection');
    }
  };

  const getTotal = async () => {
    try {
      const result = await orpcClient.getCartTotal();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get total');
      return null;
    }
  };

  return {
    cart,
    loading,
    error,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
    toggleSelection,
    getTotal,
    refetch: fetchCart
  };
}