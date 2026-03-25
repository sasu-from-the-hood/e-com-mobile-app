import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@app_auth_token';
const REFRESH_TOKEN_KEY = '@app_auth_refresh_token';
const USER_KEY = '@app_auth_user';

export const tokenStorage = {
  // Get stored access token
  async getAccessToken(): Promise<string | null> {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      console.log('[TokenStorage] Retrieved token, length:', token.length);
      console.log('[TokenStorage] Token preview:', token.substring(0, 50));
    }
    return token;
  },

  // Get stored refresh token
  async getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Store tokens
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    console.log('[TokenStorage] Storing tokens');
    await AsyncStorage.setItem(TOKEN_KEY, accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  // Clear all tokens
  async clearTokens(): Promise<void> {
    console.log('[TokenStorage] Clearing tokens');
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
  },

  // Store user data
  async setUser(user: any): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Get stored user data
  async getUser(): Promise<any | null> {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },
};
