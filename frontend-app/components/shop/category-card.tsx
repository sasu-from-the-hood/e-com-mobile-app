import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';

export interface CategoryCardProps {
  title: string;
  productCount: number;
  imageUrl: string;
  imageAlt: string;
  onPress: () => void;
  variant?: 'large' | 'medium';
}

export function CategoryCard({ 
  title, 
  productCount, 
  imageUrl, 
  imageAlt,
  onPress,
  variant = 'medium'
}: CategoryCardProps) {
  const isLarge = variant === 'large';
  
  return (
    <TouchableOpacity 
      style={[styles.container, isLarge && styles.containerLarge]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        contentFit="cover"
        alt={imageAlt}
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.count}>{productCount} Product</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 160,
    borderRadius: AppTheme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: AppTheme.spacing.sm,
    position: 'relative',
  },
  containerLarge: {
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: AppTheme.spacing.lg,
  },
  title: {
    fontSize: AppTheme.fontSize.xxl,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.primaryForeground,
    marginBottom: AppTheme.spacing.xs,
  },
  count: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.primaryForeground,
    fontWeight: AppTheme.fontWeight.medium,
  },
});