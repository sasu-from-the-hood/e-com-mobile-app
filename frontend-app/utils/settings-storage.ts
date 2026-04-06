import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SettingsTable {
  faceIdEnabled: boolean;
  touchIdEnabled: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  language: string;
  productViewPreference: '3d' | 'image';
}

const SETTINGS_KEY = 'app_settings';

const defaultSettings: SettingsTable = {
  faceIdEnabled: true,
  touchIdEnabled: false,
  orderUpdates: true,
  promotions: true,
  language: 'auto',
  productViewPreference: '3d',
};

export const settingsStorage = {
  // Get all settings as table
  async getSettings(): Promise<SettingsTable> {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  },

  // Update specific setting
  async updateSetting<K extends keyof SettingsTable>(key: K, value: SettingsTable[K]): Promise<void> {
    try {
      const current = await this.getSettings();
      const updated = { ...current, [key]: value };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to update setting:', error);
    }
  },

  // Get specific setting
  async getSetting<K extends keyof SettingsTable>(key: K): Promise<SettingsTable[K]> {
    const settings = await this.getSettings();
    return settings[key];
  },
};