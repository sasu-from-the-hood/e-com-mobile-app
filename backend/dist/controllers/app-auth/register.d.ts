import { z } from 'zod';
export declare const sendRegisterOTP: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, z.ZodObject<{
    phoneNumber: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
    error: string;
    message?: never;
    expiresAt?: never;
} | {
    success: boolean;
    message: string;
    expiresAt: Date;
    error?: never;
}, {
    success: boolean;
    error: string;
    message?: never;
    expiresAt?: never;
} | {
    success: boolean;
    message: string;
    expiresAt: Date;
    error?: never;
}>, Record<never, never>, Record<never, never>>;
export declare const verifyRegisterOTP: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, z.ZodObject<{
    phoneNumber: z.ZodString;
    otp: z.ZodString;
    password: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
    error: string;
} | {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string;
        phoneNumberVerified: boolean;
        role: string;
    };
    success?: never;
    error?: never;
}, {
    success: boolean;
    error: string;
} | {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string;
        phoneNumberVerified: boolean;
        role: string;
    };
    success?: never;
    error?: never;
}>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=register.d.ts.map