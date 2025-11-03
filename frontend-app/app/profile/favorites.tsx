import { View, TouchableOpacity, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { Image } from 'expo-image';
import { Search, Bell } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ProductCard } from '@/components/shop';
import { ProductSkeleton } from '@/components/shop/product-skeleton';
import { BottomTabBar } from '@/components/navigation/bottom-tab-bar';
import { AppTheme } from '@/constants/app-theme';
import { useFavorites } from '@/hooks/useFavorites';
import { useNotifications } from '@/hooks/useNotifications';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, loading, refetch } = useFavorites();
  const { unreadCount } = useNotifications();
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ThemedText style={styles.headerTitle}>My Favorites</ThemedText>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/shop/shop-search')}>
            <Search size={24} color={AppTheme.colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/notifications')}>
            <Bell size={24} color={AppTheme.colors.foreground} />
            {unreadCount > 0 && <View style={styles.notificationBadge} />}
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.content}>
          <ProductSkeleton />
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.content}>
          <ThemedText style={styles.emptyText}>No favorites yet</ThemedText>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={({ item }: { item: any }) => (
            <ProductCard
              product={item.product}
              onPress={() => router.push(`/shop/product-detail?id=${item.product.id}`)}
            />
          )}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={styles.productList}
          onScroll={(event) => {
            const currentScrollY = event.nativeEvent.contentOffset.y;
            const isScrollingDown = currentScrollY > scrollY.current;
            scrollY.current = currentScrollY;
            
            if (isScrollingDown && currentScrollY > 50) {
              setIsBottomNavVisible(false);
            } else if (!isScrollingDown) {
              setIsBottomNavVisible(true);
            }
          }}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await refetch();
                setRefreshing(false);
              }}
            />
          }
        />
      )}

      <BottomTabBar isVisible={isBottomNavVisible} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: AppTheme.fontSize.xxl,
    fontWeight: AppTheme.fontWeight.bold,
  },
  headerActions: {
    flexDirection: 'row',
    gap: AppTheme.spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppTheme.colors.error,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
  },
  productList: {
    padding: AppTheme.spacing.md,
  },
});