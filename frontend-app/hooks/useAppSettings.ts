import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppSettings {
  app_name?: string;
  contact_email?: string;
  contact_phone?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  about_us?: string;
  terms_conditions?: string;
  privacy_policy?: string;
  return_policy?: string;
  shipping_info?: string;
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const cached = await AsyncStorage.getItem('app_settings');
      if (cached) {
        setSettings(JSON.parse(cached));
      }
    } catch (error) {
      console.error('Failed to load app settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSetting = (key: keyof AppSettings, defaultValue: string = '') => {
    return settings[key] || defaultValue;
  };

  return {
    settings,
    isLoading,
    getSetting,
    appName: getSetting('app_name', 'E-Commerce'),
    contactEmail: getSetting('contact_email'),
    contactPhone: getSetting('contact_phone'),
    facebookUrl: getSetting('facebook_url'),
    instagramUrl: getSetting('instagram_url'),
    twitterUrl: getSetting('twitter_url'),
    aboutUs: getSetting('about_us'),
    termsConditions: getSetting('terms_conditions'),
    privacyPolicy: getSetting('privacy_policy'),
    returnPolicy: getSetting('return_policy'),
    shippingInfo: getSetting('shipping_info'),
  };
}
