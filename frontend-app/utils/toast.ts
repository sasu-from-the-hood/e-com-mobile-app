import { useToast } from '@/hooks/useToast';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export const showToast = (type: ToastType, message: string) => {
  useToast.getState().showToast(type, message);
};