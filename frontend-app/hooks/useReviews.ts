import { useState, useEffect } from 'react';
import { orpcClient } from '@/lib/orpc-client';

export function useProductReviews(productId: string) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      const result = await orpcClient.getProductReviews(productId);
      setReviews(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (data: {
    rating: number;
    comment?: string;
  }) => {
    try {
      await orpcClient.addReview({
        productId,
        ...data
      });
      await fetchReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add review');
    }
  };

  const updateReview = async (reviewId: string, data: {
    rating: number;
    comment?: string;
  }) => {
    try {
      await orpcClient.updateReview({
        id: reviewId,
        ...data
      });
      await fetchReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update review');
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      await orpcClient.deleteReview(reviewId);
      await fetchReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  return { 
    reviews, 
    loading, 
    error, 
    addReview, 
    updateReview, 
    deleteReview,
    refetch: fetchReviews 
  };
}