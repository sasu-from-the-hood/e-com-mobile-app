import { os } from '@orpc/server';
import { z } from 'zod';
import { deliveryBoyProcedure } from '../../middleware/orpc.js';
import { db } from '../../database/db.js';
import { deliveryBoys, orders, orderTracking, user } from '../../database/schema/index.js';
import { eq, isNull, and, inArray } from 'drizzle-orm';
import { verifyPassword } from '../../utils/password.js';
import { generateTokenPair } from '../../utils/jwt.js';
import cuid from 'cuid';
// In-memory SSE clients map: deliveryBoyId -> Set of response controllers
export const sseClients = new Map();
function broadcastToDeliveryBoys(event, data) {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const controllers of sseClients.values()) {
        for (const ctrl of controllers) {
            try {
                ctrl.enqueue(new TextEncoder().encode(message));
            }
            catch { }
        }
    }
}
// ── Auth ──────────────────────────────────────────────────────────────────────
export const deliveryBoyLogin = os
    .input(z.object({ phone: z.string(), password: z.string() }))
    .handler(async ({ input }) => {
    const [boy] = await db.select().from(deliveryBoys)
        .where(eq(deliveryBoys.phone, input.phone)).limit(1);
    if (!boy)
        return { success: false, error: 'Invalid phone or password' };
    if (!boy.isActive)
        return { success: false, error: 'Account is inactive' };
    const valid = await verifyPassword(input.password, boy.password);
    if (!valid)
        return { success: false, error: 'Invalid phone or password' };
    const tokens = await generateTokenPair({
        id: boy.id,
        email: boy.email || '',
        name: boy.name,
        role: 'delivery_boy',
        phoneNumber: boy.phone,
        phoneNumberVerified: true,
    });
    return {
        success: true,
        deliveryBoy: { id: boy.id, name: boy.name, phone: boy.phone, photo: boy.photo, vehicleType: boy.vehicleType },
        ...tokens,
    };
});
// ── Orders ────────────────────────────────────────────────────────────────────
// Orders assigned to this delivery boy by admin
export const getMyAssignedOrders = deliveryBoyProcedure
    .handler(async ({ context }) => {
    const { id } = context.deliveryBoy;
    const rows = await db.select({
        id: orders.id, orderNumber: orders.orderNumber, status: orders.status,
        total: orders.total, currency: orders.currency, paymentStatus: orders.paymentStatus,
        createdAt: orders.createdAt, shippedAt: orders.shippedAt, deliveredAt: orders.deliveredAt,
        customerName: user.name,
    })
        .from(orders)
        .leftJoin(user, eq(orders.userId, user.id))
        .where(and(eq(orders.deliveryBoyId, id), eq(orders.deliveryBoy, true)));
    return rows;
});
// Claimable orders: packed/shipped, no delivery boy assigned, deliveryBoy flag true
export const getClaimableOrders = deliveryBoyProcedure
    .handler(async ({ context }) => {
    const rows = await db.select({
        id: orders.id, orderNumber: orders.orderNumber, status: orders.status,
        total: orders.total, currency: orders.currency, createdAt: orders.createdAt,
        customerName: user.name,
    })
        .from(orders)
        .leftJoin(user, eq(orders.userId, user.id))
        .where(and(eq(orders.deliveryBoy, true), isNull(orders.deliveryBoyId), inArray(orders.status, ['packed', 'shipped'])));
    return rows;
});
// Claim an order
export const claimOrder = deliveryBoyProcedure
    .input(z.string())
    .handler(async ({ input: orderId, context }) => {
    const { id, name } = context.deliveryBoy;
    // Check it's still unclaimed
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order)
        throw new Error('Order not found');
    if (order.deliveryBoyId)
        throw new Error('Order already claimed');
    await db.update(orders).set({
        deliveryBoyId: id,
        status: 'out_for_delivery',
    }).where(eq(orders.id, orderId));
    // Update delivery boy stats
    await db.update(deliveryBoys).set({
        currentAssignedOrders: db.$count(orders, and(eq(orders.deliveryBoyId, id), eq(orders.status, 'out_for_delivery'))),
        isAvailable: false,
    }).where(eq(deliveryBoys.id, id));
    // Add tracking entry
    await db.insert(orderTracking).values({
        id: cuid(),
        orderId,
        status: 'out_for_delivery',
        courierName: name,
        notes: 'Claimed by delivery boy',
    });
    // Broadcast SSE to all delivery boys
    broadcastToDeliveryBoys('order_claimed', { orderId, claimedBy: id, claimedByName: name });
    return { success: true };
});
// Update order status (accept → out_for_delivery, complete → delivered, fail → returned)
export const updateDeliveryStatus = deliveryBoyProcedure
    .input(z.object({
    orderId: z.string(),
    status: z.enum(['out_for_delivery', 'delivered', 'returned']),
    notes: z.string().optional(),
}))
    .handler(async ({ input, context }) => {
    const { id, name } = context.deliveryBoy;
    const [order] = await db.select().from(orders)
        .where(and(eq(orders.id, input.orderId), eq(orders.deliveryBoyId, id))).limit(1);
    if (!order)
        throw new Error('Order not found or not assigned to you');
    const updateData = { status: input.status };
    if (input.status === 'delivered') {
        updateData.deliveredAt = new Date();
    }
    await db.update(orders).set(updateData).where(eq(orders.id, input.orderId));
    // Update delivery boy stats on completion
    if (input.status === 'delivered' || input.status === 'returned') {
        const [boy] = await db.select().from(deliveryBoys).where(eq(deliveryBoys.id, id)).limit(1);
        await db.update(deliveryBoys).set({
            totalDeliveries: (boy?.totalDeliveries ?? 0) + (input.status === 'delivered' ? 1 : 0),
            currentAssignedOrders: Math.max(0, (boy?.currentAssignedOrders ?? 1) - 1),
            isAvailable: true,
        }).where(eq(deliveryBoys.id, id));
    }
    // Add tracking entry
    await db.insert(orderTracking).values({
        id: cuid(),
        orderId: input.orderId,
        status: input.status,
        courierName: name,
        notes: input.notes || null,
    });
    broadcastToDeliveryBoys('order_status_updated', { orderId: input.orderId, status: input.status, updatedBy: id });
    return { success: true };
});
// Get my stats
export const getDeliveryBoyStats = deliveryBoyProcedure
    .handler(async ({ context }) => {
    try {
        const { id } = context.deliveryBoy;
        const [boy] = await db.select().from(deliveryBoys).where(eq(deliveryBoys.id, id)).limit(1);
        if (!boy) {
            return {
                totalDeliveries: 0,
                currentAssignedOrders: 0,
                isAvailable: false,
                rating: '0',
            };
        }
        return {
            totalDeliveries: boy.totalDeliveries ?? 0,
            currentAssignedOrders: boy.currentAssignedOrders ?? 0,
            isAvailable: boy.isAvailable ?? true,
            rating: boy.rating ?? '0',
        };
    }
    catch (error) {
        console.error('Error fetching delivery boy stats:', error);
        return {
            totalDeliveries: 0,
            currentAssignedOrders: 0,
            isAvailable: false,
            rating: '0',
        };
    }
});
//# sourceMappingURL=delivery.js.map