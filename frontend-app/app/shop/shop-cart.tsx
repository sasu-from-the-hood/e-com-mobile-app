import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { CartItem } from '@/components/shop/cart-item';
import { ProductSkeleton } from '@/components/shop/product-skeleton';
import { PrimaryButton } from '@/components/onboarding/primary-button';
import { AppTheme } from '@/constants/app-theme';
import { formatPrice } from '@/utils/formatters';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import type { CartItem as CartItemType } from '@/types/schema';

export default function ShopCartScreen() {
  const router = useRouter();
  const { cart, updateCart, removeFromCart, toggleSelection, getTotal, loading, refetch } = useCart();
  const { createOrder } = useOrders();
  const [backendTotal, setBackendTotal] = React.useState<any>(null);

  // Transform cart data to match CartItem interface
  const transformedCart: CartItemType[] = cart.map((item: any) => {
    const imageUrl = item.product.imageUrl || item.product.image;
    console.log('Cart item:', {
      id: item.id,
      name: item.product.name,
      imageUrl,
      color: item.color,
      selected: item.selected
    });
    return {
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: imageUrl,
      color: item.color,
      size: item.size,
      selected: item.selected,
    };
  });

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    try {
      await updateCart(id, quantity);
      fetchTotal();
    } catch (error) {
      console.error('Update cart error:', error);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await removeFromCart(id);
      fetchTotal();
    } catch (error) {
      console.error('Remove item error:', error);
    }
  };

  const handleToggleSelection = async (id: string, selected: boolean) => {
    try {
      await toggleSelection(id, selected);
      fetchTotal();
    } catch (error) {
      console.error('Toggle selection error:', error);
    }
  };

  const handleCheckout = () => {
    const selectedItems = transformedCart.filter(item => item.selected);
    if (selectedItems.length === 0) {
      alert('Please select at least one item to checkout');
      return;
    }
    router.push('/shop/shop-checkout');
  };

  const fetchTotal = async () => {
    const total = await getTotal();
    setBackendTotal(total);
  };

  // Fetch total when component mounts or cart changes
  React.useEffect(() => {
    fetchTotal();
  }, [cart.length]);

  const subtotal = backendTotal?.subtotal || 0;

  // Refetch cart when component mounts
  React.useEffect(() => {
    refetch();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.content}>
          <ProductSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <ThemedText style={styles.title}>My Cart</ThemedText>
        </View>
        <View style={styles.content}>
          <ThemedText style={styles.emptyText}>Your cart is empty</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <ThemedText style={styles.title}>My Cart</ThemedText>
      </View>

      <FlatList
        data={transformedCart}
        renderItem={({ item }: { item: CartItemType }) => (
          <CartItem
            item={item}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveItem}
            onToggleSelection={handleToggleSelection}
          />
        )}
        keyExtractor={(item: CartItemType) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <View style={styles.subtotalRow}>
          <ThemedText style={styles.subtotalLabel}>Subtotal (Selected Items)</ThemedText>
          <ThemedText style={styles.subtotalValue}>ETB {subtotal.toFixed(2)}</ThemedText>
        </View>
        <PrimaryButton
          title="Checkout"
          onPress={handleCheckout}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  header: {
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  title: {
    fontSize: AppTheme.fontSize.xxl,
    fontWeight: AppTheme.fontWeight.bold,
  },
  listContent: {
    padding: AppTheme.spacing.md,
  },
  footer: {
    padding: AppTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
    gap: AppTheme.spacing.md,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtotalLabel: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.medium,
  },
  subtotalValue: {
    fontSize: AppTheme.fontSize.xl,
    fontWeight: AppTheme.fontWeight.bold,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
  },
});