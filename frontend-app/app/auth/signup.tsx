import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/onboarding/primary-button';
import { TextLink } from '@/components/onboarding/text-link';
import { EthiopianPhoneInput } from '@/components/ui/ethiopian-phone-input';
import { PasswordInput } from '@/components/auth/password-input';
import { AppTheme } from '@/constants/app-theme';
import { validateEthiopianPhone } from '@/utils/phone-validator';
import { validatePassword } from '@/utils/validators';
import { authClient } from '@/lib/auth-client';
import { showToast } from '@/utils/toast';

export default function SignupScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ 
    phoneNumber: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    const newErrors = { phoneNumber: '', password: '', confirmPassword: '' };
    
    if (!validateEthiopianPhone(phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid Ethiopian phone number (9 digits starting with 9 or 7)';
    }
    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (!newErrors.phoneNumber && !newErrors.password && !newErrors.confirmPassword) {
      setIsLoading(true);
      try {
        // Send OTP to phone number
        const { data, error } = await authClient.phoneNumber.sendOtp({
          phoneNumber: `+251${phoneNumber}`,
        });

        if (error) {
          showToast('error', error.message || 'Failed to send verification code');
        } else {
          // Navigate to OTP verification screen
          router.push({
            pathname: '/auth/otp-verification',
            params: { 
              phoneNumber: `+251${phoneNumber}`, 
              password,
              purpose: 'signup' 
            }
          });
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
            <ThemedText style={styles.title}>Create Account</ThemedText>
            <ThemedText style={styles.subtitle}>Join us today! Please fill in the details</ThemedText>
          </View>

          <View style={styles.form}>
            <EthiopianPhoneInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              error={errors.phoneNumber}
            />

            <PasswordInput
              value={password}
              onChangeText={setPassword}
              error={errors.password}
            />

            <PasswordInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
              label="Confirm Password"
              placeholder="Re-enter your password"
            />

            <PrimaryButton
              title={isLoading ? "Creating Account..." : "Sign Up"}
              onPress={handleSignup}
            />

            <View style={styles.loginPrompt}>
              <ThemedText style={styles.loginText}>Already have an account? </ThemedText>
              <TextLink
                title="Sign In"
                onPress={() => router.push('/auth/login')}
              />
            </View>
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
    gap: AppTheme.spacing.lg,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
  },
});