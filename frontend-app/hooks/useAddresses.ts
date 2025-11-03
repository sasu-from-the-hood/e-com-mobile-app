import { useState, useEffect } from 'react';
import { orpcClient } from '@/lib/orpc-client';

export function useAddresses() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const result = await orpcClient.getAddresses();
      setAddresses(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch addresses');
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (data: any) => {
    try {

      const result = await orpcClient.addAddress(data);

      await fetchAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add address');
      throw err;
    }
  };

  const updateAddress = async (id: string, data: any) => {
    try {

      const result = await orpcClient.updateAddress({ id, ...data });
      await fetchAddresses();
    } catch (err) {

      setError(err instanceof Error ? err.message : 'Failed to update address');
      throw err;
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      await orpcClient.deleteAddress(id);
      await fetchAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete address');
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return { 
    addresses, 
    loading, 
    error, 
    addAddress, 
    updateAddress, 
    deleteAddress,
    refetch: fetchAddresses 
  };
}