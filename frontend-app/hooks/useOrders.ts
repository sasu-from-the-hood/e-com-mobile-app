import { useState, useEffect } from 'react';
import { orpcClient } from '@/lib/orpc-client';
import type { Order } from '@/types/schema';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await orpcClient.appGetOrders();
      setOrders(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (data: { shippingAddress: string; paymentMethodId: string }) => {
    try {
      const result = await orpcClient.appCreateOrder(data);
      await fetchOrders();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      throw err;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, createOrder, refetch: fetchOrders };
}

export function useOrder(id: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const result = await orpcClient.appGetOrder(id);
        setOrder(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  return { order, loading, error };
}