import { useState, useEffect } from 'react';
import { orpcClient } from '@/lib/orpc-client';

export function useFashionFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (reset = false) => {
    try {
      const currentOffset = reset ? 0 : offset;
      const result = await orpcClient.getFeedPosts({
        limit: LIMIT,
        offset: currentOffset,
      });

      if (reset) {
        setPosts(result);
        setOffset(LIMIT);
      } else {
        setPosts(prev => [...prev, ...result]);
        setOffset(prev => prev + LIMIT);
      }

      setHasMore(result.length === LIMIT);
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadPosts();
    }
  };

  const refetch = async () => {
    setLoading(true);
    await loadPosts(true);
  };

  return {
    posts,
    loading,
    loadMore,
    refetch,
  };
}
