import { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { useBanners } from '@/hooks/useBanners';
import { authConfig } from '@/config/auth.config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - (AppTheme.spacing.md * 2);

interface BannerData {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  productId?: string;
  type?: string;
}

interface PromotionalBannerProps {
  onBannerPress?: (productId: string) => void;
}

export function PromotionalBanner({ onBannerPress }: PromotionalBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { banners: backendBanners, loading } = useBanners();

  const banners = backendBanners || [];

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / BANNER_WIDTH);
    setActiveIndex(index);
  };

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) {
      return "";
    }
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      console.log('Banner - Full URL:', imageUrl);
      return imageUrl;
    }
    // Otherwise, prepend the IMAGE URL
    const fullUrl = authConfig.ImageUrl + imageUrl;
    console.log('Banner - Constructed URL:', fullUrl, 'from', imageUrl);
    return fullUrl;
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
        {banners.map((banner: any) => (
          <TouchableOpacity 
            key={banner.id} 
            style={styles.bannerCard}
            onPress={() => banner.productId && onBannerPress?.(banner.productId)}
            activeOpacity={banner.productId ? 0.8 : 1}
          >
            <View style={styles.bannerContent}>
              <View style={styles.decorativeCircle} />
              <View style={styles.textContainer}>
                <ThemedText style={styles.bannerTitle}>
                  {banner.title}
                </ThemedText>
                <ThemedText style={styles.bannerTitle}>
                  {banner.subtitle}
                </ThemedText>
                <ThemedText style={styles.bannerSubtitle}>
                  By store
                </ThemedText>
              </View>
              <View >
                <Image
                  source={{ uri: getImageUrl(banner.imageUrl) }}
                  style={styles.bannerImage}
                  contentFit="cover"
                  alt={banner.imageAlt}
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.dotsContainer}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex && styles.dotActive
            ]}
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
  },
  bannerContent: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    borderRadius: AppTheme.borderRadius.md,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.lg,
  },
  decorativeCircle: {
    position: 'absolute',
    left: -40,
    top: '25%',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#A89FE8',
    opacity: 0.3,
  },
  textContainer: {
    flex: 1,
    zIndex: 2,
  },
  bannerTitle: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.foreground,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
  },
  bannerNote: {
    marginTop: AppTheme.spacing.xs,
    fontSize: AppTheme.fontSize.sm,
    color: '#888',
  },
  bannerImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginLeft: AppTheme.spacing.md,
    zIndex: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: AppTheme.spacing.md,
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