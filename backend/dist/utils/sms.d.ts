interface AfroSMSResponse {
    success: boolean;
    message: string;
    data?: any;
}
/**
 * Send SMS using AfroMessage API
 * Documentation: https://www.afromessage.com/api
 * API Format: GET https://api.afromessage.com/api/send?to={RECIPIENT}&message={MESSAGE}&sender={SENDER_NAME}
 * Authorization: Bearer token in header
 */
export declare function sendSMS(phoneNumber: string, message: string): Promise<AfroSMSResponse>;
/**
 * Send OTP SMS
 */
export declare function sendOTPSMS(phoneNumber: string, otp: string): Promise<AfroSMSResponse>;
/**
 * Send welcome SMS
 */
export declare function sendWelcomeSMS(phoneNumber: string, name: string): Promise<AfroSMSResponse>;
/**
 * Send password reset OTP SMS
 */
export declare function sendPasswordResetOTPSMS(phoneNumber: string, otp: string): Promise<AfroSMSResponse>;
export {};
//# sourceMappingURL=sms.d.ts.map