import { z } from 'zod';
export declare const getCategories: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    isActive: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}[], {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    isActive: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}[]>, Record<never, never>, Record<never, never>>;
export declare const createCategory: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodCustom<import("buffer").File, import("buffer").File>>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    isActive: boolean | null;
    createdAt: Date;
    updatedAt: Date;
} | undefined, {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    isActive: boolean | null;
    createdAt: Date;
    updatedAt: Date;
} | undefined>, Record<never, never>, Record<never, never>>;
export declare const updateCategory: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodCustom<import("buffer").File, import("buffer").File>>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    isActive: boolean | null;
    createdAt: Date;
    updatedAt: Date;
} | undefined, {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    isActive: boolean | null;
    createdAt: Date;
    updatedAt: Date;
} | undefined>, Record<never, never>, Record<never, never>>;
export declare const deleteCategory: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
    id: z.ZodString;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    success: boolean;
}, {
    success: boolean;
}>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=admin-catagores.d.ts.map