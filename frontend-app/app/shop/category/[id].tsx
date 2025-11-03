import { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { ArrowLeft, Search, Bell } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ProductCard } from '@/components/shop';
import { ProductSkeleton } from '@/components/shop/product-skeleton';
import { BottomTabBar } from '@/components/navigation/bottom-tab-bar';
import { AppTheme } from '@/constants/app-theme';
import { useProducts } from '@/hooks/useProducts';
import { useNotifications } from '@/hooks/useNotifications';

export default function CategoryScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams();
  const { products, loading, refetch } = useProducts({ category: id as string, limit: 20 });
  const { unreadCount } = useNotifications();
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(0);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={AppTheme.colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <ThemedText style={styles.headerTitle}>{name || 'Category'}</ThemedText>
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

      {/* Content */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
      >
        {/* Products Grid */}
        <View style={styles.productsGrid}>
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <View key={index} style={styles.productWrapper}>
                <ProductSkeleton />
              </View>
            ))
          ) : (
            products.map((product: any) => (
              <View key={product.id} style={styles.productWrapper}>
                <ProductCard
                  product={product}
                  onPress={() => router.push(`/shop/product-detail?id=${product.id}`)}
                />
              </View>
            ))
          )}
        </View>

        {!loading && products.length === 0 && (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>No products found in this category</ThemedText>
          </View>
        )}
      </ScrollView>
      
        <BottomTabBar isVisible={isBottomNavVisible} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  header: {
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: AppTheme.fontSize.lg,
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
  scrollContent: {
    paddingBottom: 100,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: AppTheme.spacing.md,
    paddingTop: AppTheme.spacing.md,
    gap: AppTheme.spacing.md,
  },
  productWrapper: {
    width: '47%',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: AppTheme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: AppTheme.colors.secondary,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: AppTheme.colors.error,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 1,
  },
  discountText: {
    fontSize: 10,
    fontWeight: AppTheme.fontWeight.bold,
    color: '#fff',
  },
  priceOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    fontSize: 10,
    fontWeight: AppTheme.fontWeight.medium,
    color: '#ccc',
    textDecorationLine: 'line-through',
  },
  overlayPrice: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.bold,
    color: '#fff',
  },
  productInfo: {
    marginTop: AppTheme.spacing.sm,
  },
  productName: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.medium,
    marginBottom: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: AppTheme.spacing.xl,
  },
  emptyText: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
  },
});