import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AppTheme } from '@/constants/app-theme';

export interface CategoryChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export function CategoryChip({ label, isActive, onPress }: CategoryChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, isActive && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, isActive && styles.textActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.full,
    backgroundColor: AppTheme.colors.secondary,
    marginRight: AppTheme.spacing.sm,
  },
  chipActive: {
    backgroundColor: AppTheme.colors.primary,
  },
  text: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.medium,
    color: AppTheme.colors.foreground,
  },
  textActive: {
    color: AppTheme.colors.primaryForeground,
  },
});