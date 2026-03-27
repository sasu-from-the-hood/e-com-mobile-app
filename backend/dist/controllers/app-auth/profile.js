import { os } from '@orpc/server';
import { z } from 'zod';
import { db } from '../../database/db.js';
import { user } from '../../database/schema/auth-schema.js';
import { eq } from 'drizzle-orm';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth.js';
import { logger } from '../../utils/logger.js';
import * as fs from 'fs';
import * as path from 'path';
// Upload avatar
export const uploadAvatar = os
    .use(jwtAuthMiddleware)
    .input(z.any())
    .handler(async ({ input, context }) => {
    try {
        const { data, type, name, oldImageUrl } = input || {};
        if (!data || typeof data !== 'string') {
            return {
                success: false,
                error: 'Image data is required',
            };
        }
        if (!type || typeof type !== 'string') {
            return {
                success: false,
                error: 'Image type is required',
            };
        }
        if (!name || typeof name !== 'string') {
            return {
                success: false,
                error: 'Image name is required',
            };
        }
        if (!type.startsWith('image/')) {
            return {
                success: false,
                error: 'Only image files are allowed',
            };
        }
        // Delete old image if exists
        if (oldImageUrl) {
            try {
                const url = new URL(oldImageUrl);
                const relativePath = url.pathname;
                const oldFilePath = path.join(process.cwd(), relativePath);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
            catch (error) {
                console.error('[Upload] Failed to delete old image:', error);
            }
        }
        const timestamp = Date.now();
        const randomId = Math.round(Math.random() * 1E9);
        const extension = name.split('.').pop() || 'jpg';
        const filename = `avatar-${timestamp}-${randomId}.${extension}`;
        const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, filename);
        // Handle base64 data with or without data URL prefix
        let base64Data = data;
        if (base64Data.startsWith('data:')) {
            const parts = base64Data.split(',');
            base64Data = parts[1] || base64Data;
        }
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(filePath, buffer);
        const imageUrl = `/uploads/avatars/${filename}`;
        console.log('[Upload] Avatar uploaded successfully:', imageUrl);
        return {
            success: true,
            imageUrl,
        };
    }
    catch (error) {
        console.error('[Upload] Avatar upload error:', error);
        return {
            success: false,
            error: 'Failed to upload avatar',
        };
    }
});
// Update user profile
export const updateProfile = os
    .use(jwtAuthMiddleware)
    .input(z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    image: z.string().optional(),
}))
    .handler(async ({ input, context }) => {
    const { name, email, image } = input;
    console.log('[Profile] Update profile request for user:', context.user.id);
    logger.info(`[Profile] Update profile request for user: ${context.user.id}`);
    // Build update object
    const updates = {};
    if (name !== undefined)
        updates.name = name;
    if (email !== undefined)
        updates.email = email;
    if (image !== undefined)
        updates.image = image;
    if (Object.keys(updates).length === 0) {
        return {
            success: false,
            error: 'No fields to update',
        };
    }
    // Update user
    await db
        .update(user)
        .set(updates)
        .where(eq(user.id, context.user.id));
    // Get updated user
    const [updatedUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, context.user.id))
        .limit(1);
    if (!updatedUser) {
        console.log('[Profile] User not found after update');
        logger.error('[Profile] User not found after update');
        return {
            success: false,
            error: 'User not found',
        };
    }
    console.log('[Profile] Profile updated successfully for user:', context.user.id);
    logger.info(`[Profile] Profile updated successfully for user: ${context.user.id}`);
    return {
        success: true,
        message: 'Profile updated successfully',
        user: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber,
            phoneNumberVerified: updatedUser.phoneNumberVerified,
            image: updatedUser.image,
            role: updatedUser.role,
        },
    };
});
// Get user profile
export const getProfile = os
    .use(jwtAuthMiddleware)
    .handler(async ({ context }) => {
    console.log('[Profile] Get profile request for user:', context.user.id);
    logger.info(`[Profile] Get profile request for user: ${context.user.id}`);
    return {
        success: true,
        user: context.user,
    };
});
//# sourceMappingURL=profile.js.map