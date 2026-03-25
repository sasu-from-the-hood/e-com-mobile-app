import { showToast } from '@/utils/toast';

/**
 * Extract error message from various error formats
 * Handles ORPC errors, standard errors, and string errors
 */
export function getErrorMessage(error: any, showToastNotification: boolean = false): string {
  console.log('[ErrorHandler] Processing error:', error);
  console.log('[ErrorHandler] Error type:', typeof error);
  console.log('[ErrorHandler] Error keys:', Object.keys(error || {}));
  
  let message = '';
  
  // If it's a string, return it
  if (typeof error === 'string') {
    message = error;
  }
  // If it's null or undefined
  else if (!error) {
    message = 'An unknown error occurred';
  }
  else {
    // Try various error message locations
    const possibleMessages = [
      error.message,
      error.data?.message,
      error.error?.message,
      error.response?.data?.message,
      error.body?.message,
      error.cause?.message,
      // ORPC specific formats
      error.issues?.[0]?.message,
      error.code,
    ];

    for (const msg of possibleMessages) {
      if (msg && typeof msg === 'string') {
        console.log('[ErrorHandler] Found message:', msg);
        message = msg;
        break;
      }
    }

    // If no message found, try toString
    if (!message) {
      const stringified = String(error);
      if (stringified && stringified !== '[object Object]') {
        console.log('[ErrorHandler] Using stringified:', stringified);
        message = stringified;
      } else {
        console.log('[ErrorHandler] Using fallback message');
        message = 'An unexpected error occurred';
      }
    }
  }

  // Show toast if requested
  if (showToastNotification) {
    showToast('error', message);
  }

  return message;
}
