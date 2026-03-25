import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { RouterClient } from '@orpc/server';
import { URL } from '@/config';
import { tokenStorage } from '@/lib/token-storage';
import type { AppRouter } from '../../backend/src/routes/_app';

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

// Helper function to decode JWT and check expiration
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp;
    
    if (!exp) return true;
    
    // Check if token expires in the next 30 seconds (buffer time)
    const now = Math.floor(Date.now() / 1000);
    return exp < (now + 30);
  } catch (error) {
    console.error('[ORPC] Error checking token expiration:', error);
    return true;
  }
}

// Function to refresh token directly without circular dependency
async function refreshTokenDirect(): Promise<boolean> {
  try {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) return false;

    const response = await fetch(`${URL.ORPC}/appRefreshToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.log('[ORPC] Refresh token request failed');
      await tokenStorage.clearTokens();
      return false;
    }

    const data = await response.json();
    
    // Check if failed
    if ('success' in data && data.success === false) {
      console.log('[ORPC] Invalid refresh token, clearing auth');
      await tokenStorage.clearTokens();
      return false;
    }
    
    // Type guard: if we have accessToken, it's a success response
    if ('accessToken' in data && 'refreshToken' in data) {
      await tokenStorage.setTokens(data.accessToken, data.refreshToken);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[ORPC] Refresh error:', error);
    await tokenStorage.clearTokens();
    return false;
  }
}

const link = new RPCLink({
  url: URL.ORPC,
  headers: async () => {
    const headers: Record<string, string> = {};
    
    try {
      // If token is being refreshed, wait for it
      if (isRefreshing && refreshPromise) {
        console.log('[ORPC] Waiting for ongoing token refresh');
        await refreshPromise;
      }

      // Get access token from storage
      let token = await tokenStorage.getAccessToken();
      
      // Check if token is expired or about to expire
      if (token && isTokenExpired(token)) {
        console.log('[ORPC] Token expired or expiring soon, refreshing proactively');
        
        // Only refresh if not already refreshing
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshTokenDirect();
          
          try {
            const refreshed = await refreshPromise;
            
            if (refreshed) {
              console.log('[ORPC] Token refreshed successfully');
              // Get the new token
              token = await tokenStorage.getAccessToken();
            } else {
              console.log('[ORPC] Token refresh failed');
              token = null;
            }
          } catch (error) {
            console.error('[ORPC] Error during proactive token refresh:', error);
            token = null;
          } finally {
            isRefreshing = false;
            refreshPromise = null;
          }
        }
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('[ORPC] Error getting auth token:', error);
    }

    return headers;
  },
  fetch: async (url, init) => {
    const response = await fetch(url, init);
    
    // If we still get a 401 after proactive refresh, try one more time
    if (response.status === 401 && !isRefreshing) {
      console.log('[ORPC] Got 401 despite proactive refresh, attempting one more refresh');
      
      isRefreshing = true;
      refreshPromise = refreshTokenDirect();
      
      try {
        const refreshed = await refreshPromise;
        
        if (refreshed) {
          console.log('[ORPC] Token refreshed successfully, retrying request');
          
          // Get new token and retry the request
          const newToken = await tokenStorage.getAccessToken();
          if (newToken && init) {
            // Create new init with updated headers
            const newInit: RequestInit = {
              ...init,
              headers: {
                ...((init as any).headers || {}),
                'Authorization': `Bearer ${newToken}`
              }
            };
            
            // Retry the original request with new token
            const retryResponse = await fetch(url, newInit);
            return retryResponse;
          }
        } else {
          console.log('[ORPC] Token refresh failed, user needs to re-login');
        }
      } catch (error) {
        console.error('[ORPC] Error during fallback token refresh:', error);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }
    
    return response;
  }
});

export const orpcClient: RouterClient<AppRouter> = createORPCClient(link);
export const orpc = orpcClient; // Alias for convenience
