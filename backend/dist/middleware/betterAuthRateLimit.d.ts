import { Context, Next } from 'hono';
export declare const betterAuthRateLimitMiddleware: (c: Context, next: Next) => Promise<(Response & import("hono").TypedResponse<{
    error: string;
    retryAfter: number;
}, 429, "json">) | undefined>;
//# sourceMappingURL=betterAuthRateLimit.d.ts.map