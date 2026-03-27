import { os } from '@orpc/server';
import { z } from 'zod';
import { db } from '../../database/db.js';
import { user } from '../../database/schema/auth-schema.js';
import { eq } from 'drizzle-orm';
import { verifyToken, verifyRefreshToken, generateTokenPair } from '../../utils/jwt.js';
import { logger } from '../../utils/logger.js';
// Get current session
export const getSession = os
    .input(z.object({
    token: z.string(),
}))
    .handler(async ({ input }) => {
    const { token } = input;
    // Verify token
    const payload = await verifyToken(token);
    if (!payload) {
        return {
            success: false,
            error: 'Invalid or expired token',
        };
    }
    // Get fresh user data
    const [currentUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, payload.userId))
        .limit(1);
    if (!currentUser) {
        return {
            success: false,
            error: 'User not found',
        };
    }
    // Check if user is banned
    if (currentUser.banned) {
        return {
            success: false,
            error: 'Account suspended',
        };
    }
    return {
        user: {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            phoneNumber: currentUser.phoneNumber,
            phoneNumberVerified: currentUser.phoneNumberVerified,
            image: currentUser.image,
            role: currentUser.role,
            banned: currentUser.banned,
        },
    };
});
// Refresh access token
export const refreshToken = os
    .input(z.object({
    refreshToken: z.string(),
}))
    .handler(async ({ input }) => {
    const { refreshToken } = input;
    logger.info('[Session] Refresh token request');
    // Verify refresh token
    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
        logger.warn('[Session] Invalid refresh token');
        return {
            success: false,
            error: 'Invalid or expired refresh token',
        };
    }
    // Get user data
    const [currentUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, payload.userId))
        .limit(1);
    if (!currentUser) {
        logger.warn(`[Session] User not found: ${payload.userId}`);
        return {
            success: false,
            error: 'User not found',
        };
    }
    // Check if user is banned
    if (currentUser.banned) {
        logger.warn(`[Session] Banned user attempted refresh: ${currentUser.id}`);
        return {
            success: false,
            error: 'Account suspended',
        };
    }
    // Generate new token pair
    const tokens = await generateTokenPair({
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
        role: currentUser.role || 'user',
        phoneNumber: currentUser.phoneNumber || '',
        phoneNumberVerified: currentUser.phoneNumberVerified || false,
        banned: currentUser.banned || false,
    });
    logger.info(`[Session] Tokens refreshed for user: ${currentUser.id}`);
    return tokens;
});
// Logout (client-side token deletion, no server action needed)
export const logout = os
    .handler(async () => {
    // In JWT-based auth, logout is handled client-side by deleting tokens
    // This endpoint exists for consistency and future server-side session management
    logger.info('[Session] Logout request');
    return {
        success: true,
        message: 'Logged out successfully',
    };
});
//# sourceMappingURL=session.js.map