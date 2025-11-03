import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { RadioButton } from './radio-button';
import { AppTheme } from '@/constants/app-theme';
import type { AddressForm } from '@/types/schema';

export interface AddressCardProps {
  address: AddressForm;
  selected: boolean;
  onSelect: () => void;
}

export function AddressCard({ address, selected, onSelect }: AddressCardProps) {
  const fullAddress = `${address.addressLine1}${address.addressLine2 ? ', ' + address.addressLine2 : ''}, ${address.city}, ${address.state} ${address.zipCode}`;
  
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.containerSelected]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <RadioButton selected={selected} />
      <View style={styles.content}>
        <ThemedText style={styles.name}>{address.fullName}</ThemedText>
        <ThemedText style={styles.address}>{fullAddress}</ThemedText>
        {address.phone && <ThemedText style={styles.phone}>{ "+251" +address.phone}</ThemedText>}
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
  name: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
    marginBottom: 4,
  },
  address: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
    lineHeight: 20,
  },
  phone: {
    fontSize: AppTheme.fontSize.xs,
    color: AppTheme.colors.mutedForeground,
    marginTop: 4,
  },
});