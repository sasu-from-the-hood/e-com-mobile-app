import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { formatPrice } from '@/utils/formatters';

interface ProductInfoProps {
  name: string;
  price: number;
  discount?: number | null;
  description: string;
}

export function ProductInfo({ name, price, discount, description }: ProductInfoProps) {
  return (
    <View style={styles.container}>
      {name && <ThemedText style={styles.name}>{name}</ThemedText>}
      
      {discount && discount > 0 ? (
        <View style={styles.priceSection}>
          <ThemedText style={styles.originalPriceText}>
            ETB {(Number(price) / (1 - Number(discount) / 100)).toFixed(2)}
          </ThemedText>
          <ThemedText style={styles.price}>ETB {formatPrice(price)}</ThemedText>
        </View>
      ) : (
        <ThemedText style={styles.price}>ETB {formatPrice(price)}</ThemedText>
      )}

      <View style={styles.descriptionSection}>
        <ThemedText style={styles.sectionLabel}>Description</ThemedText>
        <ThemedText style={styles.description}>{description}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: AppTheme.spacing.lg,
  },
  name: {
    fontSize: AppTheme.fontSize.xxl,
    fontWeight: AppTheme.fontWeight.bold,
    marginBottom: AppTheme.spacing.sm,
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
  descriptionSection: {
    marginTop: AppTheme.spacing.lg,
  },
  sectionLabel: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
    marginBottom: AppTheme.spacing.sm,
  },
  description: {
    fontSize: AppTheme.fontSize.base,
    lineHeight: 24,
    color: AppTheme.colors.mutedForeground,
  },
});
