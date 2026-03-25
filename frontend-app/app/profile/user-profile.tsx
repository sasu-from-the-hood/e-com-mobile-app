import { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Package, MapPin, Bell, Settings, HelpCircle, LogOut, Edit3, ShoppingCart } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/Avatar';
import { ProfileMenuItem } from '@/components/profile/profile-menu-item';
import { LogoutModal } from '@/components/profile/logout-modal';
import { AppTheme } from '@/constants/app-theme';
import { BottomTabBar } from '@/components/navigation/bottom-tab-bar';
import { useAuth } from '@/hooks/useAuth';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function UserProfileScreen() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const scrollY = useRef(0);
  const { logout, user, checkAuth } = useAuth();

  useFocusEffect(
    useCallback(() => {
      checkAuth();
    }, [])
  );



  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - scrollY.current;
    
    if (scrollDiff > 10 && isTabBarVisible) {
      setIsTabBarVisible(false);
    } else if (scrollDiff < -10 && !isTabBarVisible) {
      setIsTabBarVisible(true);
    }
    
    scrollY.current = currentScrollY;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />



      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Avatar
              source={user?.image}
              name={user?.name || user?.email}
              size={100}
              style={styles.avatar}
            />
            <TouchableOpacity 
              style={styles.editAvatarButton}
              onPress={() => router.push('/profile/edit-profile')}
            >
              <Edit3 size={16} color="white" />
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.name}>{user?.name || user?.email || 'User'}</ThemedText>
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          <ProfileMenuItem
            title="My Cart"
            icon={<ShoppingCart size={24} color={AppTheme.colors.primary} />}
            onPress={() => router.push('/shop/shop-cart')}
          />
          <ProfileMenuItem
            title="My Orders"
            icon={<Package size={24} color={AppTheme.colors.primary} />}
            onPress={() => router.push('/orders/order-history')}
          />
          <ProfileMenuItem
            title="Addresses"
            icon={<MapPin size={24} color={AppTheme.colors.primary} />}
            onPress={() => router.push('/profile/address-list')}
          />
          <ProfileMenuItem
            title="Notifications"
            icon={<Bell size={24} color={AppTheme.colors.primary} />}
            onPress={() => router.push('/notifications')}
          />
          <ProfileMenuItem
            title="Settings"
            icon={<Settings size={24} color={AppTheme.colors.primary} />}
            onPress={() => router.push('/profile/settings')}
          />
          <ProfileMenuItem
            title="Help & Support"
            icon={<HelpCircle size={24} color={AppTheme.colors.primary} />}
            onPress={() => router.push('/profile/help-support')}
          />
          <ProfileMenuItem
            title="Logout"
            icon={<LogOut size={24} color={AppTheme.colors.error} />}
            onPress={() => setShowLogoutModal(true)}
            showChevron={false}
          />
        </View>
      </ScrollView>

      <LogoutModal
        visible={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
      
      <BottomTabBar isVisible={isTabBarVisible} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainerSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: AppTheme.spacing.md,
    ...AppTheme.shadows.small,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
  },
  welcomeText: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
    marginTop: 2,
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
  scrollContent: {
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    padding: AppTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'visible',
    marginBottom: AppTheme.spacing.md,
    position: 'relative',
    ...AppTheme.shadows.medium,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AppTheme.colors.background,
    ...AppTheme.shadows.small,
  },
  name: {
    fontSize: AppTheme.fontSize.xxl,
    fontWeight: AppTheme.fontWeight.bold,
    marginBottom: 4,
  },
  email: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
    marginBottom: AppTheme.spacing.lg,
  },
  menu: {
    padding: AppTheme.spacing.md,
  },
});