import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { Heart, Star, Plus, Minus, X } from 'lucide-react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/onboarding/primary-button';
import { AppTheme } from '@/constants/app-theme';
import { formatPrice } from '@/utils/formatters';
import { useProduct } from '@/hooks/useProducts';
import { authConfig as URL } from '@/config/auth.config';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { useProductReviews } from '@/hooks/useReviews';
import { showToast } from '@/utils/toast';
import type { Product } from '@/types/schema';

const { width } = Dimensions.get('window');

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

  const colorImages = product?.colorImages || {};
  const colors = Object.keys(colorImages);
  const images = selectedColor ? colorImages[selectedColor] || [] : [];
  const currentImage = images[currentImageIndex];

  useEffect(() => {
    if (colors.length > 0 && !selectedColor) {
      setSelectedColor(colors[0]);
    }
  }, [colors, selectedColor]);

  // Get image URL with proper prefix
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return product?.image;
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Otherwise, prepend the IMAGE URL
    return URL.ImageUrl + imagePath;
  };

  // Create pan gesture for swiping images
  const panGesture = Gesture.Pan()
    .onEnd((event) => {
      if (images.length === 0) return;

      if (event.translationX < -50) {
        // Swipe left - next image
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      } else if (event.translationX > 50) {
        // Swipe right - previous image
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    });

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
    // Initialize with first color and size if available
    if (colors.length > 0 && !selectedColor) {
      setSelectedColor(colors[0]);
    }
    if (product?.sizes && product.sizes.length > 0 && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
    setShowAddToCartModal(true);
  };

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
        {/* Product Image - Swipeable */}
        <GestureDetector gesture={panGesture}>
          <View style={styles.imageContainer}>
            <Image
              source={currentImage ? { uri: getImageUrl(currentImage) } : product.image}
              style={styles.image}
              contentFit="cover"
            />
            {images.length > 1 && (
              <View style={styles.imageIndicator}>
                {images.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.indicatorDot,
                      idx === currentImageIndex && styles.indicatorDotActive
                    ]}
                  />
                ))}
              </View>
            )}
            {product.discount && product.discount > 0 && (
              <View style={styles.discountBadge}>
                <ThemedText style={styles.discountText}>
                  -{product.discount}%
                </ThemedText>
              </View>
            )}
            {/* Swipe Hint */}
            {images.length > 1 && (
              <View style={styles.swipeHint}>
                <ThemedText style={styles.swipeHintText}>
                  ← Swipe to view more →
                </ThemedText>
              </View>
            )}
          </View>
        </GestureDetector>

        {/* Product Info */}
        <View style={styles.content}>
          <ThemedText style={styles.name}>{product.name}</ThemedText>
          {product.discount && product.discount > 0 ? (
            <View style={styles.priceSection}>
              <ThemedText style={styles.originalPriceText}>
                ${(Number(product.price) / (1 - Number(product.discount) / 100)).toFixed(2)}
              </ThemedText>
              <ThemedText style={styles.price}>{formatPrice(product.price)}</ThemedText>
            </View>
          ) : (
            <ThemedText style={styles.price}>{formatPrice(product.price)}</ThemedText>
          )}

          {/* Color Selector */}
          {colors.length > 0 && (
            <View style={styles.colorSection}>
              <ThemedText style={styles.sectionLabel}>Colors</ThemedText>
              <View style={styles.colorOptions}>
                {colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorDot,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorDotSelected
                    ]}
                    onPress={() => {
                      setSelectedColor(color);
                      setCurrentImageIndex(0);
                    }}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <View style={styles.sizeSection}>
              <ThemedText style={styles.sectionLabel}>Sizes</ThemedText>
              <View style={styles.sizeOptions}>
                {product.sizes.map((size, idx) => (
                  <View key={idx} style={styles.sizeBadge}>
                    <ThemedText style={styles.sizeText}>{size}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <View style={styles.tagSection}>
              <ThemedText style={styles.sectionLabel}>Tags</ThemedText>
              <View style={styles.tagOptions}>
                {product.tags.map((tag, idx) => (
                  <View key={idx} style={styles.tagBadge}>
                    <ThemedText style={styles.tagText}>{tag}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Description */}
          <View style={styles.descriptionSection}>
            <ThemedText style={styles.sectionLabel}>Description</ThemedText>
            <ThemedText style={styles.description}>{product.description}</ThemedText>
          </View>

          {/* Reviews */}
          <View style={styles.reviewsSection}>
            <ThemedText style={styles.sectionLabel}>Reviews ({reviews.length})</ThemedText>
            {reviews.slice(0, 3).map((review: any) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.starsContainer}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        color={AppTheme.colors.primary}
                        fill={i < review.rating ? AppTheme.colors.primary : 'transparent'}
                      />
                    ))}
                  </View>
                  <ThemedText style={styles.reviewRating}>{review.rating}/5</ThemedText>
                </View>
                {review.userName && (
                  <ThemedText style={styles.reviewerName}>By {review.userName}</ThemedText>
                )}
                <ThemedText style={styles.reviewComment}>{review.comment}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
        </View>
        <View style={styles.buttonRow}>
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
          <PrimaryButton
            title="Add to Cart"
            onPress={handleOpenAddToCart}
            style={styles.addButton}
          />
        </View>
      </View>

      {/* Add to Cart Modal */}
      <Modal
        visible={showAddToCartModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddToCartModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Add to Cart</ThemedText>
              <TouchableOpacity onPress={() => setShowAddToCartModal(false)}>
                <X size={24} color={AppTheme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* Color Selection */}
            {colors.length > 0 && (
              <View style={styles.modalSection}>
                <ThemedText style={styles.modalSectionTitle}>Color</ThemedText>
                <View style={styles.modalColorOptions}>
                  {colors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.modalColorOption,
                        selectedColor === color && styles.modalColorOptionSelected,
                      ]}
                      onPress={() => setSelectedColor(color)}
                    >
                      <View style={[styles.modalColorCircle, { backgroundColor: color }]} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Size Selection */}
            {product?.sizes && product.sizes.length > 0 && (
              <View style={styles.modalSection}>
                <ThemedText style={styles.modalSectionTitle}>Size</ThemedText>
                <View style={styles.modalSizeOptions}>
                  {product.sizes.map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.modalSizeOption,
                        selectedSize === size && styles.modalSizeOptionSelected,
                      ]}
                      onPress={() => setSelectedSize(size)}
                    >
                      <ThemedText
                        style={[
                          styles.modalSizeText,
                          selectedSize === size && styles.modalSizeTextSelected,
                        ]}
                      >
                        {size}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Quantity Selection */}
            <View style={styles.modalSection}>
              <ThemedText style={styles.modalSectionTitle}>Quantity</ThemedText>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus size={20} color={AppTheme.colors.text} />
                </TouchableOpacity>
                <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Plus size={20} color={AppTheme.colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Add to Cart Button */}
            <PrimaryButton
              title={`Add ${quantity} to Cart - ${formatPrice(product?.price ? product.price * quantity : 0)}`}
              onPress={handleAddToCart}
              style={styles.modalAddButton}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: AppTheme.colors.secondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: AppTheme.spacing.md,
  },
  name: {
    fontSize: AppTheme.fontSize.xxl,
    fontWeight: AppTheme.fontWeight.bold,
    marginBottom: AppTheme.spacing.sm,
  },
  discountBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: AppTheme.colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
  },
  discountText: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.bold,
    color: '#fff',
  },
  priceSection: {
    marginBottom: AppTheme.spacing.lg,
  },
  originalPriceText: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.medium,
    color: AppTheme.colors.mutedForeground,
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  price: {
    fontSize: AppTheme.fontSize.xl,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.primary,
    marginBottom: AppTheme.spacing.lg,
  },
  colorSection: {
    marginBottom: AppTheme.spacing.lg,
  },
  sectionLabel: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
    marginBottom: AppTheme.spacing.sm,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: AppTheme.spacing.md,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorDotSelected: {
    borderColor: AppTheme.colors.primary,
  },
  descriptionSection: {
    marginBottom: AppTheme.spacing.lg,
  },
  description: {
    fontSize: AppTheme.fontSize.base,
    lineHeight: 24,
    color: AppTheme.colors.mutedForeground,
  },
  footer: {
    padding: AppTheme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
    gap: AppTheme.spacing.sm,
    alignItems: 'center',
    minHeight: 60,
  },
  priceContainer: {
    flex: 1,
  },
  footerLabel: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
  },
  footerPrice: {
    fontSize: AppTheme.fontSize.xl,
    fontWeight: AppTheme.fontWeight.bold,
  },
  addButton: {
    flex: 1,
  },
  reviewsSection: {
    marginBottom: AppTheme.spacing.lg,
  },
  reviewItem: {
    paddingVertical: AppTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  reviewRating: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.primary,
  },
  reviewerName: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.semibold,
    color: AppTheme.colors.foreground,
    marginTop: 4,
  },
  reviewComment: {
    fontSize: AppTheme.fontSize.sm,
    marginTop: 4,
    color: AppTheme.colors.mutedForeground,
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
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.sm,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
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
  imageIndicator: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorDotActive: {
    backgroundColor: '#fff',
    width: 20,
  },
  sizeSection: {
    marginBottom: AppTheme.spacing.lg,
  },
  sizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm,
  },
  sizeBadge: {
    backgroundColor: AppTheme.colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sizeText: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.medium,
  },
  tagSection: {
    marginBottom: AppTheme.spacing.lg,
  },
  tagOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm,
  },
  tagBadge: {
    backgroundColor: AppTheme.colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.primary,
    fontWeight: AppTheme.fontWeight.medium,
  },
  swipeHint: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  swipeHintText: {
    fontSize: AppTheme.fontSize.xs,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: AppTheme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: AppTheme.fontSize.xl,
    fontWeight: AppTheme.fontWeight.bold,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
    marginBottom: 12,
  },
  modalColorOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalColorOption: {
    padding: 4,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modalColorOptionSelected: {
    borderColor: AppTheme.colors.primary,
  },
  modalColorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  modalSizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  modalSizeOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.background,
  },
  modalSizeOptionSelected: {
    backgroundColor: AppTheme.colors.primary,
    borderColor: AppTheme.colors.primary,
  },
  modalSizeText: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.medium,
  },
  modalSizeTextSelected: {
    color: AppTheme.colors.primaryForeground,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: AppTheme.fontSize.xl,
    fontWeight: AppTheme.fontWeight.semibold,
    minWidth: 40,
    textAlign: 'center',
  },
  modalAddButton: {
    marginTop: 8,
  },
});