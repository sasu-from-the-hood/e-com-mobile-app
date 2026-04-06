import { Modal, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Check, Box, Image } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';

interface ViewPreference {
  code: '3d' | 'image';
  name: string;
  description: string;
  icon: 'box' | 'image';
}

interface ProductViewPreferenceBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedPreference: '3d' | 'image';
  onSelectPreference: (code: '3d' | 'image') => void;
}

const preferences: ViewPreference[] = [
  { 
    code: '3d', 
    name: '3D First', 
    description: 'Show 3D models by default when available',
    icon: 'box'
  },
  { 
    code: 'image', 
    name: 'Images First', 
    description: 'Show product images by default',
    icon: 'image'
  },
];

export function ProductViewPreferenceBottomSheet({ 
  visible, 
  onClose, 
  selectedPreference, 
  onSelectPreference 
}: ProductViewPreferenceBottomSheetProps) {
  const handleSelect = (code: '3d' | 'image') => {
    onSelectPreference(code);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={styles.container}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Product View Preference</ThemedText>
            <ThemedText style={styles.subtitle}>Choose what to show first on product cards</ThemedText>
          </View>
          <FlatList
            data={preferences}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.preferenceItem}
                onPress={() => handleSelect(item.code)}
              >
                <View style={styles.preferenceLeft}>
                  <View style={[
                    styles.iconContainer,
                    selectedPreference === item.code && styles.iconContainerActive
                  ]}>
                    {item.icon === 'box' ? (
                      <Box size={24} color={selectedPreference === item.code ? '#fff' : AppTheme.colors.foreground} />
                    ) : (
                      <Image size={24} color={selectedPreference === item.code ? '#fff' : AppTheme.colors.foreground} />
                    )}
                  </View>
                  <View style={styles.textContainer}>
                    <ThemedText style={styles.preferenceName}>{item.name}</ThemedText>
                    <ThemedText style={styles.preferenceDescription}>{item.description}</ThemedText>
                  </View>
                </View>
                {selectedPreference === item.code && (
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
    marginBottom: AppTheme.spacing.xs,
  },
  subtitle: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
    textAlign: 'center',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: AppTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.md,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: AppTheme.borderRadius.md,
    backgroundColor: AppTheme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerActive: {
    backgroundColor: AppTheme.colors.primary,
  },
  textContainer: {
    flex: 1,
  },
  preferenceName: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.medium,
    marginBottom: 2,
  },
  preferenceDescription: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
  },
});
