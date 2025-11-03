import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Home, Package, Heart, User } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

interface BottomTabBarProps {
  isVisible?: boolean;
  onToggle?: (visible: boolean) => void;
}

export function BottomTabBar({ isVisible = true, onToggle }: BottomTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const translateY = useSharedValue(0);

  const tabs = [
    { name: 'Home', icon: Home, route: '/shop/shop-home' },
    { name: 'Orders', icon: Package, route: '/orders/order-history' },
    { name: 'Favorite', icon: Heart, route: '/profile/favorites' },
    { name: 'Profile', icon: User, route: '/profile/user-profile' },
  ];

  useEffect(() => {
    translateY.value = withTiming(isVisible ? 0 : 100, { duration: 300 });
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="box-none">
      {tabs.map((tab) => {
        const isActive = pathname === tab.route;
        const Icon = tab.icon;
        
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => router.replace(tab.route as any)}
            activeOpacity={0.7}
          >
            <Icon
              size={24}
              color={isActive ? AppTheme.colors.primary : AppTheme.colors.mutedForeground}
            />
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: AppTheme.colors.background,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
    paddingBottom: 12,
    paddingTop: 12,
    ...AppTheme.shadows.medium,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    color: AppTheme.colors.mutedForeground,
  },
  tabLabelActive: {
    color: AppTheme.colors.primary,
    fontWeight: AppTheme.fontWeight.semibold,
  },
});