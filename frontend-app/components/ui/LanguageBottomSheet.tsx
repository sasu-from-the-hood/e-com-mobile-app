import { Modal, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Check } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onSelectLanguage: (code: string) => void;
}

const languages: Language[] = [
  { code: 'auto', name: 'Auto (Device)', flag: '🌐' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export function LanguageBottomSheet({ visible, onClose, selectedLanguage, onSelectLanguage }: LanguageBottomSheetProps) {
  const handleSelect = (code: string) => {
    onSelectLanguage(code);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={styles.container}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Select Language</ThemedText>
          </View>
          <FlatList
            data={languages}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.languageItem}
                onPress={() => handleSelect(item.code)}
              >
                <View style={styles.languageLeft}>
                  <ThemedText style={styles.flag}>{item.flag}</ThemedText>
                  <ThemedText style={styles.languageName}>{item.name}</ThemedText>
                </View>
                {selectedLanguage === item.code && (
                  <Check size={20} color={AppTheme.colors.primary} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: AppTheme.colors.background,
    borderTopLeftRadius: AppTheme.borderRadius.xl,
    borderTopRightRadius: AppTheme.borderRadius.xl,
    maxHeight: '60%',
  },
  header: {
    padding: AppTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  title: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
    textAlign: 'center',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: AppTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.md,
  },
  flag: {
    fontSize: 24,
  },
  languageName: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.medium,
  },
});