import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { X } from 'lucide-react-native';
import { orpcClient } from '@/lib/orpc-client';
import { PostItem } from '@/app/fashion/create-post';
import { ProductCard } from '@/components/shop/product-card';
import type { Product } from '@/types/schema';

interface ProductSelectorProps {
  onSelectProduct: (item: PostItem) => void;
  onRemoveProduct: (productId: string) => void;
  attachedProductIds: string[];
}

interface FavoriteProduct extends Product {
  glbModelIds: string[];
}

export function ProductSelector({ onSelectProduct, onRemoveProduct, attachedProductIds }: ProductSelectorProps) {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const response = await orpcClient.getFavorites();
      
      console.log('[ProductSelector] Favorites response:', response);
      
      // Response is an array directly, not response.favorites
      const productsWithModels = (response || [])
        .filter((fav: any) => {
          const modelIds = Array.isArray(fav.product?.glbModelIds) 
            ? fav.product.glbModelIds 
            : (typeof fav.product?.glbModelIds === 'string' ? JSON.parse(fav.product.glbModelIds) : []);
          return modelIds.length > 0;
        })
        .map((fav: any) => ({
          ...fav.product, // Spread all product properties
          glbModelIds: Array.isArray(fav.product.glbModelIds) 
            ? fav.product.glbModelIds 
            : (typeof fav.product.glbModelIds === 'string' ? JSON.parse(fav.product.glbModelIds) : []),
        }));
      
      console.log('[ProductSelector] Products with models:', productsWithModels);
      setFavorites(productsWithModels);
    } catch (error) {
      console.error('Failed to load favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = async (product: FavoriteProduct) => {
    console.log('[ProductSelector] handleSelectProduct called with product:', product.id);
    console.log('[ProductSelector] attachedProductIds:', attachedProductIds);
    
    if (attachedProductIds.includes(product.id)) {
      console.log('[ProductSelector] Product already attached, returning');
      return; // Already attached
    }

    try {
      // Get the first 3D model for this product
      const modelId = product.glbModelIds[0];
      console.log('[ProductSelector] Loading model:', modelId);
      const modelData = await orpcClient.get3DModel(modelId);
      console.log('[ProductSelector] Model data:', modelData);
      
      // Map body part type to bone name
      const boneMapping: Record<string, string> = {
        'top-head': 'mixamorigHead',
        'middle-head': 'mixamorigHead',
        'lower-head': 'mixamorigHead',
        'chest': 'mixamorigSpine2',
        'left-hand': 'mixamorigLeftHand',
        'right-hand': 'mixamorigRightHand',
        'left-leg': 'mixamorigLeftLeg',
        'right-leg': 'mixamorigRightLeg',
        'both-legs': 'mixamorigHips',
      };
      
      const boneName = boneMapping[modelData.bodyPartType] || 'mixamorigSpine2';
      
      const item: PostItem = {
        id: `item-${Date.now()}`,
        productId: product.id,
        modelId: modelData.id,
        leftLegFile: modelData.leftLegFile || '',
        boneName,
        bodyPartType: modelData.bodyPartType,
        scale: modelData.scale,
        positionX: modelData.positionX,
        positionY: modelData.positionY,
        positionZ: modelData.positionZ,
        productName: product.name,
        productImage: product.images?.[0] || product.image || '',
      };
      
      console.log('[ProductSelector] Calling onSelectProduct with:', item);
      onSelectProduct(item);
    } catch (error) {
      console.error('Failed to load product model:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={AppTheme.colors.primary} />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>No favorites with 3D models</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {favorites.map((product) => {
        const isAttached = attachedProductIds.includes(product.id);
        
        return (
          <View key={product.id} style={styles.productWrapper}>
            <ProductCard
              product={product}
              onPress={() => handleSelectProduct(product)}
              hideDetails={true}
            />
            
            {isAttached && (
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => onRemoveProduct(product.id)}
              >
                <X size={16} color="#fff" />
              </TouchableOpacity>
            )}
            
            {isAttached && <View style={styles.attachedOverlay} />}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: AppTheme.spacing.sm,
    gap: AppTheme.spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: AppTheme.spacing.md,
  },
  emptyText: {
    color: '#666',
    fontSize: AppTheme.fontSize.sm,
    textAlign: 'center',
  },
  productWrapper: {
    width: '100%',
    position: 'relative',
  },
  attachedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: AppTheme.borderRadius.md,
  },
  removeButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 68, 68, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.3,
    zIndex: 10,
  },
});
