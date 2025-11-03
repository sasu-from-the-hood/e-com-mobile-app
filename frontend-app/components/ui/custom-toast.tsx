import { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface CustomToastProps {
  type: ToastType;
  message: string;
  visible: boolean;
  onHide: () => void;
}

const { width } = Dimensions.get('window');

export function CustomToast({ type, message, visible, onHide }: CustomToastProps) {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
      
      const timer = setTimeout(() => {
        translateY.value = withTiming(100, { duration: 300 });
        opacity.value = withSequence(
          withTiming(0, { duration: 300 }),
          withTiming(0, { duration: 0 }, () => runOnJS(onHide)())
        );
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} color="white" />;
      case 'error':
        return <XCircle size={24} color="white" />;
      case 'warning':
        return <AlertCircle size={24} color="white" />;
      case 'info':
        return <Info size={24} color="white" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#10B981';
      case 'error':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'info':
        return '#3B82F6';
    }
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={[styles.toast, { backgroundColor: getBackgroundColor() }]}>
        {getIcon()}
        <ThemedText style={styles.message}>{message}</ThemedText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: AppTheme.spacing.md,
    right: AppTheme.spacing.md,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.lg,
    paddingVertical: AppTheme.spacing.md,
    borderRadius: AppTheme.borderRadius.lg,
    gap: AppTheme.spacing.sm,
    ...AppTheme.shadows.large,
  },
  message: {
    flex: 1,
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.medium,
    color: 'white',
  },
});