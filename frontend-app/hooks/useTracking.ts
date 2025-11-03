import { useState, useEffect } from 'react';
import { orpcClient } from '@/lib/orpc-client';

export function useOrderTracking(orderId: string) {
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchTracking = async () => {
      try {
        setLoading(true);
        const result = await orpcClient.getOrderTracking(orderId);
        setTracking(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tracking');
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [orderId]);

  return { tracking, loading, error };
}

export function useTrackingTimeline(orderId: string) {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchTimeline = async () => {
      try {
        setLoading(true);
        const result = await orpcClient.getTrackingTimeline(orderId);
        setTimeline(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch timeline');
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [orderId]);

  return { timeline, loading, error };
}