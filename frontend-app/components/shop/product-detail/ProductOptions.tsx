import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';

interface ProductOptionsProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  getColorStock: (color: string) => number;
  sizes?: string[];
  selectedSize: string;
  onSizeSelect: (size: string) => void;
  getVariantStock: (color: string, size: string) => number;
  tags?: string[];
}

export function ProductOptions({
  colors,
  selectedColor,
  onColorSelect,
  getColorStock,
  sizes,
  selectedSize,
  onSizeSelect,
  getVariantStock,
  tags,
}: ProductOptionsProps) {
  return (
    <View>
      {/* Color Selector */}
      {colors.length > 0 && (
        <View style={styles.colorSection}>
          <ThemedText style={styles.sectionLabel}>Colors</ThemedText>
          <View style={styles.colorOptions}>
            {colors.map((color) => {
              const colorStock = getColorStock(color);
              const isColorAvailable = colorStock > 0;
              return (
                <View key={color} style={styles.colorOptionContainer}>
                  <TouchableOpacity
                    style={[
                      styles.colorDot,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorDotSelected,
                      !isColorAvailable && styles.colorDotOutOfStock
                    ]}
                    onPress={() => onColorSelect(color)}
                    disabled={!isColorAvailable}
                  >
                    {!isColorAvailable && (
                      <View style={styles.outOfStockLine} />
                    )}
                  </TouchableOpacity>
                  {selectedColor === color && (
                    <ThemedText style={styles.colorStockText}>
                      {colorStock} in stock
                    </ThemedText>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Sizes */}
      {sizes && sizes.length > 0 && selectedColor && (
        <View style={styles.sizeSection}>
          <ThemedText style={styles.sectionLabel}>Sizes</ThemedText>
          <View style={styles.sizeOptions}>
            {sizes.map((size, idx) => {
              const sizeStock = getVariantStock(selectedColor, size);
              const isSizeAvailable = sizeStock > 0;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.sizeBadge,
                    selectedSize === size && styles.sizeBadgeSelected,
                    !isSizeAvailable && styles.sizeBadgeOutOfStock
                  ]}
                  onPress={() => onSizeSelect(size)}
                  disabled={!isSizeAvailable}
                >
                  <ThemedText style={[
                    styles.sizeText,
                    selectedSize === size && styles.sizeTextSelected,
                    !isSizeAvailable && styles.sizeTextOutOfStock
                  ]}>
                    {size}
                  </ThemedText>
                  {isSizeAvailable && (
                    <ThemedText style={styles.sizeStockText}>
                      ({sizeStock})
                    </ThemedText>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <View style={styles.tagSection}>
          <ThemedText style={styles.sectionLabel}>Tags</ThemedText>
          <View style={styles.tagOptions}>
            {tags.map((tag, idx) => (
              <View key={idx} style={styles.tagBadge}>
                <ThemedText style={styles.tagText}>{tag}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    flexWrap: 'wrap',
    gap: AppTheme.spacing.md,
  },
  colorOptionContainer: {
    alignItems: 'center',
    gap: 4,
  },
  colorDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorDotSelected: {
    borderColor: AppTheme.colors.primary,
    borderWidth: 3,
  },
  colorDotOutOfStock: {
    opacity: 0.3,
  },
  outOfStockLine: {
    position: 'absolute',
    width: 50,
    height: 2,
    backgroundColor: AppTheme.colors.error,
    transform: [{ rotate: '45deg' }],
  },
  colorStockText: {
    fontSize: AppTheme.fontSize.xs,
    color: AppTheme.colors.mutedForeground,
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sizeBadgeSelected: {
    backgroundColor: AppTheme.colors.primary,
    borderColor: AppTheme.colors.primary,
  },
  sizeBadgeOutOfStock: {
    opacity: 0.3,
    backgroundColor: AppTheme.colors.muted,
  },
  sizeText: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.medium,
  },
  sizeTextSelected: {
    color: AppTheme.colors.primaryForeground,
  },
  sizeTextOutOfStock: {
    textDecorationLine: 'line-through',
  },
  sizeStockText: {
    fontSize: AppTheme.fontSize.xs,
    color: AppTheme.colors.mutedForeground,
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
});
