import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Globe, Shield, Bell, HelpCircle } from 'lucide-react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { ThemedText } from '@/components/themed-text';
import { ProfileMenuItem } from '@/components/profile/profile-menu-item';
import { AppTheme } from '@/constants/app-theme';
import { settingsStorage, SettingsTable } from '@/utils/settings-storage';
import { LanguageBottomSheet } from '@/components/ui/LanguageBottomSheet';
import { useTranslation } from '@/hooks/useTranslation';
import { authClient } from '@/lib/auth-client';

export default function SettingsScreen() {
  const { t, changeLanguage } = useTranslation();
  const [settings, setSettings] = useState<SettingsTable>({
    faceIdEnabled: true,
    touchIdEnabled: false,
    orderUpdates: true,
    promotions: true,
    language: 'auto',
  });
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [touchIdSupported, setTouchIdSupported] = useState(false);

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
        try {
          await authClient.passkey.addPasskey({ name: 'Touch ID' });
          await settingsStorage.updateSetting('touchIdEnabled', true);
          setSettings(prev => ({ ...prev, touchIdEnabled: true }));
          Alert.alert('Success', 'Touch ID enabled successfully');
        } catch (error) {
          Alert.alert('Error', 'Failed to register Touch ID');
          console.log('Registration error:', error);
        }
      }
    } else {
      try {
        const passkeysRes = await authClient.passkey.listUserPasskeys();
        if ('data' in passkeysRes && passkeysRes.data) {
          for (const pk of passkeysRes.data) {
            await authClient.passkey.deletePasskey({ id: pk.id });
          }
        }
        await settingsStorage.updateSetting('touchIdEnabled', false);
        setSettings(prev => ({ ...prev, touchIdEnabled: false }));
      } catch (error) {
        Alert.alert('Error', 'Failed to remove Touch ID');
      }
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
          {/* Language */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('general')}</ThemedText>
            <ProfileMenuItem
              title={t('language')}
              icon={<Globe size={24} color={AppTheme.colors.primary} />}
              onPress={() => setShowLanguageSheet(true)}
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

        </View>
      </ScrollView>
      
      <LanguageBottomSheet
        visible={showLanguageSheet}
        onClose={() => setShowLanguageSheet(false)}
        selectedLanguage={settings.language}
        onSelectLanguage={(language) => updateSetting('language', language)}
      />
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
});