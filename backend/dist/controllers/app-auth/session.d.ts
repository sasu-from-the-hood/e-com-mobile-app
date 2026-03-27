import { z } from 'zod';
export declare const getSession: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, z.ZodObject<{
    token: z.ZodString;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
    error: string;
    user?: never;
} | {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        phoneNumberVerified: boolean | null;
        image: string | null;
        role: string | null;
        banned: false | null;
    };
    success?: never;
    error?: never;
}, {
    success: boolean;
    error: string;
    user?: never;
} | {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        phoneNumberVerified: boolean | null;
        image: string | null;
        role: string | null;
        banned: false | null;
    };
    success?: never;
    error?: never;
}>, Record<never, never>, Record<never, never>>;
export declare const refreshToken: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, z.ZodObject<{
    refreshToken: z.ZodString;
}, z.core.$strip>, import("@orpc/contract").Schema<import("../../utils/jwt.js").TokenPair | {
    success: boolean;
    error: string;
}, import("../../utils/jwt.js").TokenPair | {
    success: boolean;
    error: string;
}>, Record<never, never>, Record<never, never>>;
export declare const logout: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
    success: boolean;
    message: string;
}, {
    success: boolean;
    message: string;
}>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=session.d.ts.map