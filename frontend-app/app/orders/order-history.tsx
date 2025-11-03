import { FlatList, View, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { Image } from 'expo-image';
import { Search, Bell } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { BottomTabBar } from '@/components/navigation/bottom-tab-bar';
import { formatDate, formatPrice, formatOrderNumber } from '@/utils/formatters';
import { useOrders } from '@/hooks/useOrders';
import { useNotifications } from '@/hooks/useNotifications';
import type { Order } from '@/types/schema';

export default function OrderHistoryScreen() {
  const router = useRouter();
  const { orders, loading, refetch } = useOrders();
  const { unreadCount } = useNotifications();
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return AppTheme.colors.statusDelivered;
      case 'Out for Delivery':
        return AppTheme.colors.statusShipped;
      case 'Processing':
        return AppTheme.colors.statusProcessing;
      default:
        return AppTheme.colors.statusPlaced;
    }
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => router.push('/orders/order-tracking')}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <View style={styles.thumbnailContainer}>
          <Image
            source={item.thumbnail}
            style={styles.thumbnail}
            contentFit="cover"
          />
        </View>
        <View style={styles.orderInfo}>
          <ThemedText style={styles.orderNumber}>
            {formatOrderNumber(item.orderNumber)}
          </ThemedText>
          <ThemedText style={styles.orderDate}>
            {formatDate(item.date)}
          </ThemedText>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <ThemedText style={styles.statusText}>{item.status}</ThemedText>
          </View>
        </View>
      </View>
      <View style={styles.orderFooter}>
        <View>
          <ThemedText style={styles.itemsLabel}>{item.items} items</ThemedText>
          <ThemedText style={styles.totalLabel}>Total: {formatPrice(item.total)}</ThemedText>
        </View>
        <TouchableOpacity style={styles.trackButton}>
          <ThemedText style={styles.trackButtonText}>Track Order</ThemedText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
  },
  orderHeader: {
    flexDirection: 'row',
    marginBottom: AppTheme.spacing.md,
  },
  thumbnailContainer: {
    width: 80,
    height: 80,
    borderRadius: AppTheme.borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: AppTheme.colors.secondary,
    marginRight: AppTheme.spacing.md,
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
});