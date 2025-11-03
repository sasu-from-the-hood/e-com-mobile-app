import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/onboarding/primary-button';
import { PasswordInput } from '@/components/auth/password-input';
import { AppTheme } from '@/constants/app-theme';
import { validatePassword } from '@/utils/validators';
import { authClient } from '@/lib/auth-client';
import { showToast } from '@/utils/toast';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    phoneNumber: string;
    otp: string;
  }>();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ newPassword: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    const newErrors = { newPassword: '', confirmPassword: '' };
    
    if (!validatePassword(newPassword)) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (!newErrors.newPassword && !newErrors.confirmPassword) {
      setIsLoading(true);
      try {
        const { data, error } = await authClient.phoneNumber.resetPassword({
          otp: params.otp,
          phoneNumber: params.phoneNumber,
          newPassword,
        });

        if (error) {
          showToast('error', error.message || 'Failed to reset password');
        } else {
          showToast('success', 'Password reset successfully!');
          router.replace('/auth/login');
        }
      } catch (err) {
        showToast('error', 'Network error. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Create New Password</ThemedText>
            <ThemedText style={styles.subtitle}>
              Please enter your new password
            </ThemedText>
          </View>

          <View style={styles.form}>
            <PasswordInput
              value={newPassword}
              onChangeText={setNewPassword}
              error={errors.newPassword}
              label="New Password"
              placeholder="Enter your new password"
            />

            <PasswordInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
              label="Confirm New Password"
              placeholder="Re-enter your new password"
            />

            <PrimaryButton
              title={isLoading ? "Resetting..." : "Reset Password"}
              onPress={handleResetPassword}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: AppTheme.spacing.lg,
    paddingTop: AppTheme.spacing.xxl,
  },
  header: {
    marginBottom: AppTheme.spacing.xxl,
  },
  title: {
    fontSize: AppTheme.fontSize.xxxl,
    fontWeight: AppTheme.fontWeight.bold,
    marginBottom: AppTheme.spacing.sm,
  },
  subtitle: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
  },
  form: {
    marginTop: AppTheme.spacing.xl,
    gap: AppTheme.spacing.lg,
  },
});