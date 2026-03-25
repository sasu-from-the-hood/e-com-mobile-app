import { toast } from 'sonner-native';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export const showToast = (type: ToastType, message: string) => {
  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'error':
      toast.error(message);
      break;
    case 'warning':
      toast.warning(message);
      break;
    case 'info':
    default:
      toast(message);
      break;
  }
};
