import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Search, X, Clock } from 'lucide-react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ProductCard } from '@/components/shop';
import { ProductSkeleton } from '@/components/shop/product-skeleton';
import { AppTheme } from '@/constants/app-theme';
import { useSearch, usePopularSearches, useSearchHistory } from '@/hooks/useSearch';
import { URL } from '@/config';

interface SearchTerm {
  term: string;
  color?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  colors?: string[];
  brand?: string;
  rating?: number;
}

export default function ShopSearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { results, loading, searchProducts, trackSearchClick } = useSearch();
  const { searches: popularSearches } = usePopularSearches();
  const { history: searchHistory, clearHistory, refetch: refreshHistory } = useSearchHistory();
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleClearHistory = async () => {
    try {
      await clearHistory();
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Clear existing timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    if (query.trim()) {
      // Debounce search with 800ms delay
      const timeout = setTimeout(() => {
        searchProducts(query);
      }, 800);
      setDebounceTimeout(timeout);
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={AppTheme.colors.mutedForeground} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={AppTheme.colors.mutedForeground}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <X size={20} color={AppTheme.colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Results */}
      {searchQuery && (
        loading ? (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Searching...</ThemedText>
            {Array.from({ length: 3 }).map((_, index) => (
              <View key={index} style={styles.skeletonRow}>
                <ProductSkeleton />
              </View>
            ))}
          </View>
        ) : results && results.length > 0 ? (
          <FlatList
            data={results}
            renderItem={({ item }) => (
              <ProductRowCard
                product={item}
                onPress={async () => {
                  // Track the click and navigate
                  await trackSearchClick(item.id);
                  refreshHistory(); // Refresh to show the new clicked item
                  router.push(`/shop/product-detail?id=${item.id}`);
                }}
              />
            )}
            keyExtractor={(item: Product) => item.id}
            contentContainerStyle={styles.section}
            ListHeaderComponent={
              <ThemedText style={styles.sectionTitle}>Search Results</ThemedText>
            }
          />
        ) : (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>No results found</ThemedText>
          </View>
        )
      )}

      {/* Search History and Popular Searches */}
      {!searchQuery && (
        <ScrollView style={styles.content}>
          {/* Search History */}
          {searchHistory && searchHistory.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Recent Searches (Top 5)</ThemedText>
                <TouchableOpacity onPress={handleClearHistory}>
                  <ThemedText style={styles.clearAll}>Clear All</ThemedText>
                </TouchableOpacity>
              </View>
              {(searchHistory || []).slice(0, 5).map((item: any, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.historyItem}
                  onPress={() => handleSearch(item.term)}
                >
                  <Clock size={16} color={AppTheme.colors.mutedForeground} />
                  <ThemedText style={styles.historyText}>{item.term}</ThemedText>
                  {item.count && (
                    <View style={styles.countBadge}>
                      <ThemedText style={styles.countText}>{item.count}</ThemedText>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Search size={64} color={AppTheme.colors.mutedForeground} />
              <ThemedText style={styles.emptyStateTitle}>No search yet</ThemedText>
              <ThemedText style={styles.emptyStateText}>
                Start searching for products to see your history here
              </ThemedText>
            </View>
          )}

          {/* Popular Search */}
          {popularSearches && popularSearches.length > 0 && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Popular Search</ThemedText>
              <View style={styles.chipsContainer}>
                {(popularSearches || []).map((item: SearchTerm, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.chip, { backgroundColor: item.color || AppTheme.colors.secondary }]}
                    onPress={() => handleSearch(item.term)}
                  >
                    <ThemedText style={styles.chipText}>{item.term}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// Product Row Card Component for search results
const ProductRowCard = React.memo(({ product, onPress }: { product: Product; onPress: () => void }) => {
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${URL.IMAGE}${imagePath}`;
  };

  // Get image from colorImages - just show first image from first color
  const colorImages = (product as any).colorImages || {};
  const colors = Object.keys(colorImages);
  
  let imageUrl = '';
  let borderColor = '';

  if (colors.length > 0) {
    // Get first color and its first image
    const firstColor = colors[0];
    borderColor = firstColor;
    const firstColorImages = colorImages[firstColor] || [];
    if (firstColorImages.length > 0) {
      imageUrl = getImageUrl(firstColorImages[0]);
    }
  }

  // Fallback to product.image if no colorImages
  if (!imageUrl && product.image) {
    imageUrl = getImageUrl(product.image);
  }

  return (
    <TouchableOpacity style={styles.productRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.productImageContainer}>
        <View style={[
          styles.productImageWrapper,
          borderColor && { borderWidth: 3, borderColor: borderColor }
        ]}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.productImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.productImagePlaceholder}>
              <ThemedText style={styles.imagePlaceholder}>IMG</ThemedText>
            </View>
          )}
        </View>
      </View>
      <View style={styles.productInfo}>
        <ThemedText style={styles.productName} numberOfLines={2}>
          {product.name}
        </ThemedText>
        <ThemedText style={styles.productPrice}>
          ETB {product.price}
        </ThemedText>
        {product.colors && product.colors.length > 0 && (
          <View style={styles.colorsContainer}>
            {product.colors.slice(0, 4).map((color: string, index: number) => (
              <View
                key={index}
                style={[styles.colorDot, { backgroundColor: color }]}
              />
            ))}
            {product.colors.length > 4 && (
              <ThemedText style={styles.moreColors}>+{product.colors.length - 4}</ThemedText>
            )}
          </View>
        )}
        {product.description && (
          <ThemedText style={styles.productDescription} numberOfLines={1}>
            {product.description}
          </ThemedText>
        )}
      </View>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Only re-render if product id changes
  return prevProps.product.id === nextProps.product.id;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  searchContainer: {
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.input,
    borderRadius: AppTheme.borderRadius.md,
    paddingHorizontal: AppTheme.spacing.md,
    height: 48,
    gap: AppTheme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.foreground,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: AppTheme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  sectionTitle: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
  },
  clearAll: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.primary,
    fontWeight: AppTheme.fontWeight.medium,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: AppTheme.spacing.md,
    gap: AppTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  historyText: {
    fontSize: AppTheme.fontSize.base,
    flex: 1,
  },
  countBadge: {
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  countText: {
    fontSize: AppTheme.fontSize.xs,
    color: AppTheme.colors.background,
    fontWeight: AppTheme.fontWeight.bold,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm,
  },
  chip: {
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.full,
  },
  chipText: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.medium,
  },
  // Product Row Styles
  productRow: {
    flexDirection: 'row',
    padding: AppTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.background,
  },
  productInfo: {
    flex: 1,
    paddingRight: AppTheme.spacing.md,
  },
  productName: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
    marginBottom: AppTheme.spacing.xs,
  },
  productPrice: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.primary,
    marginBottom: AppTheme.spacing.xs,
  },
  productDescription: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    marginRight: AppTheme.spacing.md,
  },
  productImageWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: AppTheme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: AppTheme.colors.secondary,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: AppTheme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    fontSize: AppTheme.fontSize.xs,
    color: AppTheme.colors.mutedForeground,
  },
  colorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.xs,
    gap: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  moreColors: {
    fontSize: AppTheme.fontSize.xs,
    color: AppTheme.colors.mutedForeground,
    marginLeft: 4,
  },
  skeletonRow: {
    height: 100,
    marginBottom: AppTheme.spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: AppTheme.spacing.xl,
    marginTop: AppTheme.spacing.xxxl,
  },
  emptyStateTitle: {
    fontSize: AppTheme.fontSize.xl,
    fontWeight: AppTheme.fontWeight.bold,
    marginTop: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.sm,
  },
  emptyStateText: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
    textAlign: 'center',
  },
  helperText: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
    textAlign: 'center',
    paddingVertical: AppTheme.spacing.xl,
  },
});