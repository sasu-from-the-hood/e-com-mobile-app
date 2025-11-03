import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { Fingerprint } from 'lucide-react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { settingsStorage } from '@/utils/settings-storage';
import { authClient } from '@/lib/auth-client';
import { showToast } from '@/utils/toast';


interface BiometricLoginButtonsProps {
  onSuccess: () => void;
}

export function BiometricLoginButtons({ onSuccess }: BiometricLoginButtonsProps) {
  const [touchIdEnabled, setTouchIdEnabled] = useState(false);
  const [touchIdSupported, setTouchIdSupported] = useState(false);

  useEffect(() => {
    loadSettings();
    checkBiometricAvailability();
  }, []);

  const loadSettings = async () => {
    const settings = await settingsStorage.getSettings();
    setTouchIdEnabled(settings.touchIdEnabled);
  };

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    
    if (compatible && enrolled) {
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      setTouchIdSupported(supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT));
    }
  };

  const handleBiometricAuth = async () => {
    if (!touchIdEnabled) {
      showToast('warning', 'Touch ID is disabled in settings');
      return;
    }

    if (!touchIdSupported) {
      showToast('error', 'Touch ID not supported on this device');
      return;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Touch ID',
        fallbackLabel: 'Use password instead',
      });

      if (result.success) {
        try {
          await authClient.signIn.passkey();
          showToast('success', 'Touch ID authentication successful');
          onSuccess();
        } catch (error) {
          showToast('error', 'Touch ID authentication failed');
        }
      } else {
        showToast('error', 'Biometric authentication failed');
      }
    } catch (error) {
      showToast('error', 'Touch ID not registered. Please login and enable in settings');
    }
  };

  if (!touchIdEnabled || !touchIdSupported) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.button} onPress={handleBiometricAuth}>
      <Fingerprint size={24} color={AppTheme.colors.primary} />
      <ThemedText style={styles.buttonText}>Touch ID</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: AppTheme.spacing.sm,
    padding: AppTheme.spacing.md,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.borderRadius.md,
    backgroundColor: AppTheme.colors.background,
  },
  buttonText: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.medium,
  },
});