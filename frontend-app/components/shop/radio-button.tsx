import { View, StyleSheet } from 'react-native';
import { AppTheme } from '@/constants/app-theme';

export interface RadioButtonProps {
  selected: boolean;
}

export function RadioButton({ selected }: RadioButtonProps) {
  return (
    <View style={styles.outer}>
      {selected && <View style={styles.inner} />}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: AppTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AppTheme.colors.primary,
  },
});