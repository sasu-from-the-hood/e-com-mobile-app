import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { X, Square, CheckSquare } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { QuantityControl } from './quantity-control';
import { AppTheme } from '@/constants/app-theme';
import { formatPrice } from '@/utils/formatters';
import { URL } from '@/config';
import type { CartItem as CartItemType } from '@/types/schema';

export interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onToggleSelection: (id: string, selected: boolean) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove, onToggleSelection }: CartItemProps) {
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) {
      console.log('No image path provided');
      return '';
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log('Full URL:', imagePath);
      return imagePath;
    }
    const fullUrl = URL.IMAGE + imagePath;
    console.log('Constructed URL:', fullUrl, 'from', imagePath);
    return fullUrl;
  };

  console.log('CartItem rendering:', {
    id: item.id,
    name: item.name,
    image: item.image,
    selected: item.selected,
    color: item.color
  });

  return (
    <View style={styles.container}>
      {/* Checkbox */}
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggleSelection(item.id, !item.selected)}
      >
        {item.selected ? (
          <CheckSquare size={24} color={AppTheme.colors.primary} />
        ) : (
          <Square size={24} color={AppTheme.colors.mutedForeground} />
        )}
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onRemove(item.id)}
      >
        <X size={18} color={AppTheme.colors.destructive} />
      </TouchableOpacity>

      <View style={[
        styles.imageContainer,
        item.color && { borderWidth: 3, borderColor: item.color }
      ]}>
        {getImageUrl(item.image) ? (
          <Image
            source={{ uri: getImageUrl(item.image) }}
            style={styles.image}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.image, { backgroundColor: AppTheme.colors.muted, justifyContent: 'center', alignItems: 'center' }]}>
            <ThemedText style={{ color: AppTheme.colors.mutedForeground }}>No Image</ThemedText>
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <ThemedText style={styles.name} numberOfLines={2}>
          {item.name}
        </ThemedText>
        <View style={styles.detailsRow}>
          {item.color && (
            <View style={styles.colorDetail}>
              <View style={[styles.colorDot, { backgroundColor: item.color }]} />
              <ThemedText style={styles.detail}>Color</ThemedText>
            </View>
          )}
          {item.size && (
            <ThemedText style={styles.detail}>Size: {item.size}</ThemedText>
          )}
        </View>
        <View style={styles.bottomRow}>
          <ThemedText style={styles.price}>
            ETB {formatPrice(item.price)}
          </ThemedText>
          <QuantityControl
            quantity={item.quantity}
            onIncrement={() => onUpdateQuantity(item.id, item.quantity + 1)}
            onDecrement={() => onUpdateQuantity(item.id, item.quantity - 1)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.background,
    borderRadius: AppTheme.borderRadius.md,
    marginBottom: AppTheme.spacing.md,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    position: 'relative',
  },
  checkbox: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AppTheme.colors.background,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: AppTheme.borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: AppTheme.colors.secondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    marginLeft: AppTheme.spacing.md,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.semibold,
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  colorDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  detail: {
    fontSize: AppTheme.fontSize.xs,
    color: AppTheme.colors.mutedForeground,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.bold,
  },
});