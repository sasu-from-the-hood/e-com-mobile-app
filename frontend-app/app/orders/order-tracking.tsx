import { View, StyleSheet, TouchableOpacity, Alert, Animated, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MapPin, ChevronLeft, Store, Bike, Package } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { MapComponent } from '@/components/map/MapComponent';
import { useOrder } from '@/hooks/useOrders';
import { formatDate, formatPrice, formatOrderNumber } from '@/utils/formatters';
import { orpcClient } from '@/lib/orpc-client';
import { useState, useEffect, useRef } from 'react';

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const { order, loading } = useOrder(orderId as string);
  const [deliveryBoyEnabled, setDeliveryBoyEnabled] = useState(false);
  const [warehouseLocation, setWarehouseLocation] = useState<{
    latitude: number;
    longitude: number;
    name: string;
  } | null>(null);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const mapRef = useRef<any>(null);

  // Initialize delivery boy state from order
  useEffect(() => {
    if (order?.deliveryBoy !== undefined) {
      setDeliveryBoyEnabled(order.deliveryBoy);
    }
  }, [order?.deliveryBoy]);

  // Fetch warehouse location when order loads
  useEffect(() => {
    if (order?.id) {
      fetchWarehouseLocation();
    }
  }, [order?.id]);

  const fetchWarehouseLocation = async () => {
    try {
      const warehouse = await orpcClient.getOrderWarehouse(order!.id);
      if (warehouse) {
        setWarehouseLocation({
          latitude: warehouse.latitude,
          longitude: warehouse.longitude,
          name: warehouse.name,
        });
      }
    } catch (error) {
      console.error('Failed to fetch warehouse location:', error);
    }
  };

  const handleDeliveryBoyToggle = async (value: boolean) => {
    setDeliveryBoyEnabled(value);
    try {
      await orpcClient.updateOrderDeliveryBoy({
        orderId: order!.id,
        deliveryBoy: value,
      });
    } catch (error) {
      console.error('Failed to update delivery boy status:', error);
      Alert.alert('Error', 'Failed to update delivery boy status');
      // Revert on error
      setDeliveryBoyEnabled(!value);
    }
  };

  const centerOnWarehouse = () => {
    if (warehouseLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: [warehouseLocation.longitude, warehouseLocation.latitude],
        zoom: 15
      });
    }
  };

  // Animate progress line when order is "on the way"
  useEffect(() => {
    if (order?.status === 'processing' || order?.status === 'shipped') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(progressAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(progressAnimation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      progressAnimation.setValue(0);
    }
  }, [order?.status]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ThemedText>Loading order...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ThemedText>Order not found</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const isCancelled = order.status?.toLowerCase() === 'cancelled';
  const isDelivered = order.status?.toLowerCase() === 'delivered';
  const showWatermark = isCancelled || isDelivered;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Map */}
      <View style={styles.mapContainer}>
        <MapComponent
          ref={mapRef}
          style={styles.map}
          destination={deliveryBoyEnabled ? null : undefined}
          showControls={true}
          pickupLocation={!deliveryBoyEnabled && warehouseLocation ? warehouseLocation : undefined}
        />
        
        {/* Header Overlay */}
        <View style={styles.mapOverlay}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={24} color={AppTheme.colors.foreground} />
          </TouchableOpacity>
          <ThemedText style={styles.mapTitle}>Order Tracking</ThemedText>
        </View>
      </View>

      {/* Bottom Sheet with Order Info */}
      <View style={styles.bottomSheet}>
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

        <View style={styles.sheetHandle} />
        
        {/* Order Info */}
        <ScrollView 
          style={styles.sheetScrollView}
          contentContainerStyle={styles.sheetContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.orderHeader}>
            <View style={styles.orderHeaderLeft}>
              <Package size={24} color={AppTheme.colors.primary} />
              <View style={styles.orderHeaderText}>
                <ThemedText style={styles.orderNumber}>
                  {formatOrderNumber(order.orderNumber)}
                </ThemedText>
                <ThemedText style={styles.orderDate}>
                  {formatDate(order.createdAt)}
                </ThemedText>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <ThemedText style={styles.statusText}>{order.status}</ThemedText>
            </View>
          </View>

          {/* Delivery Boy Toggle - Hide when out_for_delivery, delivered, or cancelled */}
          {order.status !== 'out_for_delivery' && 
           order.status !== 'delivered' && 
           order.status !== 'cancelled' && (
            <View style={styles.deliveryToggleRow}>
              <View style={styles.deliveryToggleLeft}>
                <Bike size={20} color={AppTheme.colors.primary} />
                <ThemedText style={styles.deliveryToggleLabel}>Delivery Boy</ThemedText>
              </View>
              <Switch
                value={deliveryBoyEnabled}
                onValueChange={handleDeliveryBoyToggle}
                trackColor={{ false: AppTheme.colors.border, true: AppTheme.colors.primary }}
                thumbColor={AppTheme.colors.background}
              />
            </View>
          )}
          
          {!deliveryBoyEnabled && warehouseLocation && (
            <View style={styles.pickupNotice}>
              <MapPin size={16} color="#4CAF50" />
              <ThemedText style={styles.pickupNoticeText}>
                Get your order from {warehouseLocation.name} marked in green on the map
              </ThemedText>
              <TouchableOpacity 
                style={styles.centerMapButton}
                onPress={centerOnWarehouse}
              >
                <MapPin size={20} color={AppTheme.colors.primaryForeground} />
              </TouchableOpacity>
            </View>
          )}

          {/* Timeline - Horizontal (only show when delivery boy is ON) */}
          {deliveryBoyEnabled && (
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={styles.timelineIconContainer}>
                <View style={[styles.timelineIcon, styles.timelineIconCompleted]}>
                  <Store size={16} color={AppTheme.colors.primaryForeground} />
                </View>
              </View>
              <ThemedText style={styles.timelineTitle}>Order Placed</ThemedText>
            </View>

            <View style={styles.timelineLineContainer}>
              <View style={[styles.timelineLine, styles.timelineLineCompleted]} />
              {(order.status === 'processing' || order.status === 'shipped') && (
                <Animated.View
                  style={[
                    styles.timelineLineAnimated,
                    {
                      width: progressAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              )}
            </View>

            <View style={styles.timelineItem}>
              <View style={styles.timelineIconContainer}>
                <View style={[
                  styles.timelineIcon,
                  (order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') && styles.timelineIconCompleted
                ]}>
                  <Bike size={16} color={
                    (order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered')
                      ? AppTheme.colors.primaryForeground 
                      : AppTheme.colors.mutedForeground
                  } />
                </View>
              </View>
              <ThemedText style={styles.timelineTitle}>On the way</ThemedText>
            </View>

            <View style={styles.timelineLineContainer}>
              <View style={[
                styles.timelineLine,
                order.status === 'delivered' && styles.timelineLineCompleted
              ]} />
            </View>

            <View style={styles.timelineItem}>
              <View style={styles.timelineIconContainer}>
                <View style={[
                  styles.timelineIcon,
                  order.status === 'delivered' && styles.timelineIconCompleted
                ]}>
                  <MapPin size={16} color={
                    order.status === 'delivered'
                      ? AppTheme.colors.primaryForeground
                      : AppTheme.colors.mutedForeground
                  } />
                </View>
              </View>
              <ThemedText style={styles.timelineTitle}>Delivered</ThemedText>
            </View>
          </View>
          )}

          {/* Cancel Order Button - Hide when delivery boy is ON and order is on the way (processing) */}
          {(order.status === 'pending' || order.status === 'processing') && 
           !(deliveryBoyEnabled && order.status === 'processing') && (
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => {
                Alert.alert(
                  'Cancel Order',
                  'Are you sure you want to cancel this order?',
                  [
                    { text: 'No', style: 'cancel' },
                    { 
                      text: 'Yes, Cancel', 
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await orpcClient.cancelOrder(order.id);
                          Alert.alert('Success', 'Order cancelled successfully');
                          router.back();
                        } catch (error) {
                          Alert.alert('Error', 'Failed to cancel order');
                        }
                      }
                    }
                  ]
                );
              }}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel Order</ThemedText>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  mapContainer: {
    flex: 1.5,
    position: 'relative',
    backgroundColor: '#E8F5E9',
  },
  map: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  mapPlaceholder: {
    width: '100%',
    height: 300,
  },
  mapBackground: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#E8F5E9',
  },
  routeLine: {
    position: 'absolute',
    top: '25%',
    left: '15%',
    width: '50%',
    height: 120,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: AppTheme.colors.primary,
    borderStyle: 'solid',
    borderBottomLeftRadius: 20,
  },
  mapMarker: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...AppTheme.shadows.medium,
  },
  startMarker: {
    top: '20%',
    left: '12%',
    backgroundColor: AppTheme.colors.primary,
  },
  markerInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: AppTheme.colors.primaryForeground,
  },
  endMarker: {
    bottom: '25%',
    right: '25%',
    backgroundColor: AppTheme.colors.primary,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppTheme.spacing.md,
    ...AppTheme.shadows.small,
  },
  mapTitle: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
  },
  content: {
    padding: AppTheme.spacing.md,
    paddingBottom: 100,
  },
  section: {
    marginBottom: AppTheme.spacing.lg,
  },
  sectionTitle: {
    fontSize: AppTheme.fontSize.xl,
    fontWeight: AppTheme.fontWeight.bold,
    marginBottom: AppTheme.spacing.lg,
    color: AppTheme.colors.foreground,
  },
  deliveryPersonCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: AppTheme.spacing.lg,
    backgroundColor: AppTheme.colors.background,
    borderRadius: AppTheme.borderRadius.lg,
    marginBottom: AppTheme.spacing.xl,
    ...AppTheme.shadows.medium,
  },
  deliveryPersonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    marginRight: AppTheme.spacing.md,
    ...AppTheme.shadows.small,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  deliveryPersonDetails: {
    flex: 1,
  },
  deliveryPersonName: {
    fontSize: AppTheme.fontSize.xl,
    fontWeight: AppTheme.fontWeight.bold,
    marginBottom: 4,
    color: AppTheme.colors.foreground,
  },
  courierLabel: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: AppTheme.spacing.md,
  },
  contactButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppTheme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.primary,
    marginTop: 4,
  },
  cancelButton: {
    marginTop: AppTheme.spacing.lg,
    paddingVertical: AppTheme.spacing.md,
    paddingHorizontal: AppTheme.spacing.lg,
    backgroundColor: AppTheme.colors.error,
    borderRadius: AppTheme.borderRadius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
    color: AppTheme.colors.primaryForeground,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: AppTheme.spacing.lg,
    paddingHorizontal: AppTheme.spacing.sm,
  },
  timelineItem: {
    alignItems: 'center',
    gap: AppTheme.spacing.sm,
  },
  timelineIconContainer: {
    alignItems: 'center',
  },
  timelineIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppTheme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIconCompleted: {
    backgroundColor: AppTheme.colors.primary,
  },
  timelineLineContainer: {
    flex: 1,
    height: 2,
    marginHorizontal: AppTheme.spacing.xs,
    position: 'relative',
  },
  timelineLine: {
    flex: 1,
    height: 2,
    backgroundColor: AppTheme.colors.border,
  },
  timelineLineCompleted: {
    backgroundColor: AppTheme.colors.primary,
  },
  timelineLineAnimated: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 2,
    backgroundColor: AppTheme.colors.primary,
    opacity: 0.6,
  },
  timelineTitle: {
    fontSize: AppTheme.fontSize.xs,
    fontWeight: AppTheme.fontWeight.semibold,
    color: AppTheme.colors.foreground,
    textAlign: 'center',
  },
  timelineSubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.xs,
  },
  timelineLabel: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: AppTheme.colors.mutedForeground,
  },
  timelineTime: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
  },
  doneButton: {
    backgroundColor: AppTheme.colors.background,
    borderWidth: 2,
    borderColor: AppTheme.colors.primary,
    paddingVertical: AppTheme.spacing.md,
    borderRadius: AppTheme.borderRadius.full,
    alignItems: 'center',
    marginTop: AppTheme.spacing.lg,
  },
  doneButtonText: {
    color: AppTheme.colors.primary,
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.semibold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheet: {
    flex: 1.2,
    backgroundColor: AppTheme.colors.background,
    borderTopLeftRadius: AppTheme.borderRadius.xl,
    borderTopRightRadius: AppTheme.borderRadius.xl,
    ...AppTheme.shadows.large,
    position: 'relative',
    overflow: 'hidden',
  },
  watermarkOverlay: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    pointerEvents: 'none',
  },
  watermarkText: {
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: 6,
    opacity: 0.15,
    transform: [{ rotate: '-25deg' }],
  },
  watermarkCancelled: {
    color: AppTheme.colors.error,
  },
  watermarkDelivered: {
    color: AppTheme.colors.statusDelivered,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: AppTheme.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: AppTheme.spacing.md,
    marginBottom: AppTheme.spacing.sm,
  },
  sheetScrollView: {
    flex: 1,
  },
  sheetContent: {
    padding: AppTheme.spacing.md,
    paddingBottom: AppTheme.spacing.xl,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.lg,
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.md,
  },
  orderHeaderText: {
    gap: 4,
  },
  orderNumber: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
  },
  orderDate: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
  },
  statusBadge: {
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.xs,
    borderRadius: AppTheme.borderRadius.full,
  },
  statusText: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.semibold,
    color: AppTheme.colors.primaryForeground,
    textTransform: 'capitalize',
  },
  deliveryToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: AppTheme.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: AppTheme.colors.border,
    marginBottom: AppTheme.spacing.md,
  },
  deliveryToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.sm,
  },
  deliveryToggleLabel: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
    color: AppTheme.colors.foreground,
  },
  pickupNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.sm,
    padding: AppTheme.spacing.md,
    backgroundColor: '#E8F5E9',
    borderRadius: AppTheme.borderRadius.md,
    marginBottom: AppTheme.spacing.lg,
  },
  pickupNoticeText: {
    flex: 1,
    fontSize: AppTheme.fontSize.sm,
    color: '#2E7D32',
  },
  centerMapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...AppTheme.shadows.small,
  },
});