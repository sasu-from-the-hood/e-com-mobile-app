import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { PaymentCard } from '@/components/shop/payment-card';
import { PrimaryButton } from '@/components/onboarding/primary-button';
import { AppTheme } from '@/constants/app-theme';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { ProductSkeleton } from '@/components/shop/product-skeleton';
import type { CartItem as CartItemType } from '@/types/schema';

export default function ShopPaymentScreen() {
  const router = useRouter();
  const { paymentMethods, loading } = usePaymentMethods();
  const { cart, getTotal } = useCart();
  const { createOrder } = useOrders();
  const [selectedPaymentId, setSelectedPaymentId] = useState('');
  const [backendTotal, setBackendTotal] = React.useState<any>(null);

  React.useEffect(() => {
    if (paymentMethods.length > 0 && !selectedPaymentId) {
      setSelectedPaymentId(paymentMethods[0].id);
    }
  }, [paymentMethods, selectedPaymentId]);

  // Fetch total from backend
  React.useEffect(() => {
    const fetchTotal = async () => {
      const total = await getTotal();
      setBackendTotal(total);
    };
    fetchTotal();
  }, [cart.length]);

  // Transform cart data - only selected items
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
  const total = backendTotal?.total || 0;

  const handleConfirm = async () => {
    try {
      await createOrder({
        shippingAddress: 'Default Address',
        paymentMethodId: selectedPaymentId || 'default'
      });
      Alert.alert(
        'Order Placed',
        'Your order has been placed successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.push('/orders/order-history')
          }
        ]
      );
    } catch (error) {
      console.error('Order creation failed:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Payment Method</ThemedText>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          {loading ? (
            <ProductSkeleton />
          ) : paymentMethods.length === 0 ? (
            <ThemedText style={styles.emptyText}>No payment methods found</ThemedText>
          ) : (
            paymentMethods.map((item: any) => (
              <PaymentCard
                key={item.id}
                payment={item}
                selected={selectedPaymentId === item.id}
                onSelect={() => setSelectedPaymentId(item.id)}
              />
            ))
          )}
        </View>

        {/* Order Summary */}
        {transformedCart.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Order Summary</ThemedText>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Subtotal</ThemedText>
              <ThemedText style={styles.summaryValue}>ETB {subtotal.toFixed(2)}</ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Shipping</ThemedText>
              <ThemedText style={styles.summaryValue}>Free</ThemedText>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <ThemedText style={styles.totalLabel}>Total</ThemedText>
              <ThemedText style={styles.totalValue}>ETB {total.toFixed(2)}</ThemedText>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title={paymentMethods.length === 0 ? "Add Payment Method" : `Place Order - ETB ${total.toFixed(2)}`}
          onPress={() => paymentMethods.length === 0 ? router.push('/profile/payment-methods') : handleConfirm()}
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: AppTheme.spacing.sm,
  },
  summaryLabel: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
  },
  summaryValue: {
    fontSize: AppTheme.fontSize.base,
  },
  totalRow: {
    marginTop: AppTheme.spacing.sm,
    paddingTop: AppTheme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
  },
  totalLabel: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
  },
  totalValue: {
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
  emptyText: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
    textAlign: 'center',
    paddingVertical: AppTheme.spacing.lg,
  },
});