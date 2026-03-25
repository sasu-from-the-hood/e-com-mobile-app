import fs from 'fs/promises';
import path from 'path';

const ERRORS_DIR = path.resolve(process.cwd(), 'logs', 'errors');
const errorCache = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

async function ensureErrorsDirExists(): Promise<void> {
  try {
    await fs.mkdir(ERRORS_DIR, { recursive: true });
  } catch {}
}

function shouldNotify(errorKey: string): boolean {
  const now = Date.now();
  const lastNotified = errorCache.get(errorKey);
  
  if (!lastNotified || now - lastNotified > RATE_LIMIT_WINDOW) {
    errorCache.set(errorKey, now);
    return true;
  }
  
  return false;
}

function getErrorKey(message: string): string {
  return message.substring(0, 100);
}

/**
 * Save error to a dedicated errors file for easy monitoring
 */
export async function notifyError(
  errorMessage: string,
  errorMeta?: Record<string, unknown>
): Promise<void> {
  try {
    const errorKey = getErrorKey(errorMessage);
    
    if (!shouldNotify(errorKey)) {
      console.log('[ErrorNotifier] Rate limit: Error notification skipped (recently notified)');
      return;
    }

    await ensureErrorsDirExists();

    const errorData = {
      timestamp: new Date().toISOString(),
      message: errorMessage,
      meta: errorMeta,
      environment: process.env.NODE_ENV || 'unknown',
      notified: true,
    };

    // Save to daily error file
    const dateStamp = new Date().toISOString().split('T')[0];
    const errorFilePath = path.join(ERRORS_DIR, `errors-${dateStamp}.json`);
    
    // Read existing errors
    let errors: any[] = [];
    try {
      const content = await fs.readFile(errorFilePath, 'utf-8');
      errors = JSON.parse(content);
    } catch {
      // File doesn't exist yet
    }

    // Add new error
    errors.push(errorData);

    // Write back
    await fs.writeFile(errorFilePath, JSON.stringify(errors, null, 2));

    console.log(`[ErrorNotifier] ⚠️  ERROR LOGGED: ${errorMessage}`);
    console.log(`[ErrorNotifier] 📁 Saved to: ${errorFilePath}`);
    
    const devEmails = process.env.DEV_EMAIL 
      ? process.env.DEV_EMAIL.split(',').map(e => e.trim()).filter(e => e).join(', ')
      : 'not configured';
    console.log(`[ErrorNotifier] 📧 Email notification to: ${devEmails}`);
    
    // Try to send email if configured (non-blocking)
    if (process.env.DEV_EMAIL && process.env.EMAIL_FROM && process.env.EMAIL_PASSWORD) {
      // Import dynamically to avoid blocking
      import('./email.js').then(({ sendErrorEmail }) => {
        sendErrorEmail(errorMessage, errorMeta).catch(err => {
          console.error('[ErrorNotifier] Email send failed (continuing anyway):', err.message);
        });
      }).catch(() => {
        console.log('[ErrorNotifier] Email module not available');
      });
    } else {
      console.log('[ErrorNotifier] Email not configured - error saved to file only');
    }

  } catch (error) {
    console.error('[ErrorNotifier] Failed to save error notification:', error);
  }
}
