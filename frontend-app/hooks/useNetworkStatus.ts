import { useState, useEffect } from 'react';
import * as Network from 'expo-network';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(true);

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        setIsConnected(networkState.isConnected ?? true);
        setIsInternetReachable(networkState.isInternetReachable ?? true);
      } catch {
        setIsConnected(true);
        setIsInternetReachable(true);
      }
    };

    checkNetwork();
    const interval = setInterval(checkNetwork, 5000);

    return () => clearInterval(interval);
  }, []);

  const isOffline = isConnected === false || isInternetReachable === false;

  return {
    isConnected,
    isInternetReachable,
    isOffline
  };
}