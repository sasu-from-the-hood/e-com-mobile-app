import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { Heart } from 'lucide-react-native';
import type { Product } from '@/types/schema';
import { useEffect, useRef, useState, memo } from 'react';
import { URL } from '@/config';
import { settingsStorage } from '@/utils/settings-storage';
import { Model3DViewer } from './model-3d-viewer';
import { useFavorites } from '@/hooks/useFavorites';

export interface ProductCardProps {
  product: Product;
  onPress: () => void;
  hideDetails?: boolean;
}

const ProductCardComponent = ({ product, onPress, hideDetails = false }: ProductCardProps) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const colorImages = product.colorImages || {};
  const colors = Object.keys(colorImages);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userPreference, setUserPreference] = useState<'3d' | 'image'>('3d');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  const has3DModels = product.mediaType === 'glb' || product.mediaType === 'both';
  let glbModelIds: string[] = [];
  try {
    if (typeof product.glbModelIds === 'string') {
      glbModelIds = JSON.parse(product.glbModelIds);
    } else if (Array.isArray(product.glbModelIds)) {
      glbModelIds = product.glbModelIds;
    }
  } catch (error) {
    console.error(`[ProductCard] Failed to parse glbModelIds:`, error);
  }
  const hasImages = colors.length > 0;
  
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const preference = await settingsStorage.getSetting('productViewPreference');
        setUserPreference(preference);
      } catch (error) {
        console.error('Error loading preference:', error);
      }
    };
    loadPreference();
  }, []);
  
  const shouldShow3D = userPreference === '3d' && has3DModels && glbModelIds.length > 0;
  const shouldShowImages = !shouldShow3D && hasImages;
  
  const colorIndexRef = useRef(0);
  const imageIndexRef = useRef(0);

  const selectedColor = colors[currentColorIndex] || '';
  const images = colorImages[selectedColor] || [];
  const currentImage = images[currentImageIndex];

  const isLowStock = product.inStock && product.stockQuantity && product.stockQuantity <= (product.lowStockThreshold || 10);
  const isOutOfStock = !product.inStock || product.stockQuantity === 0;

  const totalImages = colors.reduce((sum, color) => sum + (colorImages[color]?.length || 0), 0);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) {
      const firstColorImages = Object.values(colorImages)[0];
      if (firstColorImages && firstColorImages.length > 0) {
        const firstImage = firstColorImages[0];
        if (firstImage.startsWith('http://') || firstImage.startsWith('https://')) {
          return firstImage;
        }
        return URL.IMAGE + firstImage;
      }
      return '';
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return URL.IMAGE + imagePath;
  };

  const validateImage = (imagePath: string): boolean => {
    if (!imagePath) return false;
    for (const color of colors) {
      const images = colorImages[color] || [];
      if (images.includes(imagePath)) {
        return true;
      }
    }
    return false;
  };

  // Auto-slide through images
  useEffect(() => {
    if (colors.length === 0 || totalImages <= 1) return;

    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();

      const currentColorIdx = colorIndexRef.current;
      const currentImageIdx = imageIndexRef.current;
      const currentColor = colors[currentColorIdx];
      const imagesForColor = colorImages[currentColor] || [];
      const nextImageIdx = currentImageIdx + 1;

      if (nextImageIdx >= imagesForColor.length) {
        const nextColorIdx = (currentColorIdx + 1) % colors.length;
        colorIndexRef.current = nextColorIdx;
        imageIndexRef.current = 0;
        setCurrentColorIndex(nextColorIdx);
        setCurrentImageIndex(0);
      } else {
        imageIndexRef.current = nextImageIdx;
        setCurrentImageIndex(nextImageIdx);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    colorIndexRef.current = currentColorIndex;
    imageIndexRef.current = currentImageIndex;
  }, [currentColorIndex, currentImageIndex]);

  const handleWishlistToggle = (e: any) => {
    e.stopPropagation();
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product.id);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Image container with fixed aspect ratio */}
      <View style={styles.imageContainer}>
        {shouldShow3D ? (
          <Model3DViewer modelIds={glbModelIds} />
        ) : shouldShowImages ? (
          <Animated.View style={{ opacity: fadeAnim, width: '100%', height: '100%' }}>
            {currentImage && validateImage(currentImage) && getImageUrl(currentImage) ? (
              <Image
                key={`${product.id}-${selectedColor}-${currentImageIndex}`}
                source={{ uri: getImageUrl(currentImage) }}
                style={styles.image}
                contentFit="cover"
              />
            ) : (
              <View style={[styles.image, styles.noImage]}>
                <ThemedText style={styles.noImageText}>No Image</ThemedText>
              </View>
            )}
          </Animated.View>
        ) : (
          <View style={[styles.image, styles.noImage]}>
            <ThemedText style={styles.noImageText}>No Media</ThemedText>
          </View>
        )}
        
        {/* Top-left badges — grouped pill, outer edges curved only */}
        {!hideDetails && (
          <View style={styles.badgesContainer}>
            {product.discount && product.discount > 0 && (
              <View style={[
                styles.discountBadge,
                // if a stock badge follows, flatten the right side
                (isOutOfStock || isLowStock) ? styles.badgeLeft : styles.badgeSolo,
              ]}>
                <ThemedText style={styles.badgeText}>-{product.discount}%</ThemedText>
              </View>
            )}
            {isOutOfStock && (
              <View style={[
                styles.outOfStockBadge,
                // if discount badge precedes, flatten the left side
                (product.discount && product.discount > 0) ? styles.badgeRight : styles.badgeSolo,
              ]}>
                <ThemedText style={styles.badgeText}>Out of Stock</ThemedText>
              </View>
            )}
            {isLowStock && !isOutOfStock && (
              <View style={[
                styles.lowStockBadge,
                (product.discount && product.discount > 0) ? styles.badgeRight : styles.badgeSolo,
              ]}>
                <ThemedText style={styles.badgeText}>{product.stockQuantity} left</ThemedText>
              </View>
            )}
          </View>
        )}
        
        {/* Top-right wishlist button */}
        {!hideDetails && (
          <TouchableOpacity style={styles.wishlistButton} onPress={handleWishlistToggle} activeOpacity={0.8}>
            <Heart
              size={18}
              color={isFavorite(product.id) ? AppTheme.colors.error : '#fff'}
              fill={isFavorite(product.id) ? AppTheme.colors.error : 'transparent'}
              strokeWidth={2}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Info below image */}
      {!hideDetails && (
        <View style={styles.infoContainer}>
          <ThemedText style={styles.name} numberOfLines={2}>
            {product.name}
          </ThemedText>
          
          {/* Price row */}
          <View style={styles.priceRow}>
            {product.discount && product.discount > 0 ? (
              <>
                <ThemedText style={styles.price}>
                  ETB {product.price}
                </ThemedText>
                <ThemedText style={styles.originalPrice}>
                  ETB {(Number(product.price) / (1 - product.discount / 100)).toFixed(2)}
                </ThemedText>
              </>
            ) : (
              <ThemedText style={styles.price}>
                ETB {product.price}
              </ThemedText>
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const ProductCard = memo(ProductCardComponent, (prevProps, nextProps) => {
  return prevProps.product.id === nextProps.product.id;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: AppTheme.spacing.sm,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: AppTheme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: AppTheme.colors.secondary,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    backgroundColor: AppTheme.colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: AppTheme.colors.mutedForeground,
    fontSize: 10,
  },
  badgesContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    zIndex: 1,
  },
  badgeSolo: {
    borderRadius: 6,
  },
  badgeLeft: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  badgeRight: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  discountBadge: {
    backgroundColor: AppTheme.colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  outOfStockBadge: {
    backgroundColor: '#666',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  lowStockBadge: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: AppTheme.fontWeight.bold,
    color: '#fff',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  infoContainer: {
    marginTop: AppTheme.spacing.sm,
    gap: 4,
  },
  name: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.semibold,
    color: AppTheme.colors.foreground,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.primary,
  },
  originalPrice: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.medium,
    color: AppTheme.colors.mutedForeground,
    textDecorationLine: 'line-through',
  },
});
