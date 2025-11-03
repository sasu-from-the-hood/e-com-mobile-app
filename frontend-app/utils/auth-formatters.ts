import { AuthErrorCode } from '@/types/auth.types';

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  // Remove non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as +X XXX XXX XXXX
  if (cleaned.startsWith('1') && cleaned.length === 11) {
    return `+1 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  // Default format with country code
  if (cleaned.length >= 10) {
    const countryCode = cleaned.slice(0, -10);
    const areaCode = cleaned.slice(-10, -7);
    const firstPart = cleaned.slice(-7, -4);
    const lastPart = cleaned.slice(-4);
    return `+${countryCode} ${areaCode} ${firstPart} ${lastPart}`;
  }
  
  return phone;
};

// Format error messages
export const formatAuthError = (error: AuthErrorCode): string => {
  const errorMessages: Record<AuthErrorCode, string> = {
    [AuthErrorCode.INVALID_PHONE]: 'Invalid phone number',
    [AuthErrorCode.INVALID_PASSWORD]: 'Invalid password',
    [AuthErrorCode.PHONE_NOT_VERIFIED]: 'Phone number not verified',
    [AuthErrorCode.INVALID_OTP]: 'Invalid verification code',
    [AuthErrorCode.OTP_EXPIRED]: 'Code expired. Please request a new one',
    [AuthErrorCode.TOO_MANY_ATTEMPTS]: 'Too many attempts. Please try again later',
    [AuthErrorCode.NETWORK_ERROR]: 'Network error. Please check your connection'
  };
  
  return errorMessages[error] || 'An error occurred';
};