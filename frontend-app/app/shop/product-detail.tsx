import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Heart, User } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/onboarding/primary-button';
import { AppTheme } from '@/constants/app-theme';
import { useProduct } from '@/hooks/useProducts';
import { authConfig as URL } from '@/config/auth.config';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { useProductReviews } from '@/hooks/useReviews';
import { showToast } from '@/utils/toast';
import { settingsStorage } from '@/utils/settings-storage';
import type { Product } from '@/types/schema';
import {
  ProductImageGallery,
  ProductInfo,
  ProductOptions,
  ProductStock,
  ProductReviews,
  AddToCartModal,
} from '@/components/shop/product-detail';
import { ARTryOnModal } from '@/components/shop/ARTryOnModal';
import { CollectionCard } from '@/components/shop/collection-card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { product, loading } = useProduct(id as string) as { product: Product | null; loading: boolean; };
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { reviews } = useProductReviews(id as string);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [showARModal, setShowARModal] = useState(false);

  const colorImages = product?.colorImages || {};
  const colors = Object.keys(colorImages);
  
  // Get ALL images from ALL colors for the gallery
  const allImages: string[] = [];
  colors.forEach(color => {
    const colorImageArray = colorImages[color] || [];
    allImages.push(...colorImageArray);
  });

  const images = allImages;

  // Check if product has 3D models
  const has3DModels = (() => {
    try {
      let glbModelIds: string[] = [];
      if (typeof (product as any)?.glbModelIds === 'string') {
        glbModelIds = JSON.parse((product as any).glbModelIds);
      } else if (Array.isArray((product as any)?.glbModelIds)) {
        glbModelIds = (product as any).glbModelIds;
      }
      return glbModelIds.length > 0;
    } catch (e) {
      return false;
    }
  })();

  // Get parsed glbModelIds
  const getGlbModelIds = (): string[] => {
    try {
      if (typeof (product as any)?.glbModelIds === 'string') {
        return JSON.parse((product as any).glbModelIds);
      } else if (Array.isArray((product as any)?.glbModelIds)) {
        return (product as any).glbModelIds;
      }
    } catch (e) {
      console.error('[ProductDetail] Failed to parse glbModelIds:', e);
    }
    return [];
  };

  // Determine if we should show 3D model based on user preference
  const [show3DModel, setShow3DModel] = useState(false);

  // Load user's product view preference from settings
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const preference = await settingsStorage.getSetting('productViewPreference');
        
        console.log('[ProductDetail] Preference:', preference, 'Has models:', has3DModels);
        
        // Only show 3D model if user prefers it AND product has 3D models
        if (preference === '3d' && has3DModels) {
          setShow3DModel(true);
        }
      } catch (error) {
        console.error('Failed to load product view preference:', error);
      }
    };

    if (product) {
      loadPreference();
    }
  }, [product, has3DModels]);

  // Get variant stock for selected color and size
  const getVariantStock = (color: string, size: string) => {
    if (!product?.variantStock) return 0;
    
    let variantStockObj = product.variantStock;
    if (typeof variantStockObj === 'string') {
      try {
        variantStockObj = JSON.parse(variantStockObj);
      } catch (e) {
        console.error('[ProductDetail] Failed to parse variantStock:', e);
        return 0;
      }
    }
    
    const variantKey = size ? `${color}-${size}` : color;
    const stock = variantStockObj[variantKey] || 0;
    return stock;
  };

  // Get total stock for a color (sum of all sizes)
  const getColorStock = (color: string) => {
    if (!product?.variantStock) return 0;
    
    let variantStockObj = product.variantStock;
    if (typeof variantStockObj === 'string') {
      try {
        variantStockObj = JSON.parse(variantStockObj);
      } catch (e) {
        console.error('[ProductDetail] Failed to parse variantStock:', e);
        return 0;
      }
    }
    
    if (!product.sizes || product.sizes.length === 0) {
      return variantStockObj[color] || 0;
    }
    
    let total = 0;
    product.sizes.forEach(size => {
      const variantKey = `${color}-${size}`;
      const variantStock = variantStockObj[variantKey] || 0;
      total += variantStock;
    });
    return total;
  };

  // Check if current selection is in stock
  const isCurrentSelectionInStock = () => {
    if (!selectedColor) return false;
    
    if (product?.sizes && product.sizes.length > 0) {
      if (!selectedSize) return false;
      const stock = getVariantStock(selectedColor, selectedSize);
      return stock > 0;
    }
    
    const stock = getColorStock(selectedColor);
    return stock > 0;
  };

  const getCurrentStock = () => {
    if (!selectedColor || !product?.variantStock) return 0;
    
    if (product?.sizes && product.sizes.length > 0 && selectedSize) {
      return getVariantStock(selectedColor, selectedSize);
    }
    
    return getColorStock(selectedColor);
  };

  useEffect(() => {
    if (colors.length > 0 && !selectedColor) {
      setSelectedColor(colors[0]);
    }
  }, [colors, selectedColor]);

  // Get image URL with proper prefix
  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return product?.image || '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return URL.ImageUrl + imagePath;
  };

  const handleAddToCart = async () => {
    if (product) {
      try {
        await addToCart(product.id, quantity, selectedColor, selectedSize);
        showToast('success', `Added ${quantity} item(s) to cart`);
        setQuantity(1);
        setShowAddToCartModal(false);
        router.push('/shop/shop-cart');
      } catch (error) {
        console.error('Failed to add to cart:', error);
        showToast('error', 'Failed to add to cart');
      }
    }
  };

  const handleOpenAddToCart = () => {
    if (colors.length > 0 && !selectedColor) {
      setSelectedColor(colors[0]);
    }
    if (product?.sizes && product.sizes.length > 0 && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
    setShowAddToCartModal(true);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setSelectedSize('');
  };

  const handleTryOn = () => {
    setShowARModal(true);
  };

  // Check if product is a collection type
  const isCollection = (product as any)?.type === 'collection';
  
  // Calculate collection card dimensions for detail page (larger than grid view)
  const collectionCardWidth = SCREEN_WIDTH - (AppTheme.spacing.md * 2); // Full width minus padding
  const collectionCardHeight = collectionCardWidth * 1.4; // Taller aspect ratio for detail view

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.imageContainer}>
          <View style={[styles.image, { backgroundColor: AppTheme.colors.secondary }]} />
        </View>
        <View style={styles.content}>
          <View style={styles.skeletonName} />
          <View style={styles.skeletonPrice} />
          <View style={styles.skeletonSection} />
          <View style={styles.skeletonDescription} />
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image Gallery with 3D Model OR Collection Card */}
        {isCollection ? (
          <View style={styles.collectionCardContainer}>
            <CollectionCard
              collection={product}
              onPress={() => {}} // No action needed on detail page
              width={collectionCardWidth}
              height={collectionCardHeight}
              hideInfo={true} // Hide info since it's shown below
            />
          </View>
        ) : (
          <ProductImageGallery
            images={images}
            currentImageIndex={currentImageIndex}
            onImageChange={setCurrentImageIndex}
            discount={product.discount || null}
            getImageUrl={getImageUrl}
            defaultImage={product.image || ''}
            modelIds={getGlbModelIds()}
            showModel={show3DModel}
          />
        )}

        {/* Product Info */}
        <View style={styles.content}>
          <View style={styles.nameContainer}>
            <ThemedText style={styles.productName} numberOfLines={2}>
              {product.name}
            </ThemedText>
          </View>

          <ProductInfo
            name=""
            price={Number(product.price)}
            discount={product.discount ? Number(product.discount) : null}
            description={product.description}
          />

          {/* Product Options */}
          <ProductOptions
            colors={colors}
            selectedColor={selectedColor}
            onColorSelect={handleColorSelect}
            getColorStock={getColorStock}
            sizes={product.sizes}
            selectedSize={selectedSize}
            onSizeSelect={setSelectedSize}
            getVariantStock={getVariantStock}
            tags={product.tags}
          />

          {/* Stock Status */}
          <ProductStock
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            hasSizes={!!(product.sizes && product.sizes.length > 0)}
            isInStock={isCurrentSelectionInStock()}
            currentStock={getCurrentStock()}
          />

          {/* Reviews */}
          <ProductReviews reviews={reviews} />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          {/* Hide favorite button for collection products */}
          {!isCollection && (
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={() => {
                if (isFavorite(product.id)) {
                  removeFromFavorites(product.id);
                } else {
                  addToFavorites(product.id);
                }
              }}
            >
              <Heart 
                size={24} 
                color={AppTheme.colors.primary} 
                fill={isFavorite(product.id) ? AppTheme.colors.primary : 'transparent'}
              />
            </TouchableOpacity>
          )}
          <PrimaryButton
            title="Add to Cart"
            onPress={handleOpenAddToCart}
            style={styles.addButton}
            disabled={!selectedColor || !isCurrentSelectionInStock()}
          />
        </View>
      </View>

      {/* Add to Cart Modal */}
      <AddToCartModal
        visible={showAddToCartModal}
        onClose={() => setShowAddToCartModal(false)}
        colors={colors}
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
        getColorStock={getColorStock}
        sizes={product.sizes}
        selectedSize={selectedSize}
        onSizeSelect={setSelectedSize}
        getVariantStock={getVariantStock}
        quantity={quantity}
        onQuantityChange={setQuantity}
        price={Number(product.price)}
        onAddToCart={handleAddToCart}
        isInStock={isCurrentSelectionInStock()}
      />

      {/* AR Try-On Modal */}
      <ARTryOnModal
        visible={showARModal}
        onClose={() => setShowARModal(false)}
        productModelIds={getGlbModelIds()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  imageContainer: {
    backgroundColor: AppTheme.colors.secondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: AppTheme.spacing.md,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: AppTheme.spacing.sm,
    gap: AppTheme.spacing.sm,
  },
  productName: {
    flex: 1,
    fontSize: AppTheme.fontSize.xxl,
    fontWeight: AppTheme.fontWeight.bold,
  },
  tryOnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: AppTheme.colors.primary,
    backgroundColor: AppTheme.colors.background,
  },
  tryOnText: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.semibold,
    color: AppTheme.colors.primary,
  },
  footer: {
    padding: AppTheme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
    gap: AppTheme.spacing.sm,
    alignItems: 'center',
    minHeight: 60,
  },
  addButton: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: AppTheme.spacing.md,
    alignItems: 'center',
  },
  favoriteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: AppTheme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonName: {
    height: 32,
    backgroundColor: AppTheme.colors.secondary,
    borderRadius: 4,
    marginBottom: AppTheme.spacing.sm,
    width: '80%',
  },
  skeletonPrice: {
    height: 28,
    backgroundColor: AppTheme.colors.secondary,
    borderRadius: 4,
    marginBottom: AppTheme.spacing.lg,
    width: '40%',
  },
  skeletonSection: {
    height: 20,
    backgroundColor: AppTheme.colors.secondary,
    borderRadius: 4,
    marginBottom: AppTheme.spacing.lg,
    width: '60%',
  },
  skeletonDescription: {
    height: 60,
    backgroundColor: AppTheme.colors.secondary,
    borderRadius: 4,
    width: '100%',
  },
  collectionCardContainer: {
    padding: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.background,
    alignItems: 'center',
  },
});
