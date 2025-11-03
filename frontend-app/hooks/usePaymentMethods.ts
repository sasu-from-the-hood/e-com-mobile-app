import { useState, useEffect } from 'react';
import { orpcClient } from '@/lib/orpc-client';

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const result = await orpcClient.getPaymentMethods();
      setPaymentMethods(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payment methods');
    } finally {
      setLoading(false);
    }
  };

  const addPaymentMethod = async (paymentMethod: any) => {
    try {
      await orpcClient.addPaymentMethod(paymentMethod);
      await fetchPaymentMethods();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add payment method');
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  return { 
    paymentMethods, 
    loading, 
    error, 
    addPaymentMethod,
    refetch: fetchPaymentMethods 
  };
}