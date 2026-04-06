import { useState, useEffect } from 'react';
import { getLocales } from 'expo-localization';
import { translations } from '@/locales/translations';
import { settingsStorage } from '@/utils/settings-storage';

type Language = keyof typeof translations;

export function useTranslation() {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const savedLang = await settingsStorage.getSetting('language');
    if (savedLang && savedLang !== 'auto') {
      setLanguage(savedLang as Language);
    } else {
      // Auto-detect device language
      const deviceLocales = getLocales();
      const deviceLang = deviceLocales[0]?.languageCode || 'en';
      const supportedLang = translations[deviceLang as Language] ? deviceLang : 'en';
      setLanguage(supportedLang as Language);
    }
  };

  const t = (key: keyof typeof translations.en): string => {
    const translation = translations[language]?.[key] || translations.en[key] || key;
    return typeof translation === 'string' ? translation : String(key);
  };

  const changeLanguage = async (lang: string) => {
    await settingsStorage.updateSetting('language', lang);
    if (lang === 'auto') {
      const deviceLocales = getLocales();
      const deviceLang = deviceLocales[0]?.languageCode || 'en';
      const supportedLang = translations[deviceLang as Language] ? deviceLang : 'en';
      setLanguage(supportedLang as Language);
    } else {
      setLanguage(lang as Language);
    }
  };

  return { t, changeLanguage, currentLanguage: language };
}