import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/onboarding/primary-button';
import { TextLink } from '@/components/onboarding/text-link';
import { EthiopianPhoneInput } from '@/components/ui/ethiopian-phone-input';
import { AppTheme } from '@/constants/app-theme';
import { validateEthiopianPhone } from '@/utils/phone-validator';
import { authClient } from '@/lib/auth-client';
import { showToast } from '@/utils/toast';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    if (!validateEthiopianPhone(phoneNumber)) {
      setError('Please enter a valid Ethiopian phone number (9 digits starting with 9 or 7)');
      return;
    }

    setError('');
    setIsLoading(true);
    
    try {
      const { data, error: apiError } = await authClient.phoneNumber.requestPasswordReset({
        phoneNumber: `+251${phoneNumber}`,
      });

      if (apiError) {
        showToast('error', apiError.message || 'Failed to send verification code');
      } else {
        // Navigate to OTP verification screen
        router.push({
          pathname: '/auth/otp-verification',
          params: { 
            phoneNumber: `+251${phoneNumber}`,
            purpose: 'password_reset'
          }
        });
      }
    } catch (err) {
      showToast('error', 'Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
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
            <ThemedText style={styles.title}>Reset Password</ThemedText>
            <ThemedText style={styles.subtitle}>
              Enter your phone number to receive a verification code
            </ThemedText>
          </View>

          <View style={styles.form}>
            <EthiopianPhoneInput
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                setError('');
              }}
              error={error}
            />

            <PrimaryButton
              title={isLoading ? "Sending Code..." : "Send Code"}
              onPress={handleSendCode}
            />

            <View style={styles.loginPrompt}>
              <ThemedText style={styles.loginText}>Remember your password? </ThemedText>
              <TextLink
                title="Sign In"
                onPress={() => router.back()}
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
    marginTop: AppTheme.spacing.xl,
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