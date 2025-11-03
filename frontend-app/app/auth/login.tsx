import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/onboarding/primary-button';
import { TextLink } from '@/components/onboarding/text-link';
import { BiometricLoginButtons } from '@/components/auth/biometric-login-buttons';
import { EthiopianPhoneInput } from '@/components/ui/ethiopian-phone-input';
import { PasswordInput } from '@/components/auth/password-input';
import { AppTheme } from '@/constants/app-theme';
import { validateEthiopianPhone } from '@/utils/phone-validator';
import { validatePassword } from '@/utils/validators';
import { authClient } from '@/lib/auth-client';
import { showToast } from '@/utils/toast';

export default function LoginScreen() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ phoneNumber: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    const newErrors = { phoneNumber: '', password: '' };
    
    if (!validateEthiopianPhone(phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid Ethiopian phone number (9 digits starting with 9 or 7)';
    }
    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);

    if (!newErrors.phoneNumber && !newErrors.password) {
      setIsLoading(true);
      try {
        const { data, error } = await authClient.signIn.phoneNumber({
          phoneNumber: `+251${phoneNumber}`,
          password,
          rememberMe: true,
        });

        if (error) {
          if (error.message?.includes('PHONE_NUMBER_NOT_VERIFIED')) {
            showToast('warning', 'Please verify your phone number first');
            router.push({
              pathname: '/auth/otp-verification',
              params: { phoneNumber: `+251${phoneNumber}`, purpose: 'signup' }
            });
          } else {
            showToast('error', error.message || 'Invalid phone number or password');
          }
        } else if (data) {
          await checkAuth(); // Update auth state
          router.replace('/shop/shop-home');
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
            <ThemedText style={styles.title}>Login Account</ThemedText>
            <ThemedText style={styles.subtitle}>Welcome back! Please login to continue</ThemedText>
          </View>

          <View style={styles.form}>
            <EthiopianPhoneInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              error={errors.phoneNumber}
              onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <PasswordInput
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              returnKeyType="go"
              onSubmitEditing={handleLogin}
            />

            <TextLink
              title="Forgot Password?"
              onPress={() => router.push('/auth/forgot-password')}
              style={styles.forgotPassword}
            />

            <PrimaryButton
              title={isLoading ? "Signing In..." : "Sign In"}
              onPress={handleLogin}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <ThemedText style={styles.dividerText}>Or continue with</ThemedText>
              <View style={styles.dividerLine} />
            </View>

            <BiometricLoginButtons
              onSuccess={() => router.replace('/shop/shop-home')}
            />

            <View style={styles.signupPrompt}>
              <ThemedText style={styles.signupText}>Don't have an account? </ThemedText>
              <TextLink
                title="Sign Up"
                onPress={() => router.push('/auth/signup')}
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
    marginBottom: AppTheme.spacing.md,
  },
  subtitle: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
  },
  form: {
    gap: AppTheme.spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.md,
    marginVertical: AppTheme.spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: AppTheme.colors.border,
  },
  dividerText: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
  },
  signupPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
  },
});