import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { useAuth } from '@/hooks/useAuth';
import { orpc } from '@/lib/orpc-client';

const ONBOARDING_SHOWN_KEY = 'onboarding_shown';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [appName, setAppName] = useState('');
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withSequence(
      withTiming(1.1, { duration: 400 }),
      withTiming(1, { duration: 400 })
    );
    textOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
  }, []);

  // Fetch and cache app settings
  useEffect(() => {
    const loadAppSettings = async () => {
      try {
        // Try to load from cache first for instant display
        const cached = await AsyncStorage.getItem('app_settings');
        if (cached) {
          const cachedSettings = JSON.parse(cached);
          if (cachedSettings.app_name) {
            setAppName(cachedSettings.app_name);
          }
          console.log('Using cached app settings');
        }

        // Fetch fresh settings from backend (returns object)
        const settings = await orpc.getAppSettings({});
        
        // Update app name if available
        if (settings.app_name) {
          setAppName(settings.app_name);
        }
        
        // Store in AsyncStorage
        await AsyncStorage.setItem('app_settings', JSON.stringify(settings));
        console.log('App settings cached successfully', JSON.stringify(settings) );
      } catch (error) {
        console.error('Failed to fetch app settings:', error);
        // Cache is already loaded above if available
      } finally {
        setIsReady(true);
      }
    };

    loadAppSettings();
  }, []);

  useEffect(() => {
    if (!isReady || isAuthenticated === null) return;

    const navigateAfterSplash = async () => {
      try {
        // Check if onboarding has been shown
        const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_SHOWN_KEY);
        
        const timer = setTimeout(() => {
          if (isAuthenticated) {
            // User is logged in - go to shop
            router.replace('/shop/shop-home');
          } else {
            // User is not logged in
            if (hasSeenOnboarding === 'true') {
              // Already seen onboarding - go to login
              router.replace('/auth/login');
            } else {
              // First time - show onboarding
              router.replace('/onboarding');
            }
          }
        }, 2000);
        
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Failed to check onboarding status:', error);
        // On error, default to login if not authenticated
        const timer = setTimeout(() => {
          if (isAuthenticated) {
            router.replace('/shop/shop-home');
          } else {
            router.replace('/auth/login');
          }
        }, 2000);
        return () => clearTimeout(timer);
      }
    };

    navigateAfterSplash();
  }, [isAuthenticated, isReady]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.logoCircle}>
            <ThemedText style={styles.logoText}>
              {appName.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
        </Animated.View>
        <Animated.View style={textAnimatedStyle}>
          <ThemedText style={styles.appName}>{appName}</ThemedText>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: AppTheme.spacing.lg,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...AppTheme.shadows.medium,
  },
  logoText: {
    fontSize: 32,
    fontWeight: AppTheme.fontWeight.bold,
    color: 'white',
  },
  appName: {
    fontSize: 28,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.foreground,
    letterSpacing: -0.5,
  },
});