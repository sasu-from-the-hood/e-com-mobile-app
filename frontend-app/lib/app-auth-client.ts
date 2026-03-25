import { orpc } from './orpc-client';
import { getErrorMessage } from '@/utils/error-handler';
import { tokenStorage } from '@/lib/token-storage';

const TOKEN_KEY = '@app_auth_token';
const REFRESH_TOKEN_KEY = '@app_auth_refresh_token';
const USER_KEY = '@app_auth_user';

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  phoneNumberVerified: boolean | null;
  image: string | null;
  role: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

class AppAuthClient {
  // Login with phone number and password
  async login(phoneNumber: string, password: string): Promise<AuthResponse> {
    console.log('[AppAuthClient] Login called for:', phoneNumber);
    const response = await orpc.appLogin({ phoneNumber, password });
    
    // Check if login failed
    if ('success' in response && response.success === false) {
      throw new Error(response.error || 'Login failed');
    }
    
    // Type guard: at this point we know it's a success response
    if (!('user' in response) || !('accessToken' in response) || !('refreshToken' in response)) {
      throw new Error('Invalid response format');
    }
    
    console.log('[AppAuthClient] Login response received:', {
      hasUser: !!response.user,
      hasAccessToken: !!response.accessToken,
      hasRefreshToken: !!response.refreshToken,
      accessTokenPreview: response.accessToken.substring(0, 50),
    });
    
    // Store tokens and user data
    await this.storeAuth(response);
    
    return response;
  }

  // Send OTP for registration
  async sendRegisterOTP(phoneNumber: string, password: string) {
    const response = await orpc.appSendRegisterOTP({ phoneNumber, password });
    
    // Check if failed
    if ('success' in response && response.success === false && 'error' in response) {
      throw new Error(response.error);
    }
    
    return response;
  }

  // Verify OTP and complete registration
  async verifyRegisterOTP(phoneNumber: string, otp: string, password: string, name?: string): Promise<AuthResponse> {
    const response = await orpc.appVerifyRegisterOTP({ phoneNumber, otp, password, name });
    
    // Check if failed
    if ('success' in response && response.success === false) {
      throw new Error(response.error || 'Verification failed');
    }
    
    // Type guard: at this point we know it's a success response
    if (!('user' in response) || !('accessToken' in response) || !('refreshToken' in response)) {
      throw new Error('Invalid response format');
    }
    
    // Store tokens and user data (cast to AuthResponse since backend may not include image)
    await this.storeAuth(response as AuthResponse);
    
    return response as AuthResponse;
  }

  // Resend OTP for registration
  async resendRegisterOTP(phoneNumber: string) {
    const response = await orpc.appResendRegisterOTP({ phoneNumber });
    
    // Check if failed
    if ('success' in response && response.success === false && 'error' in response) {
      throw new Error(String(response.error));
    }
    
    return response;
  }

  // Resend OTP for password reset
  async resendResetPasswordOTP(phoneNumber: string) {
    const response = await orpc.appResendResetPasswordOTP({ phoneNumber });
    
    // Check if failed
    if ('success' in response && response.success === false && 'error' in response) {
      throw new Error(String(response.error));
    }
    
    return response;
  }

  // Send OTP for password reset
  async sendResetPasswordOTP(phoneNumber: string) {
    const response = await orpc.appSendResetPasswordOTP({ phoneNumber });
    
    // Check if failed - handle both error formats
    if ('success' in response && response.success === false && 'error' in response) {
      throw new Error(String(response.error));
    }
    
    return response;
  }

  // Verify reset password OTP
  async verifyResetPasswordOTP(phoneNumber: string, otp: string) {
    const response = await orpc.appVerifyResetPasswordOTP({ phoneNumber, otp });
    
    // Check if failed - handle both error formats
    if ('success' in response && response.success === false && 'error' in response) {
      throw new Error(response.error);
    }
    
    return response;
  }

