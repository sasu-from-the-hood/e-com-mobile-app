import { config } from '../config/env_config.js';
import { logger } from './logger.js';
import { db } from '../database/db.js';
import { appSettings } from '../database/schema/index.js';
import { eq } from 'drizzle-orm';
/**
 * Get app name from database
 */
async function getAppName() {
    try {
        const [setting] = await db
            .select()
            .from(appSettings)
            .where(eq(appSettings.key, 'app_name'))
            .limit(1);
        return setting?.value || 'MyApp';
    }
    catch (error) {
        logger.error('[SMS] Error fetching app name:', error);
        return 'MyApp';
    }
}
/**
 * Send SMS using AfroMessage API
 * Documentation: https://www.afromessage.com/api
 * API Format: GET https://api.afromessage.com/api/send?to={RECIPIENT}&message={MESSAGE}&sender={SENDER_NAME}
 * Authorization: Bearer token in header
 */
export async function sendSMS(phoneNumber, message) {
    try {
        // Skip SMS in development if not configured
        if (config.nodeEnv === 'development' && !config.afrosms.apiKey) {
            logger.info(`[SMS] Development mode - SMS not sent to ${phoneNumber}: ${message}`);
            return {
                success: true,
                message: 'SMS skipped in development mode',
            };
        }
        // Validate configuration
        if (!config.afrosms.apiKey) {
            logger.error('[SMS] AfroMessage not configured - missing API key');
            return {
                success: false,
                message: 'SMS service not configured',
            };
        }
        // Format phone number (remove + and spaces)
        const formattedPhone = phoneNumber.replace(/[\s+]/g, '');
        // Build URL with query parameters (GET request)
        const url = new URL(config.afrosms.baseUrl);
        url.searchParams.append('to', formattedPhone);
        url.searchParams.append('message', message);
        // Add sender if provided (optional)
        if (config.afrosms.senderId) {
            url.searchParams.append('sender', config.afrosms.senderId);
        }
        logger.info(`[SMS] Sending SMS to ${formattedPhone}`);
        logger.info(`[SMS] Sender ID: ${config.afrosms.senderId || 'Not set (using default)'}`);
        // Send GET request to AfroMessage with Bearer token
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${config.afrosms.apiKey}`,
            },
        });
        const responseText = await response.text();
        logger.info(`[SMS] Response status: ${response.status}`);
        logger.info(`[SMS] Response body: ${responseText}`);
        // Try to parse as JSON, fallback to text
        let data;
        try {
            data = JSON.parse(responseText);
        }
        catch {
            data = { response: responseText };
        }
        if (!response.ok) {
            logger.error('[SMS] AfroMessage API error:', {
                status: response.status,
                data,
            });
            return {
                success: false,
                message: data.message || responseText || 'Failed to send SMS',
                data,
            };
        }
        logger.info('[SMS] SMS sent successfully:', {
            phone: formattedPhone,
            response: data,
        });
        return {
            success: true,
            message: 'SMS sent successfully',
            data,
        };
    }
    catch (error) {
        logger.error('[SMS] Error sending SMS:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
/**
 * Send OTP SMS
 */
export async function sendOTPSMS(phoneNumber, otp) {
    const appName = await getAppName();
    const message = `Your ${appName} verification code is: ${otp}. Valid for 10 minutes. Do not share this code with anyone.`;
    // Log OTP to console for development
    console.log('='.repeat(50));
    console.log(`[OTP] Phone: ${phoneNumber}`);
    console.log(`[OTP] Code: ${otp}`);
    console.log(`[OTP] Message: ${message}`);
    console.log('='.repeat(50));
    logger.info(`[OTP] Generated OTP for ${phoneNumber}: ${otp}`);
    return sendSMS(phoneNumber, message);
}
/**
 * Send welcome SMS
 */
export async function sendWelcomeSMS(phoneNumber, name) {
    const appName = await getAppName();
    const message = `Welcome to ${appName}, ${name}! Your account has been created successfully. Start shopping now.`;
    console.log(`[SMS] Welcome message for ${name}: ${message}`);
    return sendSMS(phoneNumber, message);
}
/**
 * Send password reset OTP SMS
 */
export async function sendPasswordResetOTPSMS(phoneNumber, otp) {
    const appName = await getAppName();
    const message = `Your ${appName} password reset code is: ${otp}. Valid for 10 minutes. If you didn't request this, please ignore.`;
    // Log OTP to console for development
    console.log('='.repeat(50));
    console.log(`[PASSWORD RESET OTP] Phone: ${phoneNumber}`);
    console.log(`[PASSWORD RESET OTP] Code: ${otp}`);
    console.log(`[PASSWORD RESET OTP] Message: ${message}`);
    console.log('='.repeat(50));
    logger.info(`[PASSWORD RESET OTP] Generated OTP for ${phoneNumber}: ${otp}`);
    return sendSMS(phoneNumber, message);
}
//# sourceMappingURL=sms.js.map