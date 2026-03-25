import { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/onboarding/primary-button';
import { TextLink } from '@/components/onboarding/text-link';
import { OTPInput } from '@/components/auth/otp-input';
import { AppTheme } from '@/constants/app-theme';
import { formatPhoneNumber } from '@/utils/auth-formatters';
import { appAuthClient } from '@/lib/app-auth-client';
import type { OTPPurpose } from '@/types/auth.types';
import { showToast } from '@/utils/toast';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isLargeDevice = width >= 768;

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
        // Verify OTP and complete registration
        await appAuthClient.verifyRegisterOTP(
          params.phoneNumber,
          code,
          params.password || '',
          params.phoneNumber // Use phone as default name
        );
        
        showToast('success', 'Account created successfully!');
        router.replace('/shop/shop-home');
      } else if (params.purpose === 'password_reset') {
        // Verify OTP for password reset
        await appAuthClient.verifyResetPasswordOTP(params.phoneNumber, code);
        
        // Navigate to reset password screen
        router.push({
          pathname: '/auth/reset-password',
          params: {
            phoneNumber: params.phoneNumber,
            otp: code,
          }
        });
      }
    } catch (err: any) {
      showToast('error', err.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    try {
      if (params.purpose === 'signup') {
        await appAuthClient.resendRegisterOTP(params.phoneNumber);
      } else if (params.purpose === 'password_reset') {
        await appAuthClient.resendResetPasswordOTP(params.phoneNumber);
      }
      
      showToast('success', 'Verification code sent!');
      setCanResend(false);
      setCountdown(60);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to resend code');
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
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
  },
  content: {
    flex: 1,
    paddingHorizontal: isLargeDevice ? width * 0.15 : isSmallDevice ? AppTheme.spacing.md : AppTheme.spacing.lg,
    paddingVertical: isSmallDevice ? AppTheme.spacing.lg : AppTheme.spacing.xxl,
    width: '100%',
  },
  header: {
    marginBottom: isSmallDevice ? AppTheme.spacing.lg : AppTheme.spacing.xxl,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: isSmallDevice ? AppTheme.fontSize.xxl : isLargeDevice ? 36 : AppTheme.fontSize.xxxl,
    fontWeight: AppTheme.fontWeight.bold,
    marginBottom: AppTheme.spacing.sm,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: isSmallDevice ? AppTheme.fontSize.sm : AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
    marginBottom: AppTheme.spacing.xs,
    textAlign: 'left',
  },
  phoneNumber: {
    fontSize: isSmallDevice ? AppTheme.fontSize.base : AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.semibold,
    color: AppTheme.colors.primary,
    textAlign: 'center',
  },
  form: {
    marginTop: isSmallDevice ? AppTheme.spacing.md : AppTheme.spacing.xl,
    gap: isSmallDevice ? AppTheme.spacing.lg : AppTheme.spacing.xl,
  },
  otpSection: {
    gap: AppTheme.spacing.md,
    alignItems: 'center',
  },
  label: {
    fontSize: isSmallDevice ? AppTheme.fontSize.xs : AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.medium,
    textAlign: 'center',
    color: AppTheme.colors.foreground,
  },
  resendSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: AppTheme.spacing.md,
  },
  resendText: {
    fontSize: isSmallDevice ? AppTheme.fontSize.sm : AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
  },
  countdown: {
    fontSize: isSmallDevice ? AppTheme.fontSize.sm : AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
    fontWeight: AppTheme.fontWeight.medium,
  },
});