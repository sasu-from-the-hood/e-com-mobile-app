import { z } from 'zod';
import { protectedProcedure } from '../../middleware/orpc.js';
import { db } from '../../database/db.js';
import { paymentMethods } from '../../database/schema/index.js';
import { eq } from 'drizzle-orm';
import cuid from 'cuid';
export const getPaymentMethods = protectedProcedure
    .handler(async ({ context }) => {
    return await db
        .select()
        .from(paymentMethods)
        .where(eq(paymentMethods.userId, context.user.id));
});
export const addPaymentMethod = protectedProcedure
    .input(z.object({
    type: z.enum(['card', 'paypal', 'bank']),
    cardNumber: z.string().optional(),
    expiryDate: z.string().optional(),
    cardholderName: z.string().optional(),
    isDefault: z.boolean().default(false)
}))
    .handler(async ({ input, context }) => {
    if (input.isDefault) {
        await db
            .update(paymentMethods)
            .set({ isDefault: false })
            .where(eq(paymentMethods.userId, context.user.id));
    }
    return await db.insert(paymentMethods).values({
        id: cuid(),
        userId: context.user.id,
        ...input
    });
});
export const processPayment = protectedProcedure
    .input(z.object({
    orderId: z.string(),
    paymentMethodId: z.string(),
    amount: z.number()
}))
    .handler(async ({ input }) => {
    // Mock payment processing
    return {
        success: true,
        transactionId: `txn_${cuid()}`,
        status: 'completed'
    };
});
//# sourceMappingURL=checkout.js.map