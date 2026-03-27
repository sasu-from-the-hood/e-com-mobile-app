export declare const publicProcedure: import("@orpc/server").Builder<Record<never, never>, Record<never, never>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<unknown, unknown>, Record<never, never>, Record<never, never>>;
export declare const protectedProcedure: import("@orpc/server").BuilderWithMiddlewares<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<unknown, unknown>, Record<never, never>, Record<never, never>>;
export declare const adminProcedure: import("@orpc/server").BuilderWithMiddlewares<import("@orpc/server").MergedInitialContext<import("@orpc/server").MergedInitialContext<Record<never, never>, Record<never, never>, Record<never, never>>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>>, import("@orpc/server").MergedCurrentContext<import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>, import("@orpc/server").MergedCurrentContext<Record<never, never>, {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        banned: boolean | null | undefined;
        role?: string | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    };
}>>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<unknown, unknown>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=orpc.d.ts.map