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
import { appAuthClient } from '@/lib/app-auth-client';
import { showToast } from '@/utils/toast';
import { 
  isTinyDevice, 
  getResponsivePadding, 
  getResponsiveFontSize,
} from '@/utils/responsive';

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
        console.log('[ResetPassword] Resetting password for:', params.phoneNumber);
        await appAuthClient.resetPassword(
          params.phoneNumber,
          params.otp,
          newPassword
        );
        console.log('[ResetPassword] Password reset successful');
        
        showToast('success', 'Password reset successfully!');
        router.replace('/auth/login');
      } catch (err: any) {
        console.error('[ResetPassword] Failed to reset password:', err);
        console.error('[ResetPassword] Error message:', err.message);
        showToast('error', err.message || 'Failed to reset password');
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
    flexGrow: 1,
    paddingHorizontal: getResponsivePadding(),
    paddingTop: isTinyDevice ? AppTheme.spacing.lg : AppTheme.spacing.xxl,
    paddingBottom: AppTheme.spacing.xl,
    width: '100%',
  },
  header: {
    marginBottom: isTinyDevice ? AppTheme.spacing.lg : AppTheme.spacing.xxl,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: getResponsiveFontSize(AppTheme.fontSize.xxxl),
    fontWeight: AppTheme.fontWeight.bold,
    marginBottom: AppTheme.spacing.sm,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: getResponsiveFontSize(AppTheme.fontSize.base),
    color: AppTheme.colors.mutedForeground,
    textAlign: 'left',
  },
  form: {
    marginTop: isTinyDevice ? AppTheme.spacing.md : AppTheme.spacing.xl,
    gap: isTinyDevice ? AppTheme.spacing.md : AppTheme.spacing.lg,
  },
});