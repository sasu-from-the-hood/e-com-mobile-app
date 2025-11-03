import { useState, useEffect } from 'react';
import { orpcClient } from '@/lib/orpc-client';

export function usePaymentMethods() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const result = await orpcClient.getPaymentMethods();
      setMethods(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payment methods');
    } finally {
      setLoading(false);
    }
  };

  const addPaymentMethod = async (data: {
    type: 'card' | 'paypal' | 'bank';
    cardNumber?: string;
    expiryDate?: string;
    cardholderName?: string;
    isDefault?: boolean;
  }) => {
    try {
      await orpcClient.addPaymentMethod(data);
      await fetchMethods();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add payment method');
    }
  };

  const processPayment = async (data: {
    orderId: string;
    paymentMethodId: string;
    amount: number;
  }) => {
    try {
      const result = await orpcClient.processPayment(data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      throw err;
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  return { 
    methods, 
    loading, 
    error, 
    addPaymentMethod, 
    processPayment,
    refetch: fetchMethods 
  };
}