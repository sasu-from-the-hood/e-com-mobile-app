import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';

interface ProductStockProps {
  selectedColor: string;
  selectedSize: string;
  hasSizes: boolean;
  isInStock: boolean;
  currentStock: number;
}

export function ProductStock({
  selectedColor,
  selectedSize,
  hasSizes,
  isInStock,
  currentStock,
}: ProductStockProps) {
  const shouldShowAvailability = () => {
    if (!selectedColor) return false;
    if (hasSizes && !selectedSize) return false;
    return true;
  };

  if (!selectedColor) return null;

  return (
    <View style={styles.stockSection}>
      <ThemedText style={styles.sectionLabel}>Availability</ThemedText>
      {shouldShowAvailability() ? (
        <>
          {isInStock ? (
            <View style={styles.stockInfo}>
              <View style={[styles.stockDot, { backgroundColor: AppTheme.colors.success }]} />
              <ThemedText style={styles.stockText}>
                In Stock ({currentStock} available)
              </ThemedText>
            </View>
          ) : (
            <View style={styles.stockInfo}>
              <View style={[styles.stockDot, { backgroundColor: AppTheme.colors.error }]} />
              <ThemedText style={[styles.stockText, { color: AppTheme.colors.error }]}>
                Out of Stock
              </ThemedText>
            </View>
          )}
        </>
      ) : (
        <View style={styles.stockInfo}>
          <View style={[styles.stockDot, { backgroundColor: AppTheme.colors.mutedForeground }]} />
          <ThemedText style={styles.stockText}>
            Select a size to check availability
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stockSection: {
    marginBottom: AppTheme.spacing.lg,
  },
  sectionLabel: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
    marginBottom: AppTheme.spacing.sm,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.sm,
  },
  stockDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stockText: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.medium,
  },
});
