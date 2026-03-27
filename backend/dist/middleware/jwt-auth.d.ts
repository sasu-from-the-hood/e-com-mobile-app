/**
 * JWT Authentication Middleware for mobile app
 * Extracts and verifies JWT token from Authorization header
 */
export declare const jwtAuthMiddleware: import("@orpc/server").DecoratedMiddleware<{
    request?: Request;
} & Record<never, never>, {
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
}, unknown, any, any, Record<never, never>>;
/**
 * JWT Protected Procedure
 * Use this for endpoints that require JWT authentication
 */
export declare const jwtProtectedProcedure: import("@orpc/server").BuilderWithMiddlewares<import("@orpc/server").MergedInitialContext<Record<never, never>, {
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
}>, import("@orpc/contract").Schema<unknown, unknown>, import("@orpc/contract").Schema<unknown, unknown>, Record<never, never>, Record<never, never>>;
//# sourceMappingURL=jwt-auth.d.ts.map