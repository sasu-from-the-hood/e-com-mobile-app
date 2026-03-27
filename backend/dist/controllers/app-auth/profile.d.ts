import { z } from 'zod';
export declare const uploadAvatar: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
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
}>, z.ZodAny, import("@orpc/contract").Schema<{
    success: boolean;
    error: string;
    imageUrl?: never;
} | {
    success: boolean;
    imageUrl: string;
    error?: never;
}, {
    success: boolean;
    error: string;
    imageUrl?: never;
} | {
    success: boolean;
    imageUrl: string;
    error?: never;
}>, Record<never, never>, Record<never, never>>;
export declare const updateProfile: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
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
}>, z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
    error: string;
    message?: never;
    user?: never;
} | {
    success: boolean;
    message: string;
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
    message?: never;
    user?: never;
} | {
    success: boolean;
    message: string;
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
export declare const getProfile: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
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
}>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
    success: boolean;
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
}, {
    success: boolean;
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
}>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=profile.d.ts.map