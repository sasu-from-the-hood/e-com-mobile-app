import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { X, Plus, Minus } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/onboarding/primary-button';
import { AppTheme } from '@/constants/app-theme';
import { formatPrice } from '@/utils/formatters';

interface AddToCartModalProps {
  visible: boolean;
  onClose: () => void;
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  getColorStock: (color: string) => number;
  sizes?: string[];
  selectedSize: string;
  onSizeSelect: (size: string) => void;
  getVariantStock: (color: string, size: string) => number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  price: number;
  onAddToCart: () => void;
  isInStock: boolean;
}

export function AddToCartModal({
  visible,
  onClose,
  colors,
  selectedColor,
  onColorSelect,
  getColorStock,
  sizes,
  selectedSize,
  onSizeSelect,
  getVariantStock,
  quantity,
  onQuantityChange,
  price,
  onAddToCart,
  isInStock,
}: AddToCartModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>Add to Cart</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={AppTheme.colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Color Selection */}
          {colors.length > 0 && (
            <View style={styles.modalSection}>
              <ThemedText style={styles.modalSectionTitle}>Color</ThemedText>
              <View style={styles.modalColorOptions}>
                {colors.map((color) => {
                  const colorStock = getColorStock(color);
                  const isColorAvailable = colorStock > 0;
                  return (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.modalColorOption,
                        selectedColor === color && styles.modalColorOptionSelected,
                        !isColorAvailable && styles.modalColorOptionDisabled,
                      ]}
                      onPress={() => {
                        onColorSelect(color);
                        onSizeSelect(''); // Reset size when color changes
                      }}
                      disabled={!isColorAvailable}
                    >
                      <View style={[styles.modalColorCircle, { backgroundColor: color }]}>
                        {!isColorAvailable && (
                          <View style={styles.modalOutOfStockLine} />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Size Selection */}
          {sizes && sizes.length > 0 && selectedColor && (
            <View style={styles.modalSection}>
              <ThemedText style={styles.modalSectionTitle}>Size</ThemedText>
              <View style={styles.modalSizeOptions}>
                {sizes.map((size) => {
                  const sizeStock = getVariantStock(selectedColor, size);
                  const isSizeAvailable = sizeStock > 0;
                  return (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.modalSizeOption,
                        selectedSize === size && styles.modalSizeOptionSelected,
                        !isSizeAvailable && styles.modalSizeOptionDisabled,
                      ]}
                      onPress={() => onSizeSelect(size)}
                      disabled={!isSizeAvailable}
                    >
                      <ThemedText
                        style={[
                          styles.modalSizeText,
                          selectedSize === size && styles.modalSizeTextSelected,
                          !isSizeAvailable && styles.modalSizeTextDisabled,
                        ]}
                      >
                        {size}
                      </ThemedText>
                      {isSizeAvailable && (
                        <ThemedText style={styles.modalSizeStockText}>
                          {sizeStock} left
                        </ThemedText>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Quantity Selection */}
          <View style={styles.modalSection}>
            <ThemedText style={styles.modalSectionTitle}>Quantity</ThemedText>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => onQuantityChange(Math.max(1, quantity - 1))}
              >
                <Minus size={20} color={AppTheme.colors.foreground} />
              </TouchableOpacity>
              <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => onQuantityChange(quantity + 1)}
              >
                <Plus size={20} color={AppTheme.colors.foreground} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Add to Cart Button */}
          <PrimaryButton
            title={`Add ${quantity} to Cart - ETB ${formatPrice(Number(price) * quantity)}`}
            onPress={onAddToCart}
            style={styles.modalAddButton}
            disabled={!isInStock}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  modalColorOptionDisabled: {
    opacity: 0.3,
  },
  modalColorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOutOfStockLine: {
    position: 'absolute',
    width: 50,
    height: 2,
    backgroundColor: AppTheme.colors.error,
    transform: [{ rotate: '45deg' }],
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
    alignItems: 'center',
  },
  modalSizeOptionSelected: {
    backgroundColor: AppTheme.colors.primary,
    borderColor: AppTheme.colors.primary,
  },
  modalSizeOptionDisabled: {
    opacity: 0.3,
    backgroundColor: AppTheme.colors.muted,
  },
  modalSizeText: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.medium,
  },
  modalSizeTextSelected: {
    color: AppTheme.colors.primaryForeground,
  },
  modalSizeTextDisabled: {
    textDecorationLine: 'line-through',
  },
  modalSizeStockText: {
    fontSize: AppTheme.fontSize.xs,
    color: AppTheme.colors.mutedForeground,
    marginTop: 2,
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
