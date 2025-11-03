import { View, TextInput, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';

export interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
}

export function PhoneInput({ 
  value, 
  onChangeText, 
  error, 
  label = 'Phone Number',
  placeholder = 'Enter your phone number'
}: PhoneInputProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={AppTheme.colors.mutedForeground}
        keyboardType="phone-pad"
        autoCapitalize="none"
      />
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: AppTheme.spacing.sm,
  },
  label: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.medium,
  },
  input: {
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.borderRadius.md,
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.md,
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.foreground,
  },
  inputError: {
    borderColor: AppTheme.colors.error,
  },
  errorText: {
    fontSize: AppTheme.fontSize.xs,
    color: AppTheme.colors.error,
  },
});