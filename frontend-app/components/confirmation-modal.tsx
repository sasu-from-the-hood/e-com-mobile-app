import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { AlertTriangle } from 'lucide-react-native';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  type?: 'warning' | 'danger' | 'info';
  showCancel?: boolean;
}

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning',
  showCancel = true,
}: ConfirmationModalProps) {
  const iconColor = type === 'danger' ? AppTheme.colors.error : 
                    type === 'warning' ? '#ff9800' : 
                    AppTheme.colors.primary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={showCancel ? onCancel : undefined}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              <View style={styles.iconContainer}>
                <AlertTriangle size={48} color={iconColor} />
              </View>
              
              <ThemedText style={styles.title}>{title}</ThemedText>
              <ThemedText style={styles.message}>{message}</ThemedText>
              
              <View style={[styles.buttons, !showCancel && styles.buttonsSingle]}>
                {showCancel && (
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={onCancel}
                  >
                    <ThemedText style={styles.cancelButtonText}>{cancelText}</ThemedText>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={onConfirm}
                >
                  <ThemedText style={styles.confirmButtonText}>{confirmText}</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
    backgroundColor: AppTheme.colors.card,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: AppTheme.spacing.md,
  },
  title: {
    fontSize: AppTheme.fontSize.xl,
    fontWeight: AppTheme.fontWeight.bold,
    marginBottom: AppTheme.spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: AppTheme.fontSize.md,
    color: AppTheme.colors.mutedForeground,
    textAlign: 'center',
    marginBottom: AppTheme.spacing.xl,
    lineHeight: 22,
  },
  buttons: {
    flexDirection: 'row',
    gap: AppTheme.spacing.md,
    width: '100%',
  },
  buttonsSingle: {
    justifyContent: 'center',
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
  cancelButtonText: {
    fontSize: AppTheme.fontSize.md,
    fontWeight: AppTheme.fontWeight.semibold,
    color: AppTheme.colors.foreground,
  },
  confirmButton: {
    backgroundColor: AppTheme.colors.primary,
  },
  confirmButtonText: {
    fontSize: AppTheme.fontSize.md,
    fontWeight: AppTheme.fontWeight.semibold,
    color: '#fff',
  },
});
