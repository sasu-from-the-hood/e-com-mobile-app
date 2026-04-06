const isDev = true 
export const authConfig = {
  baseURL: isDev ? 'http://10.150.154.100:3000' : "https://one.solvesphr.com",
  ImageUrl : isDev ?  'http://10.150.154.100:3000' : "https://one.solvesphr.com/",

  otp: {
    length: 6,
    expiresIn: 300,
  },
  
  rateLimit: {
    maxAttempts: 3,
  },
} as const;

export type AuthConfig = typeof authConfig; 