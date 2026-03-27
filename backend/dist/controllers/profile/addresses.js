import { z } from 'zod';
import { os } from '@orpc/server';
import { db } from '../../database/db.js';
import { addresses } from '../../database/schema/index.js';
import { eq, and } from 'drizzle-orm';
import cuid from 'cuid';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth.js';
const addressSchema = z.object({
    fullName: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
    phone: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    instructions: z.string().optional(),
    isDefault: z.boolean().default(false)
});
export const getAddresses = os
    .use(jwtAuthMiddleware)
    .handler(async ({ context }) => {
    return await db
        .select()
        .from(addresses)
        .where(eq(addresses.userId, context.user.id));
});
export const addAddress = os
    .use(jwtAuthMiddleware)
    .input(addressSchema)
    .handler(async ({ input, context }) => {
    try {
        if (input.isDefault) {
            await db
                .update(addresses)
                .set({ isDefault: false })
                .where(eq(addresses.userId, context.user.id));
        }
        const [result] = await db.insert(addresses).values({
            id: cuid(),
            ...input,
            userId: context.user.id
        });
        return result;
    }
    catch (error) {
        console.error('Add address error:', error);
        throw error;
    }
});
export const updateAddress = os
    .use(jwtAuthMiddleware)
    .input(z.object({
    id: z.string(),
    ...addressSchema.shape
}))
    .handler(async ({ input, context }) => {
    try {
        console.log('Updating address:', input);
        const { id, ...data } = input;
        if (data.isDefault) {
            await db
                .update(addresses)
                .set({ isDefault: false })
                .where(eq(addresses.userId, context.user.id));
        }
        const result = await db
            .update(addresses)
            .set(data)
            .where(and(eq(addresses.id, id), eq(addresses.userId, context.user.id)));
        console.log('Address updated successfully:', result);
        return result;
    }
    catch (error) {
        console.error('Update address error:', error);
        throw error;
    }
});
export const deleteAddress = os
    .use(jwtAuthMiddleware)
    .input(z.string())
    .handler(async ({ input, context }) => {
    return await db
        .delete(addresses)
        .where(and(eq(addresses.id, input), eq(addresses.userId, context.user.id)));
});
//# sourceMappingURL=addresses.js.map