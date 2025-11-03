import { z } from 'zod';
import { protectedProcedure, adminProcedure } from '../../middleware/orpc.js';
import { db } from '../../database/db.js';
import { orders, orderItems, products, cartItems } from '../../database/schema/index.js';
import { eq, desc, and, inArray } from 'drizzle-orm';
import cuid from 'cuid';
import { createNotification } from '../notifications.js';

export const getOrders = protectedProcedure
  .handler(async ({ context }) => {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, context.user.id))
      .orderBy(desc(orders.createdAt));
  });

export const getOrder = protectedProcedure
  .input(z.string())
  .handler(async ({ input, context }) => {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, input));

    if (!order || order.userId !== context.user.id) {
      throw new Error('Order not found');
    }

    const items = await db
      .select({
        id: orderItems.id,
        quantity: orderItems.quantity,
        unitPrice: orderItems.unitPrice,
        product: products
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, input));

    return { ...order, items };
  });

export const createOrder = protectedProcedure
  .input(z.object({
    shippingAddress: z.string(),
    paymentMethodId: z.string()
  }))
  .handler(async ({ input, context }) => {
    const cart = await db
      .select()
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, context.user.id));

    // Filter only selected items
    const selectedCart = cart.filter(item => item.cart_items.selected === 'true');

    if (selectedCart.length === 0) {
      throw new Error('No items selected for checkout');
    }

    // Calculate total on backend for security
    const total = selectedCart.reduce((sum, item) =>
      sum + (parseFloat(item.products.price.toString()) * item.cart_items.quantity), 0
    );

    const orderData = {
      id: cuid(),
      userId: context.user.id,
      orderNumber: `ORD-${Date.now()}`,
      subtotal: total.toString(),
      total: total.toString(),
      currency: 'ETB', // Ethiopian Birr
      status: 'pending' as const,
      shippingAddress: input.shippingAddress,
      paymentMethodId: input.paymentMethodId
    };

    await db.insert(orders).values(orderData);
    const order = orderData;

    // Get first image from colorImages for each product
    await db.insert(orderItems).values(
      selectedCart.map(item => {
        const unitPrice = parseFloat(item.products.price.toString());
        const quantity = item.cart_items.quantity;
        const colorImages = item.products.colorImages as Record<string, string[]> || {};
        const selectedColor = item.cart_items.color;
        const selectedColorImages = selectedColor && colorImages[selectedColor] ? colorImages[selectedColor] : [];
        const firstColorImages = Object.values(colorImages)[0] || [];
        const imageUrl = selectedColorImages[0] || firstColorImages[0] || '';

        return {
          id: cuid(),
          orderId: order.id,
          productId: item.cart_items.productId,
          productName: item.products.name,
          productImage: imageUrl,
          quantity,
          unitPrice: unitPrice.toString(),
          totalPrice: (unitPrice * quantity).toString(),
          color: item.cart_items.color,
          size: item.cart_items.size
        };
      })
    );

    // Delete only selected items from cart
    const selectedIds = selectedCart.map(item => item.cart_items.id);
    if (selectedIds.length > 0) {
      await db.delete(cartItems).where(
        and(
          eq(cartItems.userId, context.user.id),
          inArray(cartItems.id, selectedIds)
        )
      );
    }

    // Send order confirmation notification
    await createNotification({
      userId: context.user.id,
      title: 'Order Confirmed',
      message: `Your order ${order.orderNumber} has been confirmed and is being processed.`,
      type: 'order_update',
      category: 'order'
    });

    return order;
  });

export const updateOrderStatus = adminProcedure
  .input(z.object({
    id: z.string(),
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
  }))
  .handler(async ({ input }) => {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, input.id));

    if (!order) {
      throw new Error('Order not found');
    }

    await db
      .update(orders)
      .set({ status: input.status })
      .where(eq(orders.id, input.id));

    // Send status update notification
    const statusMessages: Record<string, string> = {
      pending: 'Your order is pending confirmation.',
      processing: 'Your order is now being processed.',
      shipped: 'Your order has been shipped and is on its way!',
      delivered: 'Your order has been delivered. Thank you for shopping with us!',
      cancelled: 'Your order has been cancelled.'
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