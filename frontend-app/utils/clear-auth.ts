import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Clear all authentication data from AsyncStorage
 * Use this if you're experiencing token validation issues
 */
export async function clearAllAuth() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const authKeys = keys.filter(key => 
      key.includes('token') || 
      key.includes('user') || 
      key.includes('auth') ||
      key.includes('session')
    );
    
    if (authKeys.length > 0) {
      await AsyncStorage.multiRemove(authKeys);
      console.log('[ClearAuth] Cleared auth keys:', authKeys);
    }
    
    return true;
  } catch (error) {
    console.error('[ClearAuth] Error clearing auth:', error);
    return false;
  }
}
