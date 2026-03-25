import { FlatList, View, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { Image } from 'expo-image';
import { Package, Bell, Search } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { BottomTabBar } from '@/components/navigation/bottom-tab-bar';
import { formatDate, formatPrice, formatOrderNumber } from '@/utils/formatters';
import { useOrders } from '@/hooks/useOrders';
import { useNotifications } from '@/hooks/useNotifications';
import { URL } from '@/config';
import type { Order } from '@/types/schema';

export default function OrderHistoryScreen() {
  const router = useRouter();
  const { orders: rawOrders, loading, refetch } = useOrders();
  const { unreadCount } = useNotifications();
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(0);

  // Sort orders: pending first, then processing/shipped, then delivered, then cancelled
  const orders = [...rawOrders].sort((a, b) => {
    const statusOrder: Record<string, number> = {
      'pending': 1,
      'confirmed': 2,
      'processing': 3,
      'packed': 4,
      'shipped': 5,
      'out_for_delivery': 6,
      'delivered': 7,
      'cancelled': 8,
      'refunded': 9,
      'returned': 10
    };
    
    const aOrder = statusOrder[a.status?.toLowerCase()] || 999;
    const bOrder = statusOrder[b.status?.toLowerCase()] || 999;
    
    return aOrder - bOrder;
  });

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
      case 'delivered':
        return AppTheme.colors.statusDelivered;
      case 'shipped':
      case 'out_for_delivery':
        return AppTheme.colors.statusShipped;
      case 'processing':
        return AppTheme.colors.statusProcessing;
      default:
        return AppTheme.colors.statusPlaced;
    }
  };

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) {
      console.log('[OrderHistory] No image path provided');
      return null;
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log('[OrderHistory] Full URL:', imagePath);
      return imagePath;
    }
    const fullUrl = URL.IMAGE + imagePath;
    console.log('[OrderHistory] Constructed URL:', fullUrl, 'from', imagePath);
    return fullUrl;
  };

  const renderOrder = ({ item }: { item: any }) => {
    const isCancelled = item.status?.toLowerCase() === 'cancelled';
    const isDelivered = item.status?.toLowerCase() === 'delivered';
    const showWatermark = isCancelled || isDelivered;

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => router.push(`/orders/order-tracking?orderId=${item.id}`)}
        activeOpacity={0.7}
      >
        {/* Watermark Overlay */}
        {showWatermark && (
          <View style={styles.watermarkOverlay}>
            <ThemedText style={[
              styles.watermarkText,
              isCancelled && styles.watermarkCancelled,
              isDelivered && styles.watermarkDelivered
            ]}>
              {isCancelled ? 'CANCELLED' : 'DELIVERED'}
            </ThemedText>
          </View>
        )}

        <View style={styles.orderHeader}>
          <View style={styles.orderHeaderInfo}>
            <ThemedText style={styles.orderNumber}>
              {formatOrderNumber(item.orderNumber)}
            </ThemedText>
            <ThemedText style={styles.orderDate}>
              {formatDate(item.createdAt)}
            </ThemedText>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <ThemedText style={styles.statusText}>{item.status}</ThemedText>
            </View>
          </View>
        </View>

        {/* Order Items */}
        {item.items && item.items.length > 0 && (
          <View style={styles.itemsContainer}>
            {item.items.map((orderItem: any, index: number) => {
              const imageUrl = getImageUrl(orderItem.productImage);
              console.log('[OrderHistory] Order item:', {
                productName: orderItem.productName,
                productImage: orderItem.productImage,
                imageUrl,
                color: orderItem.color,
                size: orderItem.size
              });
              return (
                <View key={index} style={styles.orderItem}>
                  <View style={[
                    styles.itemImageContainer,
                    orderItem.color && { borderWidth: 3, borderColor: orderItem.color }
                  ]}>
                    {imageUrl ? (
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.itemImage}
                        contentFit="cover"
                      />
                    ) : (
                      <View style={[styles.itemImage, { backgroundColor: AppTheme.colors.muted, justifyContent: 'center', alignItems: 'center' }]}>
                        <Package size={24} color={AppTheme.colors.mutedForeground} />
                      </View>
                    )}
                  </View>
                  <View style={styles.itemDetails}>
                    <ThemedText style={styles.itemName} numberOfLines={1}>
                      {orderItem.productName}
                    </ThemedText>
                    <View style={styles.itemMeta}>
                      {orderItem.color && (
                        <View style={styles.metaItem}>
                          <View style={[styles.colorDot, { backgroundColor: orderItem.color }]} />
                          <ThemedText style={styles.metaText}>Color</ThemedText>
                        </View>
                      )}
                      {orderItem.size && (
                        <View style={styles.metaItem}>
                          <ThemedText style={styles.metaText}>Size: {orderItem.size}</ThemedText>
                        </View>
                      )}
                    </View>
                    <ThemedText style={styles.itemQuantity}>Qty: {orderItem.quantity}</ThemedText>
                  </View>
                  <View style={styles.itemPriceContainer}>
                    <ThemedText style={styles.itemPrice}>
                      ETB {formatPrice(parseFloat(orderItem.unitPrice) * orderItem.quantity)}
                    </ThemedText>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.orderFooter}>
          <View>
            <ThemedText style={styles.totalLabel}>Total: ETB {formatPrice(item.total)}</ThemedText>
          </View>
          <TouchableOpacity 
            style={styles.trackButton}
            onPress={() => router.push(`/orders/order-tracking?orderId=${item.id}`)}
          >
            <ThemedText style={styles.trackButtonText}>View Details</ThemedText>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ThemedText style={styles.headerTitle}>My Orders</ThemedText>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/shop/shop-search')}>
            <Search size={24} color={AppTheme.colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/notifications')}>
            <Bell size={24} color={AppTheme.colors.foreground} />
            {unreadCount > 0 && <View style={styles.notificationBadge} />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, orders.length === 0 && styles.emptyContainer]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading && (
              <View style={styles.emptyState}>
                <Package size={64} color={AppTheme.colors.mutedForeground} />
                <ThemedText style={styles.emptyTitle}>No Orders Yet</ThemedText>
                <ThemedText style={styles.emptyMessage}>
                  Start shopping and your orders will appear here
                </ThemedText>
              </View>
            )
          }
          onScroll={(event) => {
            const currentScrollY = event.nativeEvent.contentOffset.y;
            const isScrollingDown = currentScrollY > scrollY.current;
            scrollY.current = currentScrollY;
            
            if (isScrollingDown && currentScrollY > 50) {
              setIsBottomNavVisible(false);
            } else if (!isScrollingDown) {
              setIsBottomNavVisible(true);
            }
          }}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await refetch();
                setRefreshing(false);
              }}
            />
          }
        />
      </View>
      
      <BottomTabBar isVisible={isBottomNavVisible} />
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
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: AppTheme.fontSize.xxl,
    fontWeight: AppTheme.fontWeight.bold,
  },
  headerActions: {
    flexDirection: 'row',
    gap: AppTheme.spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppTheme.colors.error,
  },
  contentContainer: {
    flex: 1,
  },
  listContent: {
    padding: AppTheme.spacing.md,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: AppTheme.colors.background,
    borderRadius: AppTheme.borderRadius.md,
    padding: AppTheme.spacing.md,
    marginBottom: AppTheme.spacing.md,
    ...AppTheme.shadows.small,
    position: 'relative',
    overflow: 'hidden',
  },
  watermarkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    pointerEvents: 'none',
  },
  watermarkText: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 4,
    opacity: 0.2,
    transform: [{ rotate: '-25deg' }],
  },
  watermarkCancelled: {
    color: AppTheme.colors.error,
  },
  watermarkDelivered: {
    color: AppTheme.colors.statusDelivered,
  },
  orderHeader: {
    marginBottom: AppTheme.spacing.md,
  },
  orderHeaderInfo: {
    flex: 1,
  },
  itemsContainer: {
    marginBottom: AppTheme.spacing.md,
    gap: AppTheme.spacing.sm,
  },
  orderItem: {
    flexDirection: 'row',
    padding: AppTheme.spacing.sm,
    backgroundColor: AppTheme.colors.secondary,
    borderRadius: AppTheme.borderRadius.sm,
  },
  itemImageContainer: {
    width: 60,
    height: 60,
    borderRadius: AppTheme.borderRadius.sm,
    backgroundColor: AppTheme.colors.background,
    marginRight: AppTheme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.medium,
  },
  itemMeta: {
    flexDirection: 'row',
    gap: AppTheme.spacing.sm,
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  metaText: {
    fontSize: AppTheme.fontSize.xs,
    color: AppTheme.colors.mutedForeground,
  },
  itemQuantity: {
    fontSize: AppTheme.fontSize.xs,
    color: AppTheme.colors.mutedForeground,
  },
  itemPriceContainer: {
    justifyContent: 'center',
  },
  itemPrice: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.semibold,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    marginBottom: AppTheme.spacing.md,
  },
  thumbnailContainer: {
    width: 80,
    height: 80,
    borderRadius: AppTheme.borderRadius.sm,
    backgroundColor: AppTheme.colors.secondary,
    marginRight: AppTheme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  orderInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  orderNumber: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.bold,
  },
  orderDate: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: 4,
    borderRadius: AppTheme.borderRadius.sm,
  },
  statusText: {
    color: AppTheme.colors.primaryForeground,
    fontSize: AppTheme.fontSize.xs,
    fontWeight: AppTheme.fontWeight.semibold,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: AppTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
  },
  itemsLabel: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
  },
  totalLabel: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.bold,
    marginTop: 2,
  },
  trackButton: {
    backgroundColor: AppTheme.colors.primary,
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.md,
  },
  trackButtonText: {
    color: AppTheme.colors.primaryForeground,
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.semibold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: AppTheme.spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: AppTheme.fontSize.xl,
    fontWeight: AppTheme.fontWeight.bold,
    marginTop: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.sm,
  },
  emptyMessage: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
    textAlign: 'center',
    paddingHorizontal: AppTheme.spacing.xl,
  },
});