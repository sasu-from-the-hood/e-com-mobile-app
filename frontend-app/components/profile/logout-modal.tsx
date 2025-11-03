import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';

export interface LogoutModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutModal({ visible, onConfirm, onCancel }: LogoutModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ThemedText style={styles.title}>Logout</ThemedText>
          <ThemedText style={styles.message}>
            Are you sure you want to logout?
          </ThemedText>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.cancelText}>No</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.confirmText}>Yes</ThemedText>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: AppTheme.spacing.lg,
  },
  modal: {
    backgroundColor: AppTheme.colors.background,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.lg,
    width: '100%',
    maxWidth: 400,
    ...AppTheme.shadows.large,
  },
  title: {
    fontSize: AppTheme.fontSize.xl,
    fontWeight: AppTheme.fontWeight.bold,
    marginBottom: AppTheme.spacing.md,
  },
  message: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
    marginBottom: AppTheme.spacing.xl,
  },
  buttons: {
    flexDirection: 'row',
    gap: AppTheme.spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: AppTheme.spacing.md,
    borderRadius: AppTheme.borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: AppTheme.colors.secondary,
  },
  confirmButton: {
    backgroundColor: AppTheme.colors.primary,
  },
  cancelText: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
    color: AppTheme.colors.foreground,
  },
  confirmText: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
    color: AppTheme.colors.primaryForeground,
  },
});