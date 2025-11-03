import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { RadioButton } from './radio-button';
import { AppTheme } from '@/constants/app-theme';
import type { PaymentMethodData } from '@/types/schema';

export interface PaymentCardProps {
  payment: PaymentMethodData;
  selected: boolean;
  onSelect: () => void;
}

export function PaymentCard({ payment, selected, onSelect }: PaymentCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.containerSelected]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <RadioButton selected={selected} />
      <View style={styles.content}>
        <ThemedText style={styles.type}>{payment.type}</ThemedText>
        <ThemedText style={styles.cardNumber}>{payment.cardNumber}</ThemedText>
        <ThemedText style={styles.expiry}>Exp: {payment.expiryDate}</ThemedText>
      </View>
    </TouchableOpacity>
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
  },
  containerSelected: {
    borderColor: AppTheme.colors.primary,
    backgroundColor: AppTheme.colors.secondary,
  },
  content: {
    flex: 1,
    marginLeft: AppTheme.spacing.md,
  },
  type: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.foreground,
    marginBottom: 2,
  },
  expiry: {
    fontSize: AppTheme.fontSize.xs,
    color: AppTheme.colors.mutedForeground,
  },
});