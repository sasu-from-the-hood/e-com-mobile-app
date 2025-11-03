import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/onboarding/primary-button';
import { TextLink } from '@/components/onboarding/text-link';
import { OTPInput } from '@/components/auth/otp-input';
import { AppTheme } from '@/constants/app-theme';
import { formatPhoneNumber } from '@/utils/auth-formatters';
import { authClient } from '@/lib/auth-client';
import type { OTPPurpose } from '@/types/auth.types';
import { showToast } from '@/utils/toast';

export default function OTPVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    phoneNumber: string;
    password?: string;
    purpose: OTPPurpose;
  }>();
  
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerifyOTP = async (code: string) => {
    setIsLoading(true);
    try {
      if (params.purpose === 'signup') {
        // Verify phone number for signup
        const { data, error } = await authClient.phoneNumber.verify({
          phoneNumber: params.phoneNumber,
          code,
          disableSession: false,
          updatePhoneNumber: false,
        });

        if (error) {
          if (error.message?.includes('Too many attempts')) {
            showToast('error', 'Please request a new verification code');
          } else {
            showToast('error', error.message || 'Invalid verification code');
          }
        } else if (data) {
          showToast('success', 'Account created successfully!');
          router.replace('/shop/shop-home');
        }
      } else if (params.purpose === 'password_reset') {
        // For password reset, navigate to reset password screen with OTP
        router.push({
          pathname: '/auth/reset-password',
          params: {
            phoneNumber: params.phoneNumber,
            otp: code,
          }
        });
      }
    } catch (err) {
      showToast('error', 'Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    try {
      const { error } = await authClient.phoneNumber.sendOtp({
        phoneNumber: params.phoneNumber,
      });

      if (error) {
        showToast('error', error.message || 'Failed to resend code');
      } else {
        showToast('success', 'Verification code sent!');
        setCanResend(false);
        setCountdown(60);
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
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Verify Phone Number</ThemedText>
          <ThemedText style={styles.subtitle}>
            We've sent a verification code to
          </ThemedText>
          <ThemedText style={styles.phoneNumber}>
            {formatPhoneNumber(params.phoneNumber)}
          </ThemedText>
        </View>

        <View style={styles.form}>
          <View style={styles.otpSection}>
            <ThemedText style={styles.label}>Enter verification code</ThemedText>
            <OTPInput
              length={6}
              onComplete={handleVerifyOTP}
            />
          </View>

          <View style={styles.resendSection}>
            <ThemedText style={styles.resendText}>Didn't receive code? </ThemedText>
            {canResend ? (
              <TextLink
                title="Resend Code"
                onPress={handleResendCode}
              />
            ) : (
              <ThemedText style={styles.countdown}>
                Resend in {countdown}s
              </ThemedText>
            )}
          </View>

          <PrimaryButton
            title={isLoading ? "Verifying..." : "Verify"}
            onPress={() => {}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  content: {
    flex: 1,
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
    marginBottom: AppTheme.spacing.xs,
  },
  phoneNumber: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.semibold,
    color: AppTheme.colors.primary,
  },
  form: {
    marginTop: AppTheme.spacing.xl,
    gap: AppTheme.spacing.xl,
  },
  otpSection: {
    gap: AppTheme.spacing.md,
  },
  label: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.medium,
    textAlign: 'center',
  },
  resendSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
  },
  countdown: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
    fontWeight: AppTheme.fontWeight.medium,
  },
});