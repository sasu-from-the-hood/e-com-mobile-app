import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { authClient } from '@/lib/auth-client';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const [networkError, setNetworkError] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setNetworkError(false);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth check timeout')), 500)
      );
      
      const session = await Promise.race([
        authClient.getSession(),
        timeoutPromise
      ]) as any;
      
      if (session?.data?.user) {
        setIsAuthenticated(true);
        setUser(session.data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error: any) {
      console.log('Auth check error:', error);
      const isNetworkError = error.message?.includes('timeout') || error.message?.includes('CONNECTION_TIMED_OUT');
      setNetworkError(isNetworkError);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const requireAuth = () => {
    if (isAuthenticated === false) {
      router.replace('/auth/login');
    }
  };

  const logout = async () => {
    try {
      // Try to sign out from server
      await authClient.signOut();
    } catch (error: any) {
      console.error('Server logout error:', error);
      // Continue with local logout even if server fails
    } finally {
      // Always clear local state regardless of server response
      setIsAuthenticated(false);
      setUser(null);
      router.replace('/auth/login');
    }
  };

  return {
    isAuthenticated,
    user,
    checkAuth,
    requireAuth,
    logout,
    loading: isAuthenticated === null,
    networkError
  };
}