import { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';

interface EthiopianPhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  onSubmitEditing?: () => void;
}

export function EthiopianPhoneInput({
  value,
  onChangeText,
  error,
  label = 'Phone Number',
  placeholder = '9|7 XXX-XXX-XX',
  onSubmitEditing
}: EthiopianPhoneInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const digits = text.replace(/\D/g, '');
    
    // Limit to 9 digits
    const limited = digits.slice(0, 9);
    
    // Format as XXX XXX XXX
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `${limited.slice(0, 3)} ${limited.slice(3)}`;
    } else {
      return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
    }
  };

  const handleTextChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    const rawNumber = formatted.replace(/\s/g, '');
    
    // Only allow numbers starting with 9 or 7
    if (rawNumber.length > 0 && !rawNumber.startsWith('9') && !rawNumber.startsWith('7')) {
      return;
    }
    
    onChangeText(rawNumber);
  };

  const getFullPhoneNumber = () => {
    return value ? `+251${value}` : '';
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View style={[
        styles.inputContainer,
        error && styles.inputContainerError
      ]}>
        <View style={styles.countryCode}>
          <ThemedText style={styles.countryCodeText}>🇪🇹 +251</ThemedText>
        </View>
        <TextInput
          style={styles.input}
          value={formatPhoneNumber(value)}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={AppTheme.colors.mutedForeground}
          keyboardType="phone-pad"
          maxLength={11} // 9 digits + 2 spaces
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="next"
          onSubmitEditing={onSubmitEditing}
        />
      </View>
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
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
    color: AppTheme.colors.foreground,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.borderRadius.md,
    backgroundColor: AppTheme.colors.background,
  },
  inputContainerError: {
    borderColor: AppTheme.colors.error,
  },
  countryCode: {
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.md,
    borderRightWidth: 1,
    borderRightColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.secondary,
  },
  countryCodeText: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.medium,
    color: AppTheme.colors.foreground,
  },
  input: {
    flex: 1,
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.md,
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.foreground,
  },
  errorText: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.error,
  },
  fullNumber: {
    fontSize: AppTheme.fontSize.xs,
    color: AppTheme.colors.mutedForeground,
    fontStyle: 'italic',
  },
});