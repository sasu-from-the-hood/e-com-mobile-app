import { authConfig } from './auth.config';

export const URL = {
  BASE: authConfig.baseURL,
  ORPC: `${authConfig.baseURL}/rpc`,
  BETTER_AUTH: `${authConfig.baseURL}/api/auth`,
  IMAGE: authConfig.ImageUrl,
} as const;

export { authConfig };

