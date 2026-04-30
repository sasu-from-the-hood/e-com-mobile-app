import { View, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';

interface Review {
  id: string;
  rating: number;
  userName?: string;
  comment: string;
}

interface ProductReviewsProps {
  reviews: Review[];
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  return (
    <View style={styles.reviewsSection}>
      <ThemedText style={styles.sectionLabel}>Reviews ({reviews.length})</ThemedText>
      {reviews.slice(0, 3).map((review) => (
        <View key={review.id} style={styles.reviewItem}>
          <View style={styles.reviewHeader}>
            <View style={styles.starsContainer}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  color={AppTheme.colors.primary}
                  fill={i < review.rating ? AppTheme.colors.primary : 'transparent'}
                />
              ))}
            </View>
            <ThemedText style={styles.reviewRating}>{review.rating}/5</ThemedText>
          </View>
          {review.userName && (
            <ThemedText style={styles.reviewerName}>By {review.userName}</ThemedText>
          )}
          <ThemedText style={styles.reviewComment}>{review.comment}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  reviewsSection: {
    marginBottom: AppTheme.spacing.lg,
  },
  sectionLabel: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
    marginBottom: AppTheme.spacing.sm,
  },
  reviewItem: {
    paddingVertical: AppTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.sm,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewRating: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.primary,
  },
  reviewerName: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.semibold,
    color: AppTheme.colors.foreground,
    marginTop: 4,
  },
  reviewComment: {
    fontSize: AppTheme.fontSize.sm,
    marginTop: 4,
    color: AppTheme.colors.mutedForeground,
  },
});
