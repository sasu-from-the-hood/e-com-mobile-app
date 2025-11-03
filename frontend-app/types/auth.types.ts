// Auth-related enums
export enum AuthScreen {
  LOGIN = 'login',
  SIGNUP = 'signup',
  OTP_VERIFICATION = 'otp-verification',
  FORGOT_PASSWORD = 'forgot-password',
  RESET_PASSWORD = 'reset-password'
}

export enum OTPPurpose {
  SIGNUP = 'signup',
  PASSWORD_RESET = 'password_reset',
  PHONE_UPDATE = 'phone_update'
}

export enum AuthErrorCode {
  INVALID_PHONE = 'INVALID_PHONE',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  PHONE_NOT_VERIFIED = 'PHONE_NOT_VERIFIED',
  INVALID_OTP = 'INVALID_OTP',
  OTP_EXPIRED = 'OTP_EXPIRED',
  TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

// User types
export interface User {
  id: string;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Session types
export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
  token: string;
}

// Auth state types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
}