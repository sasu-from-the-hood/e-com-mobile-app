import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: number;
  style?: any;
}

export function Avatar({ source, name, size = 100, style }: AvatarProps) {
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (source) {
    return (
      <Image
        source={source}
        style={[avatarStyle, style]}
        contentFit="cover"
        cachePolicy="memory-disk"
        priority="high"
      />
    );
  }

  return (
    <View style={[avatarStyle, styles.initialsContainer, style]}>
      <ThemedText style={[styles.initials, { fontSize: size * 0.4 }]}>
        {getInitials(name)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  initialsContainer: {
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: AppTheme.colors.primaryForeground,
    fontWeight: AppTheme.fontWeight.bold,
  },
});