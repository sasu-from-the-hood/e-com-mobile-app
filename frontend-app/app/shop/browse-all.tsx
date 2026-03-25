import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ProductCard } from '@/components/shop';
import { ProductSkeleton } from '@/components/shop/product-skeleton';
import { AppTheme } from '@/constants/app-theme';
import { orpcClient } from '@/lib/orpc-client';
import { useRecommendations } from '@/hooks/useRecommendations';

export default function BrowseAllScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const excludeIds = params.excludeIds ? (params.excludeIds as string).split(',') : [];
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { trackInteraction } = useRecommendations(0);

  const loadProducts = async (pageNum: number, isLoadMore: boolean = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const limit = 20;
      const offset = (pageNum - 1) * limit;
      
      console.log('[BrowseAll] Loading products:', { pageNum, limit, offset, excludeIdsCount: excludeIds.length });
      
      const result = await orpcClient.getBrowseAllProducts({
        excludeIds,
        limit,
        offset
      });

      console.log('[BrowseAll] Loaded products:', result.length);

      if (isLoadMore) {
        setProducts(prev => [...prev, ...result]);
      } else {
        setProducts(result);
      }
      
      setHasMore(result.length === limit);
    } catch (error) {
      console.error('[BrowseAll] Error loading products:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadProducts(1);
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadProducts(nextPage, true);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={AppTheme.colors.foreground} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Browse All Products</ThemedText>
        <View style={styles.placeholder} />
      </View>

      {/* Products Grid */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
          
          if (isCloseToBottom && !loadingMore && hasMore) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {loading ? (
          <View style={styles.productsGrid}>
            {Array.from({ length: 8 }).map((_, index) => (
              <View key={index} style={styles.productWrapper}>
                <ProductSkeleton />
              </View>
            ))}
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No products available</ThemedText>
          </View>
        ) : (
          <>
            <View style={styles.productsGrid}>
              {products.map((product: any) => (
                <View key={product.id} style={styles.productWrapper}>
                  <ProductCard
                    product={product}
                    onPress={() => {
                      trackInteraction(product.id, 'view');
                      router.push(`/shop/product-detail?id=${product.id}`);
                    }}
                  />
                </View>
              ))}
              
              {/* Show skeleton loaders while loading more */}
              {loadingMore && (
                <>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <View key={`loading-${index}`} style={styles.productWrapper}>
                      <ProductSkeleton />
                    </View>
                  ))}
                </>
              )}
            </View>
            
            {!hasMore && products.length > 0 && (
              <View style={styles.endMessage}>
                <ThemedText style={styles.endText}>You've reached the end</ThemedText>
              </View>
            )}
          </>
        )}
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerTitle: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
  },
  placeholder: {
    width: 40,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: AppTheme.fontSize.md,
    color: AppTheme.colors.mutedForeground,
  },
  endMessage: {
    paddingVertical: AppTheme.spacing.lg,
    alignItems: 'center',
  },
  endText: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
  },
});
