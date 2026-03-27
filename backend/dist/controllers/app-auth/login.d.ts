import { z } from 'zod';
export declare const login: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, z.ZodObject<{
    phoneNumber: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
    error: string;
} | {
    accessToken: string;
    refreshToken: string;
    success: boolean;
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        phoneNumberVerified: boolean | null;
        image: string | null;
        role: string | null;
    };
    error?: never;
}, {
    success: boolean;
    error: string;
} | {
    accessToken: string;
    refreshToken: string;
    success: boolean;
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        phoneNumberVerified: boolean | null;
        image: string | null;
        role: string | null;
    };
    error?: never;
}>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=login.d.ts.map