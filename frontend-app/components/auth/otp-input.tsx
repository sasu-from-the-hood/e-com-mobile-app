import { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import { AppTheme } from '@/constants/app-theme';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTinyDevice = width < 350;

// Calculate responsive input size
const getInputSize = () => {
  if (isTinyDevice) {
    return {
      width: 40,
      height: 48,
      fontSize: AppTheme.fontSize.xl,
      gap: AppTheme.spacing.xs,
    };
  } else if (isSmallDevice) {
    return {
      width: 45,
      height: 52,
      fontSize: AppTheme.fontSize.xl,
      gap: AppTheme.spacing.sm,
    };
  } else {
    return {
      width: 50,
      height: 56,
      fontSize: AppTheme.fontSize.xxl,
      gap: AppTheme.spacing.md,
    };
  }
};

const inputSize = getInputSize();

export interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
}

export function OTPInput({ length = 6, onComplete }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={ref => { inputs.current[index] = ref; }}
          style={[styles.input, digit && styles.inputFilled]}
          value={digit}
          onChangeText={text => handleChange(text.slice(-1), index)}
          onKeyPress={e => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          autoFocus={index === 0}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: inputSize.gap,
    paddingHorizontal: AppTheme.spacing.sm,
    flexWrap: 'nowrap',
  },
  input: {
    width: inputSize.width,
    height: inputSize.height,
    borderWidth: 2,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.borderRadius.md,
    textAlign: 'center',
    fontSize: inputSize.fontSize,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.foreground,
  },
  inputFilled: {
    borderColor: AppTheme.colors.primary,
    backgroundColor: AppTheme.colors.secondary,
  },
});