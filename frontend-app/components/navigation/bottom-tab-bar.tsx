import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Home, Package, Heart, User, ShoppingCart } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/hooks/useCart';

interface BottomTabBarProps {
  isVisible?: boolean;
  onToggle?: (visible: boolean) => void;
}

export function BottomTabBar({ isVisible = true, onToggle }: BottomTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(0);
  const { cart } = useCart();

  // Calculate cart item count
  const cartItemCount = cart.filter((item: any) => item.selected).length;

  const tabs = [
    { name: 'Home', icon: Home, route: '/shop/shop-home' },
    { name: 'Orders', icon: Package, route: '/orders/order-history' },
    { name: 'Cart', icon: ShoppingCart, route: '/shop/shop-cart', isCenter: true },
    { name: 'Favorite', icon: Heart, route: '/profile/favorites' },
    { name: 'Profile', icon: User, route: '/profile/user-profile' },
  ];

  useEffect(() => {
    translateY.value = withTiming(isVisible ? 0 : 100, { duration: 300 });
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Add extra padding for devices with 3-button navigation
  const bottomPadding = Platform.OS === 'android' ? Math.max(insets.bottom, 12) : insets.bottom || 12;

  return (
    <Animated.View style={[styles.container, { paddingBottom: bottomPadding }, animatedStyle]} pointerEvents="box-none">
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.route;
          const Icon = tab.icon;
          
          if (tab.isCenter) {
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.centerTab}
                onPress={() => router.replace(tab.route as any)}
                activeOpacity={0.8}
              >
                <Animated.View style={[
                  styles.centerButton,
                  isActive && styles.centerButtonActive
                ]}>
                  <Icon
                    size={28}
                    color={AppTheme.colors.primaryForeground}
                    strokeWidth={2.5}
                  />
                  {cartItemCount > 0 && (
                    <View style={styles.badge}>
                      <ThemedText style={styles.badgeText}>
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </ThemedText>
                    </View>
                  )}
                </Animated.View>
              </TouchableOpacity>
            );
          }
          
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => router.replace(tab.route as any)}
              activeOpacity={0.7}
            >
              <Animated.View style={styles.iconContainer}>
                <Icon
                  size={24}
                  color={isActive ? AppTheme.colors.primary : AppTheme.colors.mutedForeground}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: AppTheme.colors.background,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
    paddingTop: 8,
    ...AppTheme.shadows.large,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: AppTheme.spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -32,
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: AppTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...AppTheme.shadows.large,
    borderWidth: 4,
    borderColor: AppTheme.colors.background,
  },
  centerButtonActive: {
    transform: [{ scale: 1.05 }],
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: AppTheme.colors.destructive,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: AppTheme.colors.background,
  },
  badgeText: {
    color: AppTheme.colors.primaryForeground,
    fontSize: 10,
    fontWeight: AppTheme.fontWeight.bold,
  },
});