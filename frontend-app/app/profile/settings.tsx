import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Switch, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Globe, Shield, Bell, Trash2, Eye, EyeOff, Box } from 'lucide-react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ProfileMenuItem } from '@/components/profile/profile-menu-item';
import { AppTheme } from '@/constants/app-theme';
import { settingsStorage, SettingsTable } from '@/utils/settings-storage';
import { LanguageBottomSheet } from '@/components/ui/LanguageBottomSheet';
import { ProductViewPreferenceBottomSheet } from '@/components/ui/ProductViewPreferenceBottomSheet';
import { useTranslation } from '@/hooks/useTranslation';
import { appAuthClient } from '@/lib/app-auth-client';
import { showToast } from '@/utils/toast';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { PrimaryButton } from '@/components/onboarding/primary-button';

export default function SettingsScreen() {
  const { t, changeLanguage } = useTranslation();
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsTable>({
    faceIdEnabled: true,
    touchIdEnabled: false,
    orderUpdates: true,
    promotions: true,
    language: 'auto',
    productViewPreference: '3d',
  });
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [showProductViewSheet, setShowProductViewSheet] = useState(false);
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
  const [touchIdSupported, setTouchIdSupported] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadSettings();
    checkBiometricSupport();
  }, []);

  const loadSettings = async () => {
    const stored = await settingsStorage.getSettings();
    setSettings(stored);
  };

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    
    if (compatible && enrolled) {
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      setTouchIdSupported(supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT));
    }
  };

  const handleTouchIdToggle = async (enabled: boolean) => {
    if (enabled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable Touch ID',
      });
      
      if (result.success) {
        await settingsStorage.updateSetting('touchIdEnabled', true);
        setSettings(prev => ({ ...prev, touchIdEnabled: true }));
        showToast('success', 'Touch ID enabled successfully');
      }
    } else {
      await settingsStorage.updateSetting('touchIdEnabled', false);
      setSettings(prev => ({ ...prev, touchIdEnabled: false }));
      showToast('success', 'Touch ID disabled');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      showToast('error', 'Please enter your password');
      return;
    }

    setDeleting(true);
    try {
      await appAuthClient.deleteAccount(deletePassword);
      showToast('success', 'Account deleted successfully');
      setShowDeleteSheet(false);
      router.replace('/auth/login');
    } catch (error: any) {
      showToast('error', error.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  const updateSetting = async <K extends keyof SettingsTable>(key: K, value: SettingsTable[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (key === 'language') {
      await changeLanguage(value as string);
    } else {
      await settingsStorage.updateSetting(key, value);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>{t('settings')}</ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* General */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('general')}</ThemedText>
            <ProfileMenuItem
              title={t('language')}
              icon={<Globe size={24} color={AppTheme.colors.primary} />}
              onPress={() => setShowLanguageSheet(true)}
            />
            <ProfileMenuItem
              title="Product View Preference"
              subtitle={settings.productViewPreference === '3d' ? '3D First' : 'Images First'}
              icon={<Box size={24} color={AppTheme.colors.primary} />}
              onPress={() => setShowProductViewSheet(true)}
            />
          </View>

          {/* Security */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('security')}</ThemedText>
            {touchIdSupported && (
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Shield size={24} color={AppTheme.colors.primary} />
                  <ThemedText style={styles.settingLabel}>{t('touchId')}</ThemedText>
                </View>
                <Switch
                  value={settings.touchIdEnabled}
                  onValueChange={handleTouchIdToggle}
                  trackColor={{ false: AppTheme.colors.border, true: AppTheme.colors.primary }}
                />
              </View>
            )}
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('notifications')}</ThemedText>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Bell size={24} color={AppTheme.colors.primary} />
                <ThemedText style={styles.settingLabel}>{t('orderUpdates')}</ThemedText>
              </View>
              <Switch
                value={settings.orderUpdates}
                onValueChange={(value) => updateSetting('orderUpdates', value)}
                trackColor={{ false: AppTheme.colors.border, true: AppTheme.colors.primary }}
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Bell size={24} color={AppTheme.colors.primary} />
                <ThemedText style={styles.settingLabel}>{t('promotions')}</ThemedText>
              </View>
              <Switch
                value={settings.promotions}
                onValueChange={(value) => updateSetting('promotions', value)}
                trackColor={{ false: AppTheme.colors.border, true: AppTheme.colors.primary }}
              />
            </View>
          </View>

          {/* Account */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Account</ThemedText>
            <ProfileMenuItem
              title="Delete Account"
              subtitle="Permanently delete your account"
              icon={<Trash2 size={24} color={AppTheme.colors.destructive} />}
              onPress={() => setShowDeleteSheet(true)}
              destructive
            />
          </View>
        </View>
      </ScrollView>
      
      <LanguageBottomSheet
        visible={showLanguageSheet}
        onClose={() => setShowLanguageSheet(false)}
        selectedLanguage={settings.language}
        onSelectLanguage={(language) => updateSetting('language', language)}
      />

      <ProductViewPreferenceBottomSheet
        visible={showProductViewSheet}
        onClose={() => setShowProductViewSheet(false)}
        selectedPreference={settings.productViewPreference}
        onSelectPreference={(preference) => updateSetting('productViewPreference', preference)}
      />

      {/* Delete Account Bottom Sheet */}
      <BottomSheet
        visible={showDeleteSheet}
        onClose={() => {
          setShowDeleteSheet(false);
          setDeletePassword('');
          setShowPassword(false);
        }}
        title="Delete Account"
      >
        <View style={styles.deleteContent}>
          <ThemedText style={styles.deleteWarning}>
            This action cannot be undone. All your data will be permanently deleted.
          </ThemedText>
          
          <View style={styles.passwordContainer}>
            <ThemedText style={styles.label}>Enter your password to confirm</ThemedText>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={deletePassword}
                onChangeText={setDeletePassword}
                placeholder="Password"
                placeholderTextColor={AppTheme.colors.mutedForeground}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={20} color={AppTheme.colors.mutedForeground} />
                ) : (
                  <Eye size={20} color={AppTheme.colors.mutedForeground} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <PrimaryButton
            title="Delete Account"
            onPress={handleDeleteAccount}
            loading={deleting}
            variant="destructive"
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  header: {
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  headerTitle: {
    fontSize: AppTheme.fontSize.xxl,
    fontWeight: AppTheme.fontWeight.bold,
  },
  content: {
    padding: AppTheme.spacing.md,
  },
  section: {
    marginBottom: AppTheme.spacing.xl,
  },
  sectionTitle: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
    marginBottom: AppTheme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.background,
    borderRadius: AppTheme.borderRadius.md,
    marginBottom: AppTheme.spacing.sm,
    ...AppTheme.shadows.small,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.md,
  },
  settingLabel: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.medium,
  },
  deleteContent: {
    gap: AppTheme.spacing.lg,
  },
  deleteWarning: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.destructive,
    textAlign: 'center',
    padding: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.destructive + '10',
    borderRadius: AppTheme.borderRadius.md,
  },
  passwordContainer: {
    gap: AppTheme.spacing.sm,
  },
  label: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.medium,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.borderRadius.md,
  },
  passwordInput: {
    flex: 1,
    padding: AppTheme.spacing.md,
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.foreground,
  },
  eyeButton: {
    padding: AppTheme.spacing.md,
  },
});