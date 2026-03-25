import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/onboarding/primary-button';
import { AppTheme } from '@/constants/app-theme';

export default function BannedScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <ThemedText style={styles.icon}>🚫</ThemedText>
        </View>
        
        <ThemedText style={styles.title}>Account Suspended</ThemedText>
        
        <ThemedText style={styles.message}>
          Your account has been suspended due to a violation of our terms of service.
        </ThemedText>
        
        <ThemedText style={styles.submessage}>
          If you believe this is a mistake, please contact our support team for assistance.
        </ThemedText>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Contact Support"
            onPress={() => {
              // Navigate to help/support
              router.push('/profile/help-support');
            }}
          />
          
          <PrimaryButton
            title="Back to Login"
            onPress={() => router.replace('/auth/login')}
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
    paddingHorizontal: AppTheme.spacing.xl,
    paddingTop: AppTheme.spacing.xxl * 2,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: AppTheme.spacing.xl,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: AppTheme.fontSize.xxxl,
    fontWeight: AppTheme.fontWeight.bold,
    marginBottom: AppTheme.spacing.lg,
    textAlign: 'center',
    color: AppTheme.colors.destructive,
  },
  message: {
    fontSize: AppTheme.fontSize.lg,
    color: AppTheme.colors.foreground,
    textAlign: 'center',
    marginBottom: AppTheme.spacing.md,
    lineHeight: 24,
  },
  submessage: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
    textAlign: 'center',
    marginBottom: AppTheme.spacing.xxl,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    gap: AppTheme.spacing.md,
  },
});
