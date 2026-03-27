import { os } from '@orpc/server';
import { z } from 'zod';
import { logger } from '../../utils/logger.js';
import { createOTP } from '../../utils/otp.js';
// Resend OTP for registration
export const resendRegisterOTP = os
    .input(z.object({
    phoneNumber: z.string().min(10),
}))
    .handler(async ({ input }) => {
    const { phoneNumber } = input;
    console.log('[ResendOTP] Resend registration OTP for phone:', phoneNumber);
    logger.info(`[ResendOTP] Resend registration OTP for phone: ${phoneNumber}`);
    // Create and send new OTP
    const { expiresAt } = await createOTP({
        phoneNumber,
        type: 'register',
    });
    console.log('[ResendOTP] New OTP sent to', phoneNumber, 'expires at', expiresAt);
    logger.info(`[ResendOTP] New OTP sent to ${phoneNumber}, expires at ${expiresAt}`);
    return {
        success: true,
        message: 'OTP resent successfully',
        expiresAt,
    };
});
// Resend OTP for password reset
export const resendResetPasswordOTP = os
    .input(z.object({
    phoneNumber: z.string().min(10),
}))
    .handler(async ({ input }) => {
    const { phoneNumber } = input;
    console.log('[ResendOTP] Resend password reset OTP for phone:', phoneNumber);
    logger.info(`[ResendOTP] Resend password reset OTP for phone: ${phoneNumber}`);
    // Create and send new OTP
    const { expiresAt } = await createOTP({
        phoneNumber,
        type: 'reset-password',
    });
    console.log('[ResendOTP] New OTP sent to', phoneNumber, 'expires at', expiresAt);
    logger.info(`[ResendOTP] New OTP sent to ${phoneNumber}, expires at ${expiresAt}`);
    return {
        success: true,
        message: 'OTP resent successfully',
        expiresAt,
    };
});
//# sourceMappingURL=resend-otp.js.map