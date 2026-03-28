
export const authConfig = {
  baseURL: 'http://10.208.123.100:3001',
  ImageUrl : 'http://10.208.123.100:3001s',

  otp: {
    length: 6,
    expiresIn: 300,
  },
  
  rateLimit: {
    maxAttempts: 3,
  },
} as const;

export type AuthConfig = typeof authConfig; 