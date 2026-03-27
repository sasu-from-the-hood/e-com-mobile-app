import { z } from 'zod';
export declare const sendResetPasswordOTP: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, z.ZodObject<{
    phoneNumber: z.ZodString;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
    message: string;
    expiresAt?: never;
} | {
    success: boolean;
    message: string;
    expiresAt: Date;
}, {
    success: boolean;
    message: string;
    expiresAt?: never;
} | {
    success: boolean;
    message: string;
    expiresAt: Date;
}>, Record<never, never>, Record<never, never>>;
export declare const verifyResetPasswordOTP: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, z.ZodObject<{
    phoneNumber: z.ZodString;
    otp: z.ZodString;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
    error: string;
    message?: never;
} | {
    success: boolean;
    message: string;
    error?: never;
}, {
    success: boolean;
    error: string;
    message?: never;
} | {
    success: boolean;
    message: string;
    error?: never;
}>, Record<never, never>, Record<never, never>>;
export declare const resetPassword: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, z.ZodObject<{
    phoneNumber: z.ZodString;
    otp: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
    error: string;
    message?: never;
} | {
    success: boolean;
    message: string;
    error?: never;
}, {
    success: boolean;
    error: string;
    message?: never;
} | {
    success: boolean;
    message: string;
    error?: never;
}>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=forgot-password.d.ts.map