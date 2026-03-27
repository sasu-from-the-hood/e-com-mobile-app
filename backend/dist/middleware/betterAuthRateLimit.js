import { betterauthConfig } from '../config/betterauth_config.js';
const store = {};
export const betterAuthRateLimitMiddleware = async (c, next) => {
    const key = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    const now = Date.now();
    const windowMs = betterauthConfig.rateLimit.window * 1000;
    const max = betterauthConfig.rateLimit.max;
    if (store[key] && now > store[key].resetTime) {
        delete store[key];
    }
    if (!store[key]) {
        store[key] = {
            count: 1,
            resetTime: now + windowMs
        };
    }
    else {
        store[key].count++;
    }
    if (store[key].count > max) {
        return c.json({
            error: 'Too many requests',
            retryAfter: Math.ceil((store[key].resetTime - now) / 1000)
        }, 429);
    }
    c.res.headers.set('X-RateLimit-Limit', max.toString());
    c.res.headers.set('X-RateLimit-Remaining', Math.max(0, max - store[key].count).toString());
    c.res.headers.set('X-RateLimit-Reset', new Date(store[key].resetTime).toISOString());
    await next();
};
//# sourceMappingURL=betterAuthRateLimit.js.map