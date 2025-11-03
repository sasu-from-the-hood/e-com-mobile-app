import { useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { AppTheme } from '@/constants/app-theme';

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
    gap: AppTheme.spacing.md,
  },
  input: {
    width: 50,
    height: 56,
    borderWidth: 2,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.borderRadius.md,
    textAlign: 'center',
    fontSize: AppTheme.fontSize.xxl,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.foreground,
  },
  inputFilled: {
    borderColor: AppTheme.colors.primary,
    backgroundColor: AppTheme.colors.secondary,
  },
});