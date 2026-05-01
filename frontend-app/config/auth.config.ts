import Constants from 'expo-constants';

const isDev = false;

function getDevHost(): string {
  // Try all known Expo Constants locations for the Metro host
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest?.debuggerHost ||
    (Constants as any).manifest2?.extra?.expoClient?.hostUri ||
    (Constants as any).expoGoConfig?.debuggerHost;

  if (hostUri) {
    // hostUri is like "192.168.1.5:8081" — strip the port
    const host = hostUri.split(':')[0];
    console.log('[AuthConfig] Detected host from Expo:', host);
    return host;
  }

  const fallbackHost = '10.73.50.100';
  console.log('[AuthConfig] Using fallback host:', fallbackHost);
  return fallbackHost;
}

const devBase = isDev ? `http://${getDevHost()}:3001` : '';

console.log('[AuthConfig] Base URL:', isDev ? devBase : 'https://one.solvesphr.com');

export const authConfig = {
  baseURL: isDev ? devBase : 'https://one.solvesphr.com',
  ImageUrl: isDev ? devBase : 'https://one.solvesphr.com/',
  otp: {
    length: 6,
    expiresIn: 300,
  },
  rateLimit: {
    maxAttempts: 3,
  },
} as const;

export type AuthConfig = typeof authConfig;
