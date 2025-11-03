import 'dotenv/config'
import { config } from './env_config.js' 

export type OtpConfig = {
  enabled: boolean
}

export const otpConfig: OtpConfig = {
  enabled: config.otpEnabled,
}

export const betterauthConfig = {
  otp: otpConfig,
  trustOrgin: config.allowedOrigins,
  rateLimit: {
    window: config.window,
    max: config.max,
  },
}
export type BetterAuthConfig = typeof betterauthConfig



