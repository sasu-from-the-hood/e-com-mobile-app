import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';

interface ImagePickerBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
}

export function ImagePickerBottomSheet({ visible, onClose, onCamera, onGallery }: ImagePickerBottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={styles.container}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Select Image</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={AppTheme.colors.mutedForeground} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.options}>
            <TouchableOpacity style={styles.option} onPress={onCamera}>
              <Camera size={24} color={AppTheme.colors.primary} />
              <ThemedText style={styles.optionText}>Camera</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.option} onPress={onGallery}>
              <ImageIcon size={24} color={AppTheme.colors.primary} />
              <ThemedText style={styles.optionText}>Gallery</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    flex: 1,
  },
  container: {
    backgroundColor: AppTheme.colors.background,
    borderTopLeftRadius: AppTheme.borderRadius.xl,
    borderTopRightRadius: AppTheme.borderRadius.xl,
    paddingBottom: 34,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: AppTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  title: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppTheme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  options: {
    padding: AppTheme.spacing.lg,
    gap: AppTheme.spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: AppTheme.spacing.lg,
    backgroundColor: AppTheme.colors.secondary,
    borderRadius: AppTheme.borderRadius.md,
    gap: AppTheme.spacing.md,
  },
  optionText: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.medium,
  },
});