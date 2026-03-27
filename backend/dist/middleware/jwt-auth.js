import { os, ORPCError } from '@orpc/server';
import { verifyToken } from '../utils/jwt.js';
import { db } from '../database/db.js';
import { user } from '../database/schema/auth-schema.js';
import { eq } from 'drizzle-orm';
/**
 * JWT Authentication Middleware for mobile app
 * Extracts and verifies JWT token from Authorization header
 */
export const jwtAuthMiddleware = os
    .$context()
    .middleware(async ({ context, next }) => {
    console.log('[JWT Middleware] Starting authentication check');
    // Get token from Authorization header
    const authHeader = context.request?.headers.get('Authorization');
    console.log('[JWT Middleware] Auth header:', authHeader ? 'Present' : 'Missing');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('[JWT Middleware] Invalid or missing Authorization header');
        throw new ORPCError('UNAUTHORIZED');
    }
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('[JWT Middleware] Token extracted, length:', token.length);
    // Verify token
    const payload = await verifyToken(token);
    console.log('[JWT Middleware] Token verification result:', payload ? 'Valid' : 'Invalid');
    if (!payload) {
        console.log('[JWT Middleware] Token verification failed');
        throw new ORPCError('UNAUTHORIZED');
    }
    // Get user from database
    const [currentUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, payload.userId))
        .limit(1);
    console.log('[JWT Middleware] User lookup:', currentUser ? `Found: ${currentUser.id}` : 'Not found');
    if (!currentUser) {
        console.log('[JWT Middleware] User not found in database');
        throw new ORPCError('UNAUTHORIZED');
    }
    // Check if user is banned
    if (currentUser.banned) {
        console.log('[JWT Middleware] User is banned');
        throw new ORPCError('FORBIDDEN');
    }
    console.log('[JWT Middleware] Authentication successful for user:', currentUser.id);
    // Add user to context
    return next({
        context: {
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
        },
    });
});
/**
 * JWT Protected Procedure
 * Use this for endpoints that require JWT authentication
 */
export const jwtProtectedProcedure = os.use(jwtAuthMiddleware);
//# sourceMappingURL=jwt-auth.js.map