import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { NetworkErrorBanner } from '@/components/ui/NetworkErrorBanner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <NetworkErrorBanner />
          <ProtectedRoute>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          <Stack.Screen name="auth/banned" options={{ headerShown: false }} />
          <Stack.Screen name="auth/otp-verification" options={{ headerShown: false }} />
          <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
          <Stack.Screen name="auth/reset-password" options={{ headerShown: false }} />
          <Stack.Screen name="shop/shop-home" options={{ headerShown: false }} />
          <Stack.Screen name="shop/shop-search" options={{ headerShown: false }} />
          <Stack.Screen name="shop/browse-all" options={{ headerShown: false }} />
          <Stack.Screen name="shop/product-detail" options={{ headerShown: false }} />
          <Stack.Screen name="shop/shop-cart" options={{ headerShown: false }} />
          <Stack.Screen name="shop/shop-checkout" options={{ headerShown: false }} />
          <Stack.Screen name="shop/category" options={{ headerShown: false }} />
          <Stack.Screen name="profile/user-profile" options={{ headerShown: false }} />
          <Stack.Screen name="profile/edit-profile" options={{ headerShown: false }} />
          <Stack.Screen name="orders/order-tracking" options={{ headerShown: false }} />
          <Stack.Screen name="orders/order-history" options={{ headerShown: false }} />
          <Stack.Screen name="notifications" options={{ headerShown: false }} />
          <Stack.Screen name="profile/settings" options={{ headerShown: false }} />
          <Stack.Screen name="profile/address-list" options={{ headerShown: false }} />
          <Stack.Screen name="profile/favorites" options={{ headerShown: false }} />
          <Stack.Screen name="profile/help-support" options={{ headerShown: false }} />
          <Stack.Screen name="help/index" options={{ headerShown: false }} />
          <Stack.Screen name="help/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
          </ProtectedRoute>
          <Toaster />
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
