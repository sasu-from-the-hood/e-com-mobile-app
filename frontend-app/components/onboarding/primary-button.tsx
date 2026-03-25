import { TouchableOpacity, Text, StyleSheet, type ViewStyle, ActivityIndicator } from 'react-native';

export interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'destructive';
}

export function PrimaryButton({ title, onPress, style, loading, disabled, variant = 'primary' }: PrimaryButtonProps) {
  const isDisabled = loading || disabled;
  
  return (
    <TouchableOpacity
      style={[
        styles.button, 
        variant === 'destructive' && styles.buttonDestructive,
        isDisabled && styles.buttonDisabled, 
        style
      ]}
      onPress={isDisabled ? undefined : onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#5B4CCC',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#5B4CCC',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonDestructive: {
    backgroundColor: '#DC2626',
    shadowColor: '#DC2626',
  },
});