import { useState, useEffect } from 'react';
import { orpcClient } from '@/lib/orpc-client';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const result = await orpcClient.getNotifications();
      setNotifications(result);
      setUnreadCount(result.filter((n: any) => !n.read).length);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await orpcClient.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map((notif: any) => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await orpcClient.markAllAsRead();
      setNotifications(prev => 
        prev.map((notif: any) => ({ ...notif, read: true }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all as read');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return { 
    notifications, 
    loading, 
    error, 
    unreadCount,
    markAsRead, 
    markAllAsRead, 
    refetch: fetchNotifications 
  };
}