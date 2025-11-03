import React, { useState, useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export function NetworkErrorBanner() {
  const { networkError, checkAuth } = useAuth();
  const { isOffline } = useNetworkStatus();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showBackOnline, setShowBackOnline] = useState(false);
  const slideAnim = useState(new Animated.Value(100))[0];
  const spinValue = useState(new Animated.Value(0))[0];
  const prevHasError = useRef(false);

  const hasError = isOffline || networkError;
  const shouldShow = hasError || showBackOnline;

  useEffect(() => {
    if (hasError) {
      setShowBackOnline(false);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else if (!hasError && prevHasError.current) {
      setShowBackOnline(true);
      setTimeout(() => {
        setShowBackOnline(false);
        Animated.spring(slideAnim, {
          toValue: 100,
          useNativeDriver: true,
        }).start();
      }, 3000);
    }
    prevHasError.current = hasError;
  }, [hasError]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
    
    await checkAuth();
    
    setTimeout(() => {
      setIsRefreshing(false);
      spinValue.stopAnimation();
      spinValue.setValue(0);
    }, 1000);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!shouldShow) return null;
  
  const message = showBackOnline ? 'Back online' : (isOffline ? 'No internet connection' : 'Server connection failed');
  const backgroundColor = showBackOnline ? '#4CAF50' : '#ff4444';
  
  return (
    <Animated.View style={{
      backgroundColor,
      padding: 7,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      transform: [{ translateY: slideAnim }],
    }}>
      <Text style={{ color: 'white', flex: 1, fontWeight: '500' }}>{message}</Text>
      {!showBackOnline && (
        <TouchableOpacity onPress={handleRefresh}>
          <Animated.View style={{ transform: [{ rotate: isRefreshing ? spin : '0deg' }] }}>
            <Ionicons name="refresh" size={20} color="white" />
          </Animated.View>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}