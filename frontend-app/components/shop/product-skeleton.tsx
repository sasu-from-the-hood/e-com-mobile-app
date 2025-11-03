import { View, StyleSheet } from 'react-native';
import { AppTheme } from '@/constants/app-theme';

export function ProductSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.imageSkeleton} />
      <View style={styles.infoContainer}>
        <View style={styles.nameSkeleton} />
        <View style={styles.priceSkeleton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: AppTheme.spacing.md,
  },
  imageSkeleton: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: AppTheme.borderRadius.md,
    backgroundColor: AppTheme.colors.secondary,
  },
  infoContainer: {
    marginTop: AppTheme.spacing.sm,
  },
  nameSkeleton: {
    height: 16,
    backgroundColor: AppTheme.colors.secondary,
    borderRadius: 4,
    marginBottom: 8,
    width: '80%',
  },
  priceSkeleton: {
    height: 18,
    backgroundColor: AppTheme.colors.secondary,
    borderRadius: 4,
    width: '50%',
  },
});