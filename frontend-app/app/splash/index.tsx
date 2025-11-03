import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
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

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/shop/shop-home');
      } else {
        router.replace('/onboarding');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

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
            <ThemedText style={styles.logoText}>E</ThemedText>
          </View>
        </Animated.View>
        <Animated.View style={textAnimatedStyle}>
          <ThemedText style={styles.appName}>E-Commerce</ThemedText>
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