  // Reset password
  async resetPassword(phoneNumber: string, otp: string, newPassword: string) {
    const response = await orpc.appResetPassword({ phoneNumber, otp, newPassword });
    
    // Check if failed
    if ('success' in response && response.success === false && 'error' in response) {
      throw new Error(response.error);
    }
    
    return response;
  }

  // Get current session
  async getSession(): Promise<User | null> {
    try {
      const token = await this.getAccessToken();
      if (!token) return null;

      const response = await orpc.appGetSession({ token });
      
      // Check if failed
      if ('success' in response && response.success === false) {
        // Token is invalid, clear all auth and return null
        console.log('[AppAuthClient] Invalid token, clearing auth');
        await this.clearAuth();
        return null;
      }
      
      // Update stored user data if user exists
      if (response.user) {
        await tokenStorage.setUser(response.user);
        return response.user;
      }
      
      return null;
    } catch (error) {
      // Any error means invalid auth, clear it
      console.log('[AppAuthClient] Session error, clearing auth:', error);
      await this.clearAuth();
      return null;
    }
  }

  // Refresh access token
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) return false;

      const response = await orpc.appRefreshToken({ refreshToken });
      
      // Check if failed
      if ('success' in response && response.success === false && 'error' in response) {
        // Refresh token is invalid, clear auth
        console.log('[AppAuthClient] Invalid refresh token, clearing auth');
        await this.clearAuth();
        return false;
      }
      
      // Type guard: if we get here and have accessToken, it's a success response
      if ('accessToken' in response && 'refreshToken' in response) {
        // Store new tokens
        await tokenStorage.setTokens(response.accessToken, response.refreshToken);
        return true;
      }
      
      return false;
    } catch (error) {
      // Refresh failed, clear auth
      console.log('[AppAuthClient] Refresh error, clearing auth:', error);
      await this.clearAuth();
      return false;
    }
  }

  // Logout
  async logout() {
    try {
      await orpc.appLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await this.clearAuth();
    }
  }

  // Delete account
  async deleteAccount(password: string) {
    try {
      // JWT middleware handles authentication, no need to pass token
      await orpc.appDeleteAccount({ password, confirmation: 'DELETE' });
      await this.clearAuth();
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  // Get profile
  async getProfile() {
    const response = await orpc.appGetProfile();
    
    // Check if failed
    if ('success' in response && response.success === false && 'error' in response) {
      throw new Error(String(response.error));
    }
    
    return response.user;
  }

  // Update profile
  async updateProfile(updates: { name?: string; email?: string; image?: string }) {
    const response = await orpc.appUpdateProfile(updates);

    // Check if failed
    if ('success' in response && response.success === false && 'error' in response) {
      throw new Error(response.error);
    }

    // Update stored user data
    if (response.user) {
      await tokenStorage.setUser(response.user);
    }

    return response.user;
  }

  // Get stored access token
  async getAccessToken(): Promise<string | null> {
    return tokenStorage.getAccessToken();
  }

  // Get stored refresh token
  async getRefreshToken(): Promise<string | null> {
    return tokenStorage.getRefreshToken();
  }

  // Get stored user data
  async getStoredUser(): Promise<User | null> {
    return tokenStorage.getUser();
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await tokenStorage.getAccessToken();
    return !!token;
  }

  // Store auth data
  private async storeAuth(response: AuthResponse) {
    console.log('[AppAuthClient] Storing auth - Access token length:', response.accessToken.length);
    console.log('[AppAuthClient] Storing auth - Access token preview:', response.accessToken.substring(0, 50));
    await tokenStorage.setTokens(response.accessToken, response.refreshToken);
    await tokenStorage.setUser(response.user);
    console.log('[AppAuthClient] Auth stored successfully');
  }

  // Clear all auth data
  private async clearAuth() {
    await tokenStorage.clearTokens();
  }
}

export const appAuthClient = new AppAuthClient();
