import { z } from 'zod';
export declare const getHelpArticles: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    id: string;
    title: string;
    content: string;
    category: string;
    image: string | null;
    order: number | null;
    isActive: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}[], {
    id: string;
    title: string;
    content: string;
    category: string;
    image: string | null;
    order: number | null;
    isActive: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}[]>, Record<never, never>, Record<never, never>>;
export declare const getHelpArticle: import("@orpc/server").DecoratedProcedure<Record<never, never>, Record<never, never>, z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    id: string;
    title: string;
    content: string;
    category: string;
    image: string | null;
    order: number | null;
    isActive: boolean | null;
    createdAt: Date;
    updatedAt: Date;
} | null, {
    id: string;
    title: string;
    content: string;
    category: string;
    image: string | null;
    order: number | null;
    isActive: boolean | null;
    createdAt: Date;
    updatedAt: Date;
} | null>, Record<never, never>, Record<never, never>>;
export declare const adminGetHelpArticles: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
    title: string;
    content: string;
    category: string;
    image: string | null;
    order: number | null;
    isActive: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}[], {
    id: string;
    title: string;
    content: string;
    category: string;
    image: string | null;
    order: number | null;
    isActive: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}[]>, Record<never, never>, Record<never, never>>;
export declare const createHelpArticle: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
    title: z.ZodString;
    content: z.ZodString;
    category: z.ZodString;
    image: z.ZodOptional<z.ZodAny>;
    order: z.ZodDefault<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    id: string;
    title: string;
    content: string;
    category: string;
    image: string | null;
    order: number | null;
    isActive: boolean | null;
    createdAt: Date;
    updatedAt: Date;
} | undefined, {
    id: string;
    title: string;
    content: string;
    category: string;
    image: string | null;
    order: number | null;
    isActive: boolean | null;
    createdAt: Date;
    updatedAt: Date;
} | undefined>, Record<never, never>, Record<never, never>>;
export declare const updateHelpArticle: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodAny>;
    order: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>, import("@orpc/contract").Schema<{
    id: string;
    title: string;
    content: string;
    category: string;
    image: string | null;
    order: number | null;
    isActive: boolean | null;
    createdAt: Date;
    updatedAt: Date;
} | undefined, {
    id: string;
    title: string;
    content: string;
    category: string;
    image: string | null;
    order: number | null;
    isActive: boolean | null;
    createdAt: Date;
    updatedAt: Date;
} | undefined>, Record<never, never>, Record<never, never>>;
export declare const deleteHelpArticle: import("@orpc/server").DecoratedProcedure<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
//# sourceMappingURL=help-articles.d.ts.map