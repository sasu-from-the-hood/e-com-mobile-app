import { z } from 'zod';
import { adminProcedure } from '../../middleware/orpc.js';
import { db } from '../../database/db.js';
import { orders, orderItems, products, user, deliveryBoys } from '../../database/schema/index.js';
import { eq, desc, sql } from 'drizzle-orm';
import { createNotification } from '../notifications.js';

export const getAdminOrders = adminProcedure
  .handler(async () => {
    const allOrders = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        userId: orders.userId,
        userName: user.name,
        userEmail: user.email,
        status: orders.status,
        total: orders.total,
        currency: orders.currency,
        paymentStatus: orders.paymentStatus,
        deliveryBoy: orders.deliveryBoy,
        deliveryBoyId: orders.deliveryBoyId,
        deliveryBoyName: deliveryBoys.name,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
      })
      .from(orders)
      .leftJoin(user, eq(orders.userId, user.id))
      .leftJoin(deliveryBoys, eq(orders.deliveryBoyId, deliveryBoys.id))
      .orderBy(desc(orders.createdAt));

    return allOrders;
  });

export const getAdminOrder = adminProcedure
  .input(z.string())
  .handler(async ({ input }) => {
    const [order] = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        userId: orders.userId,
        userName: user.name,
        userEmail: user.email,
        status: orders.status,
        subtotal: orders.subtotal,
        tax: orders.tax,
        shipping: orders.shipping,
        discount: orders.discount,
        total: orders.total,
        currency: orders.currency,
        paymentStatus: orders.paymentStatus,
        deliveryBoy: orders.deliveryBoy,
        deliveryBoyId: orders.deliveryBoyId,
        deliveryBoyName: deliveryBoys.name,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
      })
      .from(orders)
      .leftJoin(user, eq(orders.userId, user.id))
      .leftJoin(deliveryBoys, eq(orders.deliveryBoyId, deliveryBoys.id))
      .where(eq(orders.id, input));

    if (!order) {
      throw new Error('Order not found');
    }

    const items = await db
      .select({
        id: orderItems.id,
        quantity: orderItems.quantity,
        unitPrice: orderItems.unitPrice,
        totalPrice: orderItems.totalPrice,
        color: orderItems.color,
        size: orderItems.size,
        productName: orderItems.productName,
        productImage: orderItems.productImage,
      })
      .from(orderItems)
      .where(eq(orderItems.orderId, input));

    return { ...order, items };
  });

export const adminAssignDeliveryBoy = adminProcedure
  .input(z.object({
    orderId: z.string(),
    deliveryBoyId: z.string().nullable(),
  }))
  .handler(async ({ input }) => {
    // Update order with delivery boy
    await db
      .update(orders)
      .set({ 
        deliveryBoyId: input.deliveryBoyId,
        deliveryBoy: input.deliveryBoyId ? true : false
      })
      .where(eq(orders.id, input.orderId));

    // If assigning a delivery boy, update their current assigned orders count
    if (input.deliveryBoyId) {
      await db.execute(sql`
        UPDATE ${deliveryBoys}
        SET ${deliveryBoys.currentAssignedOrders} = (
          SELECT COUNT(*) FROM ${orders}
          WHERE ${orders.deliveryBoyId} = ${input.deliveryBoyId}
          AND ${orders.status} NOT IN ('delivered', 'cancelled')
        )
        WHERE ${deliveryBoys.id} = ${input.deliveryBoyId}
      `);

      // Get order details for notification
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.orderId));

      if (order) {
        // Send notification to customer
        await createNotification({
          userId: order.userId,
          title: 'Delivery Boy Assigned',
          message: `A delivery boy has been assigned to your order ${order.orderNumber}.`,
          type: 'order_update',
          category: 'order'
        });
      }
    }

    return { success: true };
  });

export const adminUpdateOrderStatus = adminProcedure
  .input(z.object({
    orderId: z.string(),
    status: z.enum(['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded', 'returned']),
  }))
  .handler(async ({ input }) => {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, input.orderId));

    if (!order) {
      throw new Error('Order not found');
    }

    const updateData: any = { status: input.status };

    // Update timestamps based on status
    if (input.status === 'shipped') {
      updateData.shippedAt = new Date();
    } else if (input.status === 'delivered') {
      updateData.deliveredAt = new Date();
      
      // Update delivery boy stats if assigned
      if (order.deliveryBoyId) {
        await db.execute(sql`
          UPDATE ${deliveryBoys}
          SET 
            ${deliveryBoys.totalDeliveries} = ${deliveryBoys.totalDeliveries} + 1,
            ${deliveryBoys.currentAssignedOrders} = (
              SELECT COUNT(*) FROM ${orders}
              WHERE ${orders.deliveryBoyId} = ${order.deliveryBoyId}
              AND ${orders.status} NOT IN ('delivered', 'cancelled')
            )
          WHERE ${deliveryBoys.id} = ${order.deliveryBoyId}
        `);
      }
    } else if (input.status === 'cancelled') {
      updateData.cancelledAt = new Date();
      
      // Update delivery boy current assigned orders if assigned
      if (order.deliveryBoyId) {
        await db.execute(sql`
          UPDATE ${deliveryBoys}
          SET ${deliveryBoys.currentAssignedOrders} = (
            SELECT COUNT(*) FROM ${orders}
            WHERE ${orders.deliveryBoyId} = ${order.deliveryBoyId}
            AND ${orders.status} NOT IN ('delivered', 'cancelled')
          )
          WHERE ${deliveryBoys.id} = ${order.deliveryBoyId}
        `);
      }
    }

    await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, input.orderId));

    // Send status update notification
    const statusMessages: Record<string, string> = {
      pending: 'Your order is pending confirmation.',
      confirmed: 'Your order has been confirmed.',
      processing: 'Your order is now being processed.',
      packed: 'Your order has been packed and is ready for shipment.',
      shipped: 'Your order has been shipped and is on its way!',
      out_for_delivery: 'Your order is out for delivery!',
      delivered: 'Your order has been delivered. Thank you for shopping with us!',
      cancelled: 'Your order has been cancelled.',
      refunded: 'Your order has been refunded.',
      returned: 'Your order has been returned.'
    };

    const message = statusMessages[input.status];
    if (message) {
      await createNotification({
        userId: order.userId,
        title: `Order ${input.status.charAt(0).toUpperCase() + input.status.slice(1)}`,
        message,
        type: 'order_update',
        category: 'order'
      });
    }

    return { success: true };
  });
