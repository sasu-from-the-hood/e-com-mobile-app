import { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Search, Bell } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/Avatar';
import { PromotionalBanner, CategoryCard, TabNavigation, ProductCard } from '@/components/shop';
import { ProductSkeleton } from '@/components/shop/product-skeleton';
import { BottomTabBar } from '@/components/navigation/bottom-tab-bar';
import { AppTheme } from '@/constants/app-theme';
import { useCategories } from '@/hooks/useProducts';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { useNewArrivals } from '@/hooks/useNewArrivals';
import { useBrowseAll } from '@/hooks/useBrowseAll';
import { authConfig as URL } from '@/config/auth.config';

export default function ShopHomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'Home' | 'Category'>('Home');
  const { products: newArrivals, loading: newArrivalsLoading, refetch: refetchNewArrivals } = useNewArrivals(8);
  const { categories } = useCategories();
  const { recommendations, loading: recommendationsLoading, trackInteraction } = useRecommendations(6);
  const { unreadCount } = useNotifications();
  
  // Get IDs to exclude from browse all
  const excludeIds = [...newArrivals.map((p: any) => p.id), ...recommendations.map((p: any) => p.id)];
  const { products: browseAllProducts, loading: browseAllLoading } = useBrowseAll(excludeIds, 6);
  
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header with Avatar */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={() => router.push('/profile/user-profile')}>
            <Avatar
              source={user?.image}
              name={user?.name || user?.email}
              size={48}
              style={styles.avatarContainer}
            />
          </TouchableOpacity>
          <View style={styles.greetingContainer}>
            <ThemedText style={styles.greeting}>Hi, {user?.name || user?.email || 'User'}</ThemedText>
            <ThemedText style={styles.welcomeText}>Let's go shopping</ThemedText>
          </View>
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

      {/* Tab Navigation */}
      <TabNavigation
        tabs={['Home', 'Category']}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as 'Home' | 'Category')}
      />

      {/* Content based on active tab */}
      <View style={styles.contentContainer}>
        {activeTab === 'Home' ? (
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
                  await refetchNewArrivals();
                  setRefreshing(false);
                }}
              />
            }
          >
          {/* Promotional Banner */}
          <PromotionalBanner 
            onBannerPress={(productId) => {
              router.push(`/shop/product-detail?id=${productId}`);
            }}
          />

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <ThemedText style={styles.sectionTitle}>New Arrivals </ThemedText>
              <ThemedText style={styles.fireEmoji}>🔥</ThemedText>
            </View>
          </View>

          {/* New Arrivals Horizontal Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {newArrivalsLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <View key={index} style={styles.productCard}>
                  <ProductSkeleton />
                </View>
              ))
            ) : (
              newArrivals.map((product: any) => (
                <View key={product.id} style={styles.productCard}>
                  <ProductCard
                    product={product}
                    onPress={() => {
                      trackInteraction(product.id, 'view');
                      router.push(`/shop/product-detail?id=${product.id}`);
                    }}
                  />
                </View>
              ))
            )}
          </ScrollView>

          {/* Recommendations Section */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <ThemedText style={styles.sectionTitle}>Recommended for You </ThemedText>
              <ThemedText style={styles.fireEmoji}>✨</ThemedText>
            </View>
          </View>

          {/* Recommendations Horizontal Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {recommendationsLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <View key={index} style={styles.productCard}>
                  <ProductSkeleton />
                </View>
              ))
            ) : (
              recommendations.map((product: any) => (
                <View key={product.id} style={styles.productCard}>
                  <ProductCard
                    product={product}
                    onPress={() => {
                      trackInteraction(product.id, 'view');
                      router.push(`/shop/product-detail?id=${product.id}`);
                    }}
                  />
                </View>
              ))
            )}
          </ScrollView>

          {/* Browse All Section */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <ThemedText style={styles.sectionTitle}>Browse All Products </ThemedText>
              <ThemedText style={styles.fireEmoji}>🛍️</ThemedText>
            </View>
            <TouchableOpacity onPress={() => router.push(`/shop/browse-all?excludeIds=${excludeIds.join(',')}`)}>
              <ThemedText style={styles.seeAll}>See All</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Browse All Grid */}
          <View style={styles.productsGrid}>
            {browseAllLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <View key={index} style={styles.productWrapper}>
                  <ProductSkeleton />
                </View>
              ))
            ) : (
              browseAllProducts.map((product: any) => (
                <View key={product.id} style={styles.productWrapper}>
                  <ProductCard
                    product={product}
                    onPress={() => {
                      trackInteraction(product.id, 'view');
                      router.push(`/shop/product-detail?id=${product.id}`);
                    }}
                  />
                </View>
              ))
            )}
          </View>

          </ScrollView>
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}
            decelerationRate="fast"
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
          >
          {categories.map((category: any) => {
            console.log('Rendering category:', category.name, 'Image:', category.image, 'Full URL:', category.image ? `${URL.ImageUrl}${category.image}` : 'No image');
            return (
              <CategoryCard
                key={category.id}
                title={category.name}
                productCount={category.productCount}
                imageUrl={category.image ? `${URL.ImageUrl}${category.image}` : undefined}
                imageAlt={category.name}
                variant="medium"
                onPress={() => {
                  router.push(`/shop/category/${category.id}?name=${encodeURIComponent(category.name)}`);
                }}
              />
            );
          })}
          </ScrollView>
        )}
      </View>
      
      {/* Bottom Navigation */}
      <BottomTabBar 
        isVisible={isBottomNavVisible} 
        onToggle={(visible: boolean) => setIsBottomNavVisible(visible)}
      />
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
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: AppTheme.spacing.md,
    ...AppTheme.shadows.small,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
  },
  welcomeText: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
    marginTop: 2,
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
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  categoryScrollContent: {
    paddingHorizontal: AppTheme.spacing.md,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
  },
  fireEmoji: {
    fontSize: AppTheme.fontSize.lg,
    marginLeft: 4,
  },
  seeAll: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.primary,
    fontWeight: AppTheme.fontWeight.medium,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: AppTheme.spacing.md,
    gap: AppTheme.spacing.md,
  },
  productWrapper: {
    width: '47%',
  },
  horizontalScrollContent: {
    paddingHorizontal: AppTheme.spacing.md,
    gap: AppTheme.spacing.md,
  },
  productCard: {
    width: 200,
    marginRight: AppTheme.spacing.md,
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
  productInfo: {
    marginTop: AppTheme.spacing.sm,
  },
  productName: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.medium,
    marginBottom: 4,
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
});