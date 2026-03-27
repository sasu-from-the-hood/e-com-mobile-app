export declare const authMiddleware: import("@orpc/server").DecoratedMiddleware<{
    request?: Request;
} & Record<never, never>, {
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
}, unknown, any, any, Record<never, never>>;
//# sourceMappingURL=auth.d.ts.map