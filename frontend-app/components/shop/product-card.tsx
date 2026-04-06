import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import type { Product } from '@/types/schema';
import { useEffect, useRef, useState, memo } from 'react';
import { URL } from '@/config';
import { settingsStorage } from '@/utils/settings-storage';
import { Model3DViewer } from './model-3d-viewer';

// Loading dots component
function LoadingDots() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(dot1, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(dot1, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(dot2, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(dot3, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
      ]).start(() => animate());
    };
    animate();
  }, []);

  return (
    <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: AppTheme.colors.primary, opacity: dot1 }} />
      <Animated.View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: AppTheme.colors.primary, opacity: dot2 }} />
      <Animated.View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: AppTheme.colors.primary, opacity: dot3 }} />
    </View>
  );
}

export interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const ProductCardComponent = ({ product, onPress }: ProductCardProps) => {
  const colorImages = product.colorImages || {};
  const colors = Object.keys(colorImages);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userPreference, setUserPreference] = useState<'3d' | 'image'>('3d');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  // Check if product has 3D models
  const has3DModels = product.mediaType === 'glb' || product.mediaType === 'both';
  // Parse glbModelIds if it's a string
  let glbModelIds: string[] = [];
  try {
    if (typeof product.glbModelIds === 'string') {
      glbModelIds = JSON.parse(product.glbModelIds);
    } else if (Array.isArray(product.glbModelIds)) {
      glbModelIds = product.glbModelIds;
    }
  } catch (error) {
    console.error(`[ProductCard] ${product.name} - Failed to parse glbModelIds:`, error);
  }
  const hasImages = colors.length > 0;
  
  // Load user preference
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const preference = await settingsStorage.getSetting('productViewPreference');
        console.log(`[ProductCard] ${product.name} - User preference:`, preference);
        console.log(`[ProductCard] ${product.name} - Has 3D models:`, has3DModels, 'GLB IDs:', glbModelIds);
        setUserPreference(preference);
      } catch (error) {
        console.error(`[ProductCard] ${product.name} - Error loading preference:`, error);
      }
    };
    loadPreference();
  }, [product.name, has3DModels, glbModelIds.length]);
  
  // Determine what to show based on preference and availability
  const shouldShow3D = userPreference === '3d' && has3DModels && glbModelIds.length > 0;
  const shouldShowImages = !shouldShow3D && hasImages;
  
  console.log(`[ProductCard] ${product.name} - Display decision:`, {
    userPreference,
    shouldShow3D,
    shouldShowImages,
    has3DModels,
    glbModelIdsCount: glbModelIds.length
  });
  
  // Store product data in refs to ensure interval uses correct product
  const productRef = useRef(product);
  const colorImagesRef = useRef(colorImages);
  const colorsRef = useRef(colors);
  const colorIndexRef = useRef(0);
  const imageIndexRef = useRef(0);

  // Update refs when product changes
  useEffect(() => {
    productRef.current = product;
    colorImagesRef.current = colorImages;
    colorsRef.current = colors;
  }, [product, colorImages, colors]);

  const selectedColor = colors[currentColorIndex] || '';
  const images = colorImages[selectedColor] || [];
  const currentImage = images[currentImageIndex];

  const isLowStock = product.inStock && product.stockQuantity && product.stockQuantity <= (product.lowStockThreshold || 10);
  const isOutOfStock = !product.inStock || product.stockQuantity === 0;

  // Calculate total images across all colors
  const totalImages = colors.reduce((sum, color) => sum + (colorImages[color]?.length || 0), 0);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) {
      // Fallback: get first image from first color
      const firstColorImages = Object.values(colorImages)[0];
      if (firstColorImages && firstColorImages.length > 0) {
        const firstImage = firstColorImages[0];
        if (firstImage.startsWith('http://') || firstImage.startsWith('https://')) {
          return firstImage;
        }
        return URL.IMAGE + firstImage;
      }
      return ''; // No image available
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return URL.IMAGE + imagePath;
  };

  // Validate that the current image belongs to this product
  const validateImage = (imagePath: string): boolean => {
    if (!imagePath) return false;
    
    // Check if this image exists in any of this product's color images
    for (const color of colors) {
      const images = colorImages[color] || [];
      if (images.includes(imagePath)) {
        return true;
      }
    }
    
    return false;
  };

  // Auto-slide through colors and their images - only if more than 1 image total
  useEffect(() => {
    const productId = productRef.current.id;
    const productName = productRef.current.name;
    const localColors = colorsRef.current;
    const localColorImages = colorImagesRef.current;
    const localTotalImages = localColors.reduce((sum, color) => sum + (localColorImages[color]?.length || 0), 0);
    
    // Skip animation if only 1 image total or no colors
    if (localColors.length === 0 || localTotalImages <= 1) {
      return;
    }

    const interval = setInterval(() => {
      const currentProductId = productRef.current.id;
      const currentProductName = productRef.current.name;
      const currentColors = colorsRef.current;
      const currentColorImages = colorImagesRef.current;
      
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

      // Get current values from refs
      const currentColorIdx = colorIndexRef.current;
      const currentImageIdx = imageIndexRef.current;
      const currentColor = currentColors[currentColorIdx];
      const imagesForColor = currentColorImages[currentColor] || [];
      const nextImageIdx = currentImageIdx + 1;

      // If we've shown all images for this color, move to next color
      if (nextImageIdx >= imagesForColor.length) {
        const nextColorIdx = (currentColorIdx + 1) % currentColors.length;
        const nextColor = currentColors[nextColorIdx];
        
        // Update refs
        colorIndexRef.current = nextColorIdx;
        imageIndexRef.current = 0;
        
        // Update state
        setCurrentColorIndex(nextColorIdx);
        setCurrentImageIndex(0);
      } else {
        
        // Update refs
        imageIndexRef.current = nextImageIdx;
        
        // Update state
        setCurrentImageIndex(nextImageIdx);
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []); // Empty deps - only run once on mount
  
  // Sync refs with state
  useEffect(() => {
    colorIndexRef.current = currentColorIndex;
    imageIndexRef.current = currentImageIndex;
  }, [currentColorIndex, currentImageIndex]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[
        styles.imageContainer,
        selectedColor && shouldShowImages && { borderWidth: 3, borderColor: selectedColor }
      ]}>
        {/* Show 3D viewer or images based on preference */}
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
              <View style={[styles.image, { backgroundColor: AppTheme.colors.muted, justifyContent: 'center', alignItems: 'center' }]}>
                <ThemedText style={{ color: AppTheme.colors.mutedForeground, fontSize: 10 }}>No Image</ThemedText>
              </View>
            )}
          </Animated.View>
        ) : (
          <View style={[styles.image, { backgroundColor: AppTheme.colors.muted, justifyContent: 'center', alignItems: 'center' }]}>
            <ThemedText style={{ color: AppTheme.colors.mutedForeground, fontSize: 10 }}>No Media</ThemedText>
          </View>
        )}
        
        {/* Badges - All grouped in top-left */}
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
          {isLowStock && !isOutOfStock && (
            <View style={styles.lowStockBadge}>
              <ThemedText style={styles.lowStockText}>{product.stockQuantity} left</ThemedText>
            </View>
          )}
        </View>
        <View style={styles.priceOverlay}>
          {product.discount && product.discount > 0 ? (
            <View style={styles.priceContainer}>
              <ThemedText style={styles.originalPrice}>
                ETB {(Number(product.price)/ (1 - product.discount / 100)).toFixed(2)}
              </ThemedText>
              <ThemedText style={styles.overlayPrice}>
                ETB {product.price}
              </ThemedText>
            </View>
          ) : (
            <ThemedText style={styles.overlayPrice}>
              ETB {product.price}
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
};

// Memoize to prevent state interference between cards
export const ProductCard = memo(ProductCardComponent, (prevProps, nextProps) => {
  return prevProps.product.id === nextProps.product.id;
});

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
    flexDirection: 'column',
    gap: 4,
    zIndex: 1,
  },
  toggleButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  discountBadge: {
    backgroundColor: AppTheme.colors.error,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  discountText: {
    fontSize: 10,
    fontWeight: AppTheme.fontWeight.bold,
    color: '#fff',
  },
  outOfStockBadge: {
    backgroundColor: '#666',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
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
    alignSelf: 'flex-start',
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