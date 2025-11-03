import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastState {
  visible: boolean;
  type: ToastType;
  message: string;
  showToast: (type: ToastType, message: string) => void;
  hideToast: () => void;
}

export const useToast = create<ToastState>((set) => ({
  visible: false,
  type: 'info',
  message: '',
  showToast: (type, message) => set({ visible: true, type, message }),
  hideToast: () => set({ visible: false }),
}));