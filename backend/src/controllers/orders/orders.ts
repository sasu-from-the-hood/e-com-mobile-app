import { z } from 'zod';
import { protectedProcedure, adminProcedure } from '../../middleware/orpc.js';
import { jwtProtectedProcedure } from '../../middleware/jwt-auth.js';
import { db } from '../../database/db.js';
import { orders, orderItems, products, cartItems, warehouses } from '../../database/schema/index.js';
import { eq, desc, and, inArray } from 'drizzle-orm';
import cuid from 'cuid';
import { createNotification } from '../notifications.js';

export const getOrders = jwtProtectedProcedure
  .handler(async ({ context }) => {
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, context.user.id))
      .orderBy(desc(orders.createdAt));

    // Get all items for each order
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));

        return {
          ...order,
          items
        };
      })
    );

    return ordersWithItems;
  });

export const getOrder = jwtProtectedProcedure
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

export const createOrder = jwtProtectedProcedure
  .input(z.object({
    shippingAddress: z.string(),
    paymentMethodId: z.string()
  }))
  .handler(async ({ input, context }) => {
    try {
      console.log('[CreateOrder] Starting order creation');
      console.log('[CreateOrder] User ID:', context.user.id);
      console.log('[CreateOrder] Input:', input);

      const cart = await db
        .select()
        .from(cartItems)
        .innerJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.userId, context.user.id));

      console.log('[CreateOrder] Cart items found:', cart.length);

      // Filter only selected items
      const selectedCart = cart.filter(item => item.cart_items.selected === 'true');
      console.log('[CreateOrder] Selected items:', selectedCart.length);

      if (selectedCart.length === 0) {
        console.log('[CreateOrder] No items selected for checkout');
        throw new Error('No items selected for checkout');
      }

      // Calculate total on backend for security
      const total = selectedCart.reduce((sum, item) =>
        sum + (parseFloat(item.products.price.toString()) * item.cart_items.quantity), 0
      );
      console.log('[CreateOrder] Total calculated:', total);

      const orderData = {
        id: cuid(),
        userId: context.user.id,
        orderNumber: `ORD-${Date.now()}`,
        subtotal: total.toString(),
        total: total.toString(),
        currency: 'ETB', // Ethiopian Birr
        status: 'pending' as const,
        shippingAddressId: input.shippingAddress,
        paymentMethodId: null, // No payment method for Cash on Delivery
        paymentStatus: 'pending',
        notes: `Payment Method: ${input.paymentMethodId}` // Store payment method as note
      };

      console.log('[CreateOrder] Inserting order:', orderData.id);
      await db.insert(orders).values(orderData);
      const order = orderData;

      // Get first image from colorImages for each product
      const orderItemsData = selectedCart.map(item => {
        const unitPrice = parseFloat(item.products.price.toString());
        const quantity = item.cart_items.quantity;
        
        // Parse colorImages if it's a string
        let colorImages = item.products.colorImages;
        if (typeof colorImages === 'string') {
          try {
            colorImages = JSON.parse(colorImages);
          } catch (e) {
            console.error('[CreateOrder] Failed to parse colorImages:', e);
            colorImages = {};
          }
        }
        colorImages = colorImages || {};
        
        const selectedColor = item.cart_items.color;
        const selectedColorImages = selectedColor && colorImages[selectedColor] ? colorImages[selectedColor] : [];
        const firstColorImages = Object.values(colorImages)[0] || [];
        const imageUrl = selectedColorImages[0] || firstColorImages[0] || '';

        console.log('[CreateOrder] Item:', {
          productName: item.products.name,
          selectedColor,
          imageUrl
        });

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
      });

      console.log('[CreateOrder] Inserting order items:', orderItemsData.length);
      await db.insert(orderItems).values(orderItemsData);

      // Update stock quantities for each product
      console.log('[CreateOrder] Updating stock quantities');
      for (const item of selectedCart) {
        const product = item.products;
        const quantity = item.cart_items.quantity;
        const color = item.cart_items.color;
        const size = item.cart_items.size;
        
        // Parse variantStock if it's a string
        let variantStock = product.variantStock;
        if (typeof variantStock === 'string') {
          try {
            variantStock = JSON.parse(variantStock);
          } catch (e) {
            console.error('[CreateOrder] Failed to parse variantStock:', e);
            variantStock = {};
          }
        }
        variantStock = variantStock || {};

        // Update variant stock
        const variantKey = size ? `${color}-${size}` : (color || '');
        const currentVariantStock = variantStock[variantKey] || 0;
        const newVariantStock = Math.max(0, currentVariantStock - quantity);
        variantStock[variantKey] = newVariantStock;

        // Calculate total stock from all variants
        const totalStock = Object.values(variantStock).reduce((sum: number, stock) => sum + (Number(stock) || 0), 0);
        const inStock = totalStock > 0;
        await db
          .update(products)
          .set({ 
            variantStock: variantStock,
            stockQuantity: totalStock,
            inStock: inStock
          })
          .where(eq(products.id, product.id));
      }

      // Delete only selected items from cart
      const selectedIds = selectedCart.map(item => item.cart_items.id);
      if (selectedIds.length > 0) {
        console.log('[CreateOrder] Deleting cart items:', selectedIds.length);
        await db.delete(cartItems).where(
          and(
            eq(cartItems.userId, context.user.id),
            inArray(cartItems.id, selectedIds)
          )
        );
      }

      // Send order confirmation notification
      console.log('[CreateOrder] Sending notification');
      await createNotification({
        userId: context.user.id,
        title: 'Order Confirmed',
        message: `Your order ${order.orderNumber} has been confirmed and is being processed.`,
        type: 'order_update',
        category: 'order'
      });

      console.log('[CreateOrder] Order created successfully:', order.id);
      return order;
    } catch (error) {
      console.error('[CreateOrder] Error:', error);
      throw error;
    }
  });

export const cancelOrder = jwtProtectedProcedure
  .input(z.string())
  .handler(async ({ input, context }) => {
    console.log('[CancelOrder] Starting order cancellation');
    console.log('[CancelOrder] Order ID:', input);
    console.log('[CancelOrder] User ID:', context.user.id);

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, input));

    if (!order) {
      console.log('[CancelOrder] Order not found');
      throw new Error('Order not found');
    }

    if (order.userId !== context.user.id) {
      console.log('[CancelOrder] Unauthorized - order belongs to different user');
      throw new Error('Unauthorized');
    }

    // Only allow cancellation if order is pending or processing
    if (order.status !== 'pending' && order.status !== 'processing') {
      console.log('[CancelOrder] Cannot cancel - order status:', order.status);
      throw new Error('Order cannot be cancelled at this stage');
    }

    // Get order items to restore stock
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, input));

    console.log('[CancelOrder] Restoring stock for', items.length, 'items');

    // Restore stock for each item
    for (const item of items) {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId));

      if (product) {
        // Parse variantStock if it's a string
        let variantStock = product.variantStock;
        if (typeof variantStock === 'string') {
          try {
            variantStock = JSON.parse(variantStock);
          } catch (e) {
            console.error('[CancelOrder] Failed to parse variantStock:', e);
            variantStock = {};
          }
        }
        variantStock = variantStock || {};

        // Restore variant stock
        const variantKey = item.size ? `${item.color}-${item.size}` : (item.color || '');
        const currentVariantStock = variantStock[variantKey] || 0;
        const newVariantStock = currentVariantStock + item.quantity;
        variantStock[variantKey] = newVariantStock;

        // Calculate total stock from all variants
        const totalStock = Object.values(variantStock).reduce((sum: number, stock) => sum + (Number(stock) || 0), 0);

        console.log('[CancelOrder] Restoring stock:', {
          productId: product.id,
          productName: product.name,
          variantKey,
          oldVariantStock: currentVariantStock,
          restored: item.quantity,
          newVariantStock,
          totalStock
        });

        await db
          .update(products)
          .set({ 
            variantStock: variantStock,
            stockQuantity: totalStock,
            inStock: true
          })
          .where(eq(products.id, item.productId));
      }
    }

    // Update order status to cancelled
    await db
      .update(orders)
      .set({ status: 'cancelled' })
      .where(eq(orders.id, input));

    // Send cancellation notification
    await createNotification({
      userId: order.userId,
      title: 'Order Cancelled',
      message: `Your order ${order.orderNumber} has been cancelled successfully.`,
      type: 'order_update',
      category: 'order'
    });

    console.log('[CancelOrder] Order cancelled successfully');
    return { success: true };
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

export const updateDeliveryBoy = jwtProtectedProcedure
  .input(z.object({
    orderId: z.string(),
    deliveryBoy: z.boolean()
  }))
  .handler(async ({ input, context }) => {
    console.log('[UpdateDeliveryBoy] Updating delivery boy status');
    console.log('[UpdateDeliveryBoy] Order ID:', input.orderId);
    console.log('[UpdateDeliveryBoy] Delivery Boy:', input.deliveryBoy);

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, input.orderId));

    if (!order) {
      console.log('[UpdateDeliveryBoy] Order not found');
      throw new Error('Order not found');
    }

    if (order.userId !== context.user.id) {
      console.log('[UpdateDeliveryBoy] Unauthorized');
      throw new Error('Unauthorized');
    }

    await db
      .update(orders)
      .set({ deliveryBoy: input.deliveryBoy })
      .where(eq(orders.id, input.orderId));

    console.log('[UpdateDeliveryBoy] Updated successfully');
    return { success: true };
  });

export const getOrderWarehouse = jwtProtectedProcedure
  .input(z.string())
  .handler(async ({ input, context }) => {
    console.log('[GetOrderWarehouse] Getting warehouse location for order:', input);

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, input));

    if (!order) {
      console.log('[GetOrderWarehouse] Order not found');
      throw new Error('Order not found');
    }

    if (order.userId !== context.user.id) {
      console.log('[GetOrderWarehouse] Unauthorized');
      throw new Error('Unauthorized');
    }

    // Get first order item to find the warehouse
    const [firstItem] = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, input))
      .limit(1);

    if (!firstItem) {
      console.log('[GetOrderWarehouse] No items found');
      throw new Error('No items found in order');
    }

    // Get product to find warehouse
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, firstItem.productId));

    if (!product || !product.warehouseId) {
      console.log('[GetOrderWarehouse] No warehouse linked to product');
      return null;
    }

    // Get warehouse details
    const [warehouse] = await db
      .select()
      .from(warehouses)
      .where(eq(warehouses.id, product.warehouseId));

    if (!warehouse) {
      console.log('[GetOrderWarehouse] Warehouse not found');
      return null;
    }

    console.log('[GetOrderWarehouse] Warehouse found:', warehouse.name);
    return {
      id: warehouse.id,
      name: warehouse.name,
      address: warehouse.address,
      latitude: parseFloat(warehouse.latitude.toString()),
      longitude: parseFloat(warehouse.longitude.toString()),
      phone: warehouse.phone
    };
  });
