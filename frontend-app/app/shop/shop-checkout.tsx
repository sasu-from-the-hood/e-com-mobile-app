import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ChevronLeft } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { AddressCard } from '@/components/shop/address-card';
import { PrimaryButton } from '@/components/onboarding/primary-button';
import { AppTheme } from '@/constants/app-theme';
import { useAddresses } from '@/hooks/useAddresses';
import { useCart } from '@/hooks/useCart';
import { ProductSkeleton } from '@/components/shop/product-skeleton';
import { formatPrice } from '@/utils/formatters';
import { URL } from '@/config';
import type { CartItem as CartItemType } from '@/types/schema';
import { orpcClient } from '@/lib/orpc-client';
import { showToast } from '@/utils/toast';

export default function ShopCheckoutScreen() {
  const router = useRouter();
  const { addresses, loading } = useAddresses();
  const { cart, loading: cartLoading, getTotal } = useCart();
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [backendTotal, setBackendTotal] = React.useState<any>(null);
  const [placing, setPlacing] = useState(false);

  React.useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  // Fetch total from backend
  React.useEffect(() => {
    const fetchTotal = async () => {
      const total = await getTotal();
      setBackendTotal(total);
    };
    fetchTotal();
  }, [cart.length]);

  // Transform cart data - only show selected items
  const transformedCart: CartItemType[] = cart
    .filter((item: any) => item.selected)
    .map((item: any) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.imageUrl || item.product.image,
      color: item.color,
      size: item.size,
      selected: item.selected,
    }));

  const subtotal = backendTotal?.subtotal || 0;

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) {
      console.log('Checkout - No image path provided');
      return '';
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log('Checkout - Full URL:', imagePath);
      return imagePath;
    }
    const fullUrl = URL.IMAGE + imagePath;
    console.log('Checkout - Constructed URL:', fullUrl, 'from', imagePath);
    return fullUrl;
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      showToast('error', 'Please select a delivery address');
      return;
    }

    setPlacing(true);
    try {
      const order = await orpcClient.createOrder({
        shippingAddress: selectedAddressId,
        paymentMethodId: 'cod' // Cash on Delivery
      });
      
      showToast('success', 'Order placed successfully!');
      router.replace('/orders/order-history');
    } catch (error: any) {
      console.error('Place order error:', error);
      showToast('error', error.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.canGoBack() ? router.back() : router.replace('/shop/shop-cart')}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color={AppTheme.colors.foreground} />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Checkout</ThemedText>
          <View style={styles.placeholder} />
        </View>

        {/* Cart Items Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Order Items</ThemedText>
          {cartLoading ? (
            <ProductSkeleton />
          ) : transformedCart.length === 0 ? (
            <ThemedText style={styles.emptyText}>No items in cart</ThemedText>
          ) : (
            transformedCart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={[
                  styles.itemImageContainer,
                  item.color && { borderWidth: 3, borderColor: item.color }
                ]}>
                  {getImageUrl(item.image) ? (
                    <Image
                      source={{ uri: getImageUrl(item.image) }}
                      style={styles.itemImage}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={[styles.itemImage, { backgroundColor: AppTheme.colors.muted, justifyContent: 'center', alignItems: 'center' }]}>
                      <ThemedText style={{ color: AppTheme.colors.mutedForeground, fontSize: 10 }}>No Image</ThemedText>
                    </View>
                  )}
                </View>
                <View style={styles.itemDetails}>
                  <ThemedText style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </ThemedText>
                  <View style={styles.itemMeta}>
                    {item.color && (
                      <View style={styles.colorInfo}>
                        <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                        <ThemedText style={styles.metaText}>Color</ThemedText>
                      </View>
                    )}
                    {item.size && (
                      <ThemedText style={styles.metaText}>Size: {item.size}</ThemedText>
                    )}
                  </View>
                  <View style={styles.itemPriceRow}>
                    <ThemedText style={styles.itemQuantity}>Qty: {item.quantity}</ThemedText>
                    <ThemedText style={styles.itemPrice}>
                      ETB {(item.price * item.quantity).toFixed(2)}
                    </ThemedText>
                  </View>
                </View>
              </View>
            ))
          )}

          {/* Subtotal */}
          {transformedCart.length > 0 && (
            <View style={styles.subtotalRow}>
              <ThemedText style={styles.subtotalLabel}>Subtotal</ThemedText>
              <ThemedText style={styles.subtotalValue}>ETB {subtotal.toFixed(2)}</ThemedText>
            </View>
          )}
        </View>

        {/* Address Selection Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Delivery Address</ThemedText>
          {loading ? (
            <ProductSkeleton />
          ) : addresses.length === 0 ? (
            <ThemedText style={styles.emptyText}>No addresses found</ThemedText>
          ) : (
            addresses.map((item: any) => (
              <AddressCard
                key={item.id}
                address={item}
                selected={selectedAddressId === item.id}
                onSelect={() => setSelectedAddressId(item.id)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.paymentInfo}>
          <ThemedText style={styles.paymentLabel}>Payment Method</ThemedText>
          <ThemedText style={styles.paymentValue}>Cash on Delivery</ThemedText>
        </View>
        <PrimaryButton
          title={addresses.length === 0 ? "Add Address" : placing ? "Placing Order..." : "Order Now"}
          onPress={addresses.length === 0 ? () => router.push('/profile/address-list') : handlePlaceOrder}
          disabled={transformedCart.length === 0 || (addresses.length > 0 && !selectedAddressId) || placing}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: AppTheme.fontSize.xl,
    fontWeight: AppTheme.fontWeight.bold,
  },
  placeholder: {
    width: 40,
  },
  section: {
    padding: AppTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  sectionTitle: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.semibold,
    marginBottom: AppTheme.spacing.md,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: AppTheme.spacing.md,
    padding: AppTheme.spacing.sm,
    backgroundColor: AppTheme.colors.background,
    borderRadius: AppTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: AppTheme.borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: AppTheme.colors.muted,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    marginLeft: AppTheme.spacing.md,
  },
  itemName: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.medium,
    marginBottom: AppTheme.spacing.xs,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.md,
    marginBottom: AppTheme.spacing.xs,
  },
  colorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.xs,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  metaText: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
  },
  itemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
  },
  itemPrice: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: AppTheme.spacing.md,
    marginTop: AppTheme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
  },
  subtotalLabel: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.semibold,
  },
  subtotalValue: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.primary,
  },
  footer: {
    padding: AppTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.background,
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: AppTheme.spacing.md,
  },
  paymentLabel: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
  },
  paymentValue: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
    color: AppTheme.colors.primary,
  },
  emptyText: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
    textAlign: 'center',
    paddingVertical: AppTheme.spacing.lg,
  },
});