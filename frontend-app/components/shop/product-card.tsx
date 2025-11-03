import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import type { Product } from '@/types/schema';
import { useEffect, useRef, useState } from 'react';
import { URL } from '@/config';

export interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const colorImages = product.colorImages || {};
  const colors = Object.keys(colorImages);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const selectedColor = colors[currentColorIndex] || '';
  const images = colorImages[selectedColor] || [];
  const currentImage = images[currentImageIndex];

  const isLowStock = product.inStock && product.stockQuantity && product.stockQuantity <= (product.lowStockThreshold || 10);
  const isOutOfStock = !product.inStock || product.stockQuantity === 0;

  console.log('Product card rendering:', {
    productName: product.name,
    selectedColor,
    currentColorIndex,
    currentImageIndex,
    currentImage,
    totalColors: colors.length,
    totalImages: images.length
  });

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) {
      // Fallback: get first image from first color
      const firstColorImages = Object.values(colorImages)[0];
      if (firstColorImages && firstColorImages.length > 0) {
        const firstImage = firstColorImages[0];
        if (firstImage.startsWith('http://') || firstImage.startsWith('https://')) {
          console.log('Product card - Full URL:', firstImage);
          return firstImage;
        }
        const fullUrl = URL.IMAGE + firstImage;
        console.log('Product card - Constructed URL:', fullUrl, 'from', firstImage);
        return fullUrl;
      }
      console.log('Product card - No image available for product:', product.name);
      return ''; // No image available
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log('Product card - Full URL:', imagePath);
      return imagePath;
    }
    const fullUrl = URL.IMAGE + imagePath;
    console.log('Product card - Constructed URL:', fullUrl, 'from', imagePath);
    return fullUrl;
  };

  // Auto-slide through colors and their images
  useEffect(() => {
    if (colors.length === 0) return;

    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentImageIndex((prevImageIndex) => {
        const currentColorImages = colorImages[colors[currentColorIndex]] || [];
        const nextImageIndex = prevImageIndex + 1;

        // If we've shown all images for this color, move to next color
        if (nextImageIndex >= currentColorImages.length) {
          const nextColorIndex = (currentColorIndex + 1) % colors.length;
          const nextColor = colors[nextColorIndex];
          console.log('Product card - Switching to next color:', nextColor, 'for product:', product.name);
          setCurrentColorIndex(nextColorIndex);
          return 0; // Reset to first image of next color
        }

        return nextImageIndex;
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [colors.length, currentColorIndex, fadeAnim, colorImages, colors, product.name]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[
        styles.imageContainer,
        selectedColor && { borderWidth: 3, borderColor: selectedColor }
      ]}>
        <Animated.View style={{ opacity: fadeAnim, width: '100%', height: '100%' }}>
          {getImageUrl(currentImage) ? (
            <Image
              source={{ uri: getImageUrl(currentImage) }}
              style={styles.image}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.image, { backgroundColor: AppTheme.colors.muted, justifyContent: 'center', alignItems: 'center' }]}>
              <ThemedText style={{ color: AppTheme.colors.mutedForeground, fontSize: 10 }}>No Image</ThemedText>
            </View>
          )}
        </Animated.View>
        {/* Badges */}
        <View style={styles.badgesContainer}>
          {product.discount && product.discount > 0 && (
            <View style={styles.discountBadge}>
              <ThemedText style={styles.discountText}>
                -{product.discount}%
              </ThemedText>
            </View>
          )}
          {isOutOfStock && (
            <View style={styles.outOfStockBadge}>
              <ThemedText style={styles.outOfStockText}>Out of Stock</ThemedText>
            </View>
          )}
          {isLowStock && (
            <View style={styles.lowStockBadge}>
              <ThemedText style={styles.lowStockText}>{product.stockQuantity} left</ThemedText>
            </View>
          )}
        </View>
        <View style={styles.priceOverlay}>
          {product.discount && product.discount > 0 ? (
            <View style={styles.priceContainer}>
              <ThemedText style={styles.originalPrice}>
                ${(Number(product.price)/ (1 - product.discount / 100)).toFixed(2)}
              </ThemedText>
              <ThemedText style={styles.overlayPrice}>
                ${product.price}
              </ThemedText>
            </View>
          ) : (
            <ThemedText style={styles.overlayPrice}>
              ${product.price}
            </ThemedText>
          )}
        </View>
      </View>
      <View style={styles.infoContainer}>
        <ThemedText style={styles.name} numberOfLines={1}>
          {product.name}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: AppTheme.spacing.md,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: AppTheme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: AppTheme.colors.secondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    marginTop: AppTheme.spacing.sm,
  },
  name: {
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
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  sizeBadge: {
    backgroundColor: AppTheme.colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sizeText: {
    fontSize: 10,
    fontWeight: AppTheme.fontWeight.medium,
  },
  moreText: {
    fontSize: 10,
    color: AppTheme.colors.mutedForeground,
    alignSelf: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  tagBadge: {
    backgroundColor: AppTheme.colors.primary + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 9,
    color: AppTheme.colors.primary,
    fontWeight: AppTheme.fontWeight.medium,
  },
  badgesContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  outOfStockBadge: {
    backgroundColor: '#666',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  outOfStockText: {
    fontSize: 10,
    fontWeight: AppTheme.fontWeight.bold,
    color: '#fff',
  },
  lowStockBadge: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  lowStockText: {
    fontSize: 10,
    fontWeight: AppTheme.fontWeight.bold,
    color: '#fff',
  },
  colorSelector: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorDotSelected: {
    borderColor: AppTheme.colors.primary,
  },
  colorDotDisabled: {
    opacity: 0.3,
  },
  sizeBadgeDisabled: {
    opacity: 0.4,
    backgroundColor: AppTheme.colors.mutedForeground,
  },
  sizeTextDisabled: {
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: AppTheme.fontWeight.medium,
  },
  reviewCount: {
    fontSize: 10,
    color: AppTheme.colors.mutedForeground,
  },
});