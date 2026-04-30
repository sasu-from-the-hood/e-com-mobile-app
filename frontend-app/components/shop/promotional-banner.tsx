import { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { useBanners } from '@/hooks/useBanners';
import { authConfig } from '@/config/auth.config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - AppTheme.spacing.md * 2;

// Cycle through gradient pairs per banner slot
const GRADIENTS: [string, string][] = [
  ['#5B4CCC', '#8B7FE8'],
  ['#2D1B8E', '#5B4CCC'],
  ['#7C3AED', '#4C3AB0'],
];

interface PromotionalBannerProps {
  onBannerPress?: (productId: string) => void;
  onRefresh?: () => Promise<void>; // Add refresh callback
}

export function PromotionalBanner({ onBannerPress, onRefresh }: PromotionalBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { banners: backendBanners } = useBanners();
  const banners = backendBanners || [];

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / BANNER_WIDTH);
    setActiveIndex(index);
  };

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
    return authConfig.ImageUrl + imageUrl;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {banners.map((banner: any, i: number) => {
          const [gradStart, gradEnd] = GRADIENTS[i % GRADIENTS.length];
          return (
            <TouchableOpacity
              key={banner.id}
              style={styles.bannerCard}
              onPress={() => banner.productId && onBannerPress?.(banner.productId)}
              activeOpacity={banner.productId ? 0.85 : 1}
            >
              <LinearGradient
                colors={[gradStart, gradEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bannerContent}
              >
                {/* Decorative blobs */}
                <View style={styles.blobTL} />
                <View style={styles.blobBR} />

                {/* Text */}
                <View style={styles.textContainer}>
                  <ThemedText style={styles.bannerTitle} numberOfLines={2}>
                    {banner.title}
                  </ThemedText>
                  {!!banner.subtitle && (
                    <ThemedText style={styles.bannerSubtitle} numberOfLines={1}>
                      {banner.subtitle}
                    </ThemedText>
                  )}
                  {banner.productId && (
                    <View style={styles.shopBtn}>
                      <ThemedText style={styles.shopBtnText}>Shop Now →</ThemedText>
                    </View>
                  )}
                </View>

                {/* Product image */}
                {!!banner.imageUrl && (
                  <Image
                    source={{ uri: getImageUrl(banner.imageUrl) }}
                    style={styles.bannerImage}
                    contentFit="cover"
                    alt={banner.imageAlt}
                  />
                )}
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: AppTheme.spacing.md,
  },
  scrollContent: {
    paddingHorizontal: AppTheme.spacing.md,
    gap: AppTheme.spacing.xl,
  },
  bannerCard: {
    width: BANNER_WIDTH,
    height: 160,
    borderRadius: AppTheme.borderRadius.lg,
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.lg,
    overflow: 'hidden',
  },
  blobTL: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -50,
    left: -50,
  },
  blobBR: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -40,
    right: 100,
  },
  textContainer: {
    flex: 1,
    zIndex: 2,
    gap: 4,
  },
  bannerTitle: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
    color: '#fff',
    lineHeight: 24,
  },
  bannerSubtitle: {
    fontSize: AppTheme.fontSize.sm,
    color: 'rgba(255,255,255,0.75)',
  },
  shopBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  shopBtnText: {
    fontSize: AppTheme.fontSize.xs,
    fontWeight: AppTheme.fontWeight.semibold,
    color: '#fff',
  },
  bannerImage: {
    width: 110,
    height: 110,
    borderRadius: 12,
    marginLeft: AppTheme.spacing.md,
    zIndex: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: AppTheme.spacing.sm,
    gap: AppTheme.spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D0D0D0',
  },
  dotActive: {
    backgroundColor: AppTheme.colors.primary,
    width: 24,
  },
});
