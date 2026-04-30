import { os } from '@orpc/server';
import { z } from 'zod';
import { deliveryBoyProcedure } from '../../middleware/orpc.js';
import { db } from '../../database/db.js';
import { deliveryBoys, orders, orderTracking, user, orderItems, products } from '../../database/schema/index.js';
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
// Refresh token for delivery boy
export const deliveryBoyRefreshToken = os
    .input(z.object({ refreshToken: z.string() }))
    .handler(async ({ input }) => {
    const { verifyRefreshToken } = await import('../../utils/jwt.js');
    const payload = await verifyRefreshToken(input.refreshToken);
    if (!payload) {
        return { success: false, error: 'Invalid or expired refresh token' };
    }
    // Get delivery boy details
    const [boy] = await db.select().from(deliveryBoys)
        .where(eq(deliveryBoys.id, payload.userId)).limit(1);
    if (!boy || !boy.isActive) {
        return { success: false, error: 'Delivery boy not found or inactive' };
    }
    // Generate new token pair
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
        ...tokens,
    };
});
// ── Orders ────────────────────────────────────────────────────────────────────
// Orders assigned to this delivery boy by admin
export const getMyAssignedOrders = deliveryBoyProcedure
    .handler(async ({ context }) => {
    try {
        const { id } = context.deliveryBoy;
        console.log('[getMyAssignedOrders] Delivery boy ID:', id);
        const rows = await db.select({
            id: orders.id, orderNumber: orders.orderNumber, status: orders.status,
            total: orders.total, currency: orders.currency, paymentStatus: orders.paymentStatus,
            createdAt: orders.createdAt, shippedAt: orders.shippedAt, deliveredAt: orders.deliveredAt,
            customerName: user.name,
        })
            .from(orders)
            .leftJoin(user, eq(orders.userId, user.id))
            .where(and(eq(orders.deliveryBoyId, id), eq(orders.deliveryBoy, true)));
        console.log('[getMyAssignedOrders] Found orders:', rows.length);
        // Get order items for each order
        const ordersWithItems = await Promise.all(rows.map(async (order) => {
            const items = await db.select({
                id: orderItems.id,
                productName: orderItems.productName,
                productImage: orderItems.productImage,
                quantity: orderItems.quantity,
                unitPrice: orderItems.unitPrice,
                color: orderItems.color,
                size: orderItems.size,
            })
                .from(orderItems)
                .where(eq(orderItems.orderId, order.id));
            return { ...order, items };
        }));
        return ordersWithItems;
    }
    catch (error) {
        console.error('[getMyAssignedOrders] Error:', error instanceof Error ? error.message : 'Unknown error');
        throw error;
    }
});
// Claimable orders: pending/packed/shipped, no delivery boy assigned, deliveryBoy flag true, matching warehouse
export const getClaimableOrders = deliveryBoyProcedure
    .handler(async ({ context }) => {
    try {
        const { id } = context.deliveryBoy;
        // Get delivery boy's warehouse
        const [deliveryBoy] = await db.select()
            .from(deliveryBoys)
            .where(eq(deliveryBoys.id, id))
            .limit(1);
        if (!deliveryBoy?.warehouseId) {
            console.log('[getClaimableOrders] Delivery boy has no warehouse assigned - showing all orders');
            // If no warehouse assigned, show all claimable orders (backward compatibility)
            const rows = await db.select({
                id: orders.id,
                orderNumber: orders.orderNumber,
                status: orders.status,
                total: orders.total,
                currency: orders.currency,
                createdAt: orders.createdAt,
                customerName: user.name,
            })
                .from(orders)
                .leftJoin(user, eq(orders.userId, user.id))
                .where(and(eq(orders.deliveryBoy, true), isNull(orders.deliveryBoyId), inArray(orders.status, ['pending', 'packed', 'shipped'])));
            console.log('[getClaimableOrders] Found orders (no warehouse filter):', rows.length);
            return rows;
        }
        console.log('[getClaimableOrders] Delivery boy warehouse:', deliveryBoy.warehouseId);
        // Get orders with delivery boy enabled, no delivery boy assigned, and status pending/packed/shipped
        const ordersWithItems = await db.select({
            orderId: orders.id,
            orderNumber: orders.orderNumber,
            status: orders.status,
            total: orders.total,
            currency: orders.currency,
            createdAt: orders.createdAt,
            customerName: user.name,
            productId: orderItems.productId,
        })
            .from(orders)
            .leftJoin(user, eq(orders.userId, user.id))
            .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
            .where(and(eq(orders.deliveryBoy, true), isNull(orders.deliveryBoyId), inArray(orders.status, ['pending', 'packed', 'shipped'])));
        console.log('[getClaimableOrders] Found orders with items:', ordersWithItems.length);
        if (ordersWithItems.length === 0) {
            return [];
        }
        // Get unique product IDs
        const productIds = [...new Set(ordersWithItems.map(o => o.productId))];
        // Get products with their warehouses
        const productsWithWarehouses = await db.select({
            id: products.id,
            warehouseId: products.warehouseId,
        })
            .from(products)
            .where(inArray(products.id, productIds));
        console.log('[getClaimableOrders] Products with warehouses:', productsWithWarehouses.length);
        // Create a map of productId -> warehouseId
        const productWarehouseMap = new Map(productsWithWarehouses.map(p => [p.id, p.warehouseId]));
        // Filter orders where all products match the delivery boy's warehouse
        const matchingOrderIds = new Set();
        const orderProductsMap = new Map();
        // Group products by order
        for (const item of ordersWithItems) {
            if (!orderProductsMap.has(item.orderId)) {
                orderProductsMap.set(item.orderId, []);
            }
            orderProductsMap.get(item.orderId).push(item.productId);
        }
        // Check each order
        for (const [orderId, productIds] of orderProductsMap.entries()) {
            const allProductsMatch = productIds.every(productId => {
                const productWarehouse = productWarehouseMap.get(productId);
                return productWarehouse === deliveryBoy.warehouseId;
            });
            if (allProductsMatch) {
                matchingOrderIds.add(orderId);
            }
        }
        console.log('[getClaimableOrders] Matching orders:', matchingOrderIds.size);
        // Get the final order details for matching orders
        if (matchingOrderIds.size === 0) {
            return [];
        }
        const rows = await db.select({
            id: orders.id,
            orderNumber: orders.orderNumber,
            status: orders.status,
            total: orders.total,
            currency: orders.currency,
            createdAt: orders.createdAt,
            customerName: user.name,
        })
            .from(orders)
            .leftJoin(user, eq(orders.userId, user.id))
            .where(inArray(orders.id, Array.from(matchingOrderIds)));
        console.log('[getClaimableOrders] Final orders:', rows.length);
        return rows;
    }
    catch (error) {
        console.error('[getClaimableOrders] Error:', error instanceof Error ? error.message : 'Unknown error');
        throw error;
    }
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
// Update order status (accept → out_for_delivery, complete → confirmed, fail → pending)
export const updateDeliveryStatus = deliveryBoyProcedure
    .input(z.object({
    orderId: z.string(),
    status: z.enum(['out_for_delivery', 'confirmed', 'delivered', 'returned', 'pending']),
    notes: z.string().optional(),
}))
    .handler(async ({ input, context }) => {
    const { id, name } = context.deliveryBoy;
    const [order] = await db.select().from(orders)
        .where(and(eq(orders.id, input.orderId), eq(orders.deliveryBoyId, id))).limit(1);
    if (!order)
        throw new Error('Order not found or not assigned to you');
    const updateData = { status: input.status };
    // If returning to pending, clear delivery boy assignment
    if (input.status === 'pending') {
        updateData.deliveryBoyId = null;
    }
    if (input.status === 'delivered') {
        updateData.deliveredAt = new Date();
    }
    await db.update(orders).set(updateData).where(eq(orders.id, input.orderId));
    // Update delivery boy stats on completion or return to pending
    if (input.status === 'delivered' || input.status === 'pending') {
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
        console.log('[getDeliveryBoyStats] Delivery boy ID:', id);
        const [boy] = await db.select().from(deliveryBoys).where(eq(deliveryBoys.id, id)).limit(1);
        if (!boy) {
            console.log('[getDeliveryBoyStats] Delivery boy not found');
            return {
                totalDeliveries: 0,
                currentAssignedOrders: 0,
                isAvailable: false,
                rating: '0',
            };
        }
        console.log('[getDeliveryBoyStats] Stats:', {
            totalDeliveries: boy.totalDeliveries,
            currentAssignedOrders: boy.currentAssignedOrders,
            isAvailable: boy.isAvailable,
            rating: boy.rating,
        });
        return {
            totalDeliveries: boy.totalDeliveries ?? 0,
            currentAssignedOrders: boy.currentAssignedOrders ?? 0,
            isAvailable: boy.isAvailable ?? true,
            rating: boy.rating ?? '0',
        };
    }
    catch (error) {
        console.error('[getDeliveryBoyStats] Error:', error instanceof Error ? error.message : 'Unknown error');
        return {
            totalDeliveries: 0,
            currentAssignedOrders: 0,
            isAvailable: false,
            rating: '0',
        };
    }
});
//# sourceMappingURL=delivery.js.map