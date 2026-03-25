import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/onboarding/primary-button';
import { TextLink } from '@/components/onboarding/text-link';
import { EthiopianPhoneInput } from '@/components/ui/ethiopian-phone-input';
import { AppTheme } from '@/constants/app-theme';
import { appAuthClient } from '@/lib/app-auth-client';
import { showToast } from '@/utils/toast';
import { validateEthiopianPhone } from '@/utils/phone-validator';
import { 
  isTinyDevice, 
  getResponsivePadding, 
  getResponsiveFontSize,
} from '@/utils/responsive';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!validateEthiopianPhone(phoneNumber)) {
      showToast('error', 'Please enter a valid Ethiopian phone number (9 digits starting with 9 or 7)');
      return;
    }

    setLoading(true);
    try {
      await appAuthClient.sendResetPasswordOTP(`+251${phoneNumber}`);
      showToast('success', 'OTP sent successfully');
      router.push({
        pathname: '/auth/reset-password',
        params: { phoneNumber: `+251${phoneNumber}` },
      });
    } catch (error: any) {
      showToast('error', error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
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
            <ThemedText style={styles.title}>Forgot Password?</ThemedText>
            <ThemedText style={styles.subtitle}>
              Enter your phone number and we'll send you an OTP to reset your password
            </ThemedText>
          </View>

          <View style={styles.form}>
            <EthiopianPhoneInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              onSubmitEditing={handleSendOTP}
            />

            <PrimaryButton
              title={loading ? 'Sending...' : 'Send OTP'}
              onPress={handleSendOTP}
            />

            <TextLink
              title="Back to Login"
              onPress={() => router.back()}
              style={styles.backLink}
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
    marginBottom: AppTheme.spacing.md,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: getResponsiveFontSize(AppTheme.fontSize.base),
    color: AppTheme.colors.mutedForeground,
    textAlign: 'left',
  },
  form: {
    gap: isTinyDevice ? AppTheme.spacing.sm : AppTheme.spacing.md,
  },
  backLink: {
    alignSelf: 'center',
    marginTop: AppTheme.spacing.md,
  },
});
