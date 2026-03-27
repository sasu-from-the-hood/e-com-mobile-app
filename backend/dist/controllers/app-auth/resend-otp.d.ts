import { z } from 'zod';
export declare const resendRegisterOTP: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, z.ZodObject<{
    phoneNumber: z.ZodString;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
    message: string;
    expiresAt: Date;
}, {
    success: boolean;
    message: string;
    expiresAt: Date;
}>, Record<never, never>, Record<never, never>>;
export declare const resendResetPasswordOTP: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, z.ZodObject<{
    phoneNumber: z.ZodString;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
    message: string;
    expiresAt: Date;
}, {
    success: boolean;
    message: string;
    expiresAt: Date;
}>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=resend-otp.d.ts.map