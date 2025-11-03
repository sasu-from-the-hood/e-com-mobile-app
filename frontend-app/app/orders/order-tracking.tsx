import { View, ScrollView, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Phone, MessageCircle, MapPin, Clock, CheckCircle, ChevronLeft, Store, Bike } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';

export default function OrderTrackingScreen() {
  const router = useRouter();

  const handleCall = () => {
    Linking.openURL(`tel:`);
  };

  const handleMessage = () => {
    Alert.alert('Message', 'Chat feature coming soon!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Map with Header Overlay */}
        <View style={styles.mapContainer}>
          {/* Map Placeholder with Route */}
          <View style={styles.mapPlaceholder}>
            {/* Simulated map background */}
            <View style={styles.mapBackground}>
              {/* Route line */}
              <View style={styles.routeLine} />
              {/* Start point */}
              <View style={[styles.mapMarker, styles.startMarker]}>
                <View style={styles.markerInner} />
              </View>
              {/* End point */}
              <View style={[styles.mapMarker, styles.endMarker]}>
                <MapPin size={20} color={AppTheme.colors.primaryForeground} />
              </View>
            </View>
          </View>
          <View style={styles.mapOverlay}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ChevronLeft size={24} color={AppTheme.colors.foreground} />
            </TouchableOpacity>
            <ThemedText style={styles.mapTitle}>Order Tracking</ThemedText>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Delivery Person Card */}
          <View style={styles.deliveryPersonCard}>
            <View style={styles.deliveryPersonInfo}>
              <View style={styles.avatarContainer}>
                <Image
                  source={[]}
                  style={styles.avatar}
                  contentFit="cover"
                />
              </View>
              <View style={styles.deliveryPersonDetails}>
                <ThemedText style={styles.deliveryPersonName}>
                  {[]}
                </ThemedText>
                <ThemedText style={styles.courierLabel}>Courier</ThemedText>
              </View>
            </View>
            <View style={styles.contactButtons}>
              <TouchableOpacity style={styles.contactButton} onPress={handleMessage}>
                <MessageCircle size={24} color={AppTheme.colors.mutedForeground} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
                <Phone size={24} color={AppTheme.colors.mutedForeground} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Progress of your Order</ThemedText>
            <View style={styles.timeline}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={[styles.timelineIcon, styles.timelineIconCompleted]}>
                    <Store size={20} color={AppTheme.colors.primaryForeground} />
                  </View>
                  <View style={[styles.timelineLine, styles.timelineLineCompleted]} />
                </View>
                <View style={styles.timelineContent}>
                  <ThemedText style={styles.timelineTitle}>Upbox Bag</ThemedText>
                  <View style={styles.timelineSubInfo}>
                    <ThemedText style={styles.timelineLabel}>Shop</ThemedText>
                    <View style={styles.dot} />
                    <ThemedText style={styles.timelineTime}>02:50 PM</ThemedText>
                  </View>
                </View>
              </View>

              <View style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={[styles.timelineIcon, styles.timelineIconCompleted]}>
                    <Bike size={20} color={AppTheme.colors.primaryForeground} />
                  </View>
                  <View style={styles.timelineLine} />
                </View>
                <View style={styles.timelineContent}>
                  <ThemedText style={styles.timelineTitle}>On the way</ThemedText>
                  <View style={styles.timelineSubInfo}>
                    <ThemedText style={styles.timelineLabel}>Delivery</ThemedText>
                    <View style={styles.dot} />
                    <ThemedText style={styles.timelineTime}>03:20 PM</ThemedText>
                  </View>
                </View>
              </View>

              <View style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={styles.timelineIcon}>
                    <MapPin size={20} color={AppTheme.colors.mutedForeground} />
                  </View>
                </View>
                <View style={styles.timelineContent}>
                  <ThemedText style={styles.timelineTitle}>5482 Adobe Falls Rd #15San Diego,...</ThemedText>
                  <View style={styles.timelineSubInfo}>
                    <ThemedText style={styles.timelineLabel}>Houser</ThemedText>
                    <View style={styles.dot} />
                    <ThemedText style={styles.timelineTime}>03:45 PM</ThemedText>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Mark as Done Button */}
          <TouchableOpacity style={styles.doneButton} onPress={() => {
            Alert.alert('Success', 'Order marked as delivered!');
            router.back();
          }}>
            <ThemedText style={styles.doneButtonText}>Mark as Done</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  mapContainer: {
    height: 300,
    position: 'relative',
    backgroundColor: '#E8F5E9',
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
  timeline: {
    gap: AppTheme.spacing.lg,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: AppTheme.spacing.md,
  },
  timelineIconContainer: {
    alignItems: 'center',
    width: 48,
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
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: AppTheme.colors.border,
    marginTop: 8,
    marginBottom: 8,
  },
  timelineLineCompleted: {
    backgroundColor: AppTheme.colors.primary,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: AppTheme.spacing.sm,
  },
  timelineTitle: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
    marginBottom: 4,
    color: AppTheme.colors.foreground,
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
});