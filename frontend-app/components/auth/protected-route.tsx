import { useAuth } from '@/hooks/useAuth';
import { Redirect, usePathname } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { AppTheme } from '@/constants/app-theme';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const publicRoutes = [
  '/',
  '/onboarding',
  '/auth/login',
  '/auth/signup', 
  '/auth/otp-verification',
  '/auth/forgot-password',
  '/auth/reset-password'
];

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();

  const isPublicRoute = publicRoutes.includes(pathname);

  if (loading) {
    return null;
  }

  if (isAuthenticated === false && !isPublicRoute) {
    return <Redirect href="/auth/login" />;
  }

  if (isAuthenticated === true && isPublicRoute && pathname !== '/') {
    return <Redirect href="/shop/shop-home" />;
  }

  return <>{children}</>;
}