import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { appAuthClient, User } from '@/lib/app-auth-client';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [networkError, setNetworkError] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setNetworkError(false);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth check timeout')), 5000)
      );
      
      const currentUser = await Promise.race([
        appAuthClient.getSession(),
        timeoutPromise
      ]) as User | null;
      
      if (currentUser) {
        // Check if user is banned
        if (currentUser.role === 'banned') {
          setIsAuthenticated(false);
          setUser(null);
          router.replace('/auth/banned');
          return;
        }
        
        setIsAuthenticated(true);
        setUser(currentUser);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error: any) {
      console.log('Auth check error:', error);
      const isNetworkError = error.message?.includes('timeout') || 
                            error.message?.includes('CONNECTION_TIMED_OUT') || 
                            error.message?.includes('Network');
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
      await appAuthClient.logout();
    } catch (error: any) {
      console.error('Logout error:', error);
    } finally {
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