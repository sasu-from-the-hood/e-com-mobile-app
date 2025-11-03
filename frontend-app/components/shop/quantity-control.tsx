import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Plus, Minus } from 'lucide-react-native';
import { AppTheme } from '@/constants/app-theme';

export interface QuantityControlProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
}

export function QuantityControl({ quantity, onIncrement, onDecrement, min = 1 }: QuantityControlProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, quantity <= min && styles.buttonDisabled]}
        onPress={onDecrement}
        disabled={quantity <= min}
        activeOpacity={0.7}
      >
        <Minus size={16} color={quantity <= min ? AppTheme.colors.muted : AppTheme.colors.foreground} />
      </TouchableOpacity>
      <Text style={styles.quantity}>{quantity}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={onIncrement}
        activeOpacity={0.7}
      >
        <Plus size={16} color={AppTheme.colors.foreground} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.sm,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: AppTheme.borderRadius.sm,
    backgroundColor: AppTheme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  quantity: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
    minWidth: 32,
    textAlign: 'center',
  },
});