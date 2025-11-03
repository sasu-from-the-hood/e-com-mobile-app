import { TouchableOpacity, Text, StyleSheet, type ViewStyle } from 'react-native';

export interface TextLinkProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

export function TextLink({ title, onPress, style }: TextLinkProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={style}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#5B4CCC',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});