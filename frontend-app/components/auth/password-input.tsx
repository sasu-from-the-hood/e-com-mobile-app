import { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';

export interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  onSubmitEditing?: () => void;
  returnKeyType?: 'done' | 'next' | 'go';
}

export function PasswordInput({ 
  value, 
  onChangeText, 
  error, 
  label = 'Password',
  placeholder = 'Enter your password',
  onSubmitEditing,
  returnKeyType = 'done'
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={AppTheme.colors.mutedForeground}
          secureTextEntry={!showPassword}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
          activeOpacity={0.7}
        >
          {showPassword ? (
            <EyeOff size={20} color={AppTheme.colors.mutedForeground} />
          ) : (
            <Eye size={20} color={AppTheme.colors.mutedForeground} />
          )}
        </TouchableOpacity>
      </View>
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
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.borderRadius.md,
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.md,
    paddingRight: 48,
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.foreground,
  },
  inputError: {
    borderColor: AppTheme.colors.error,
  },
  eyeButton: {
    position: 'absolute',
    right: AppTheme.spacing.md,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  errorText: {
    fontSize: AppTheme.fontSize.xs,
    color: AppTheme.colors.error,
  },
});