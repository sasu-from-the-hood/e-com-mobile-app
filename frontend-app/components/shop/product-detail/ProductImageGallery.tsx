import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { Model3DViewer } from '../model-3d-viewer';

const { width } = Dimensions.get('window');

interface ProductImageGalleryProps {
  images: string[];
  currentImageIndex: number;
  onImageChange: (index: number) => void;
  discount?: number | null;
  getImageUrl: (path: string) => string;
  defaultImage: string;
  modelIds?: string[];
  showModel?: boolean;
}

export function ProductImageGallery({
  images,
  currentImageIndex,
  onImageChange,
  discount,
  getImageUrl,
  defaultImage,
  modelIds,
  showModel = false,
}: ProductImageGalleryProps) {
  const safeImageIndex = images.length > 0 ? Math.min(Math.max(0, currentImageIndex), images.length - 1) : 0;
  const currentImage = images[safeImageIndex];

  return (
    <View style={styles.imageContainer}>
      {showModel && modelIds && modelIds.length > 0 ? (
        <Model3DViewer modelIds={modelIds} />
      ) : (
        <Image
          source={currentImage ? { uri: getImageUrl(currentImage) } : { uri: defaultImage }}
          style={styles.image}
          contentFit="cover"
        />
      )}
      
      {/* Navigation arrows */}
      {images.length > 1 && !showModel && (
        <>
          <TouchableOpacity
            style={styles.leftArrow}
            onPress={() => {
              onImageChange((currentImageIndex - 1 + images.length) % images.length);
            }}
          >
            <ThemedText style={styles.arrowText}>‹</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rightArrow}
            onPress={() => {
              onImageChange((currentImageIndex + 1) % images.length);
            }}
          >
            <ThemedText style={styles.arrowText}>›</ThemedText>
          </TouchableOpacity>
        </>
      )}
      
      {images.length > 1 && !showModel && (
        <View style={styles.imageIndicator}>
          {images.map((_, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => onImageChange(idx)}
              style={[
                styles.indicatorDot,
                idx === safeImageIndex && styles.indicatorDotActive
              ]}
            />
          ))}
        </View>
      )}
      
      {discount && discount > 0 && (
        <View style={styles.discountBadge}>
          <ThemedText style={styles.discountText}>
            -{discount}%
          </ThemedText>
        </View>
      )}
      
      {images.length > 1 && !showModel && (
        <View style={styles.swipeHint}>
          <ThemedText style={styles.swipeHintText}>
            Tap arrows or dots to view more
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: AppTheme.colors.secondary,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  leftArrow: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -20 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  rightArrow: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -20 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  arrowText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  discountBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: AppTheme.colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
  },
  discountText: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.bold,
    color: '#fff',
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorDotActive: {
    backgroundColor: '#fff',
    width: 20,
  },
  swipeHint: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  swipeHintText: {
    fontSize: AppTheme.fontSize.xs,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
});
