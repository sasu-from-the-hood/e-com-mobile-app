import { z } from 'zod';
export declare const getAppSettings: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<Record<string, string>, Record<string, string>>, Record<never, never>, Record<never, never>>;
export declare const adminGetAppSettings: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        email: string;
        name?: string;
        role?: string;
        emailVerified?: boolean;
    };
    session: {
        id: string;
        userId: string;
        expiresAt: Date;
    } | undefined;
    role: string | undefined;
}>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<{
    id: string;
    key: string;
    value: string;
    description: string | null;
    updatedAt: Date;
}[], {
    id: string;
    key: string;
    value: string;
    description: string | null;
    updatedAt: Date;
}[]>, Record<never, never>, Record<never, never>>;
export declare const updateAppSetting: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        email: string;
        name?: string;
        role?: string;
        emailVerified?: boolean;
    };
    session: {
        id: string;
        userId: string;
        expiresAt: Date;
    } | undefined;
    role: string | undefined;
}>, z.ZodObject<{
    key: z.ZodString;
    value: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    id: string;
    key: string;
    value: string;
    description: string | null;
    updatedAt: Date;
} | undefined, {
    id: string;
    key: string;
    value: string;
    description: string | null;
    updatedAt: Date;
} | undefined>, Record<never, never>, Record<never, never>>;
export declare const bulkUpdateAppSettings: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        email: string;
        name?: string;
        role?: string;
        emailVerified?: boolean;
    };
    session: {
        id: string;
        userId: string;
        expiresAt: Date;
    } | undefined;
    role: string | undefined;
}>, z.ZodRecord<z.ZodString, z.ZodString>, import("@orpc/contract").Schema<{
    success: boolean;
}, {
    success: boolean;
}>, Record<never, never>, Record<never, never>>;
export declare const deleteAppSetting: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
    request?: Request;
} & Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        email: string;
        name?: string;
        role?: string;
        emailVerified?: boolean;
    };
    session: {
        id: string;
        userId: string;
        expiresAt: Date;
    } | undefined;
    role: string | undefined;
}>, z.ZodObject<{
    key: z.ZodString;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
}, {
    success: boolean;
}>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=app-settings.d.ts.map