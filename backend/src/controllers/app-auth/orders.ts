import { z } from 'zod';
import { jwtProtectedProcedure } from '../../middleware/jwt-auth.js';
import { db } from '../../database/db.js';
import { orders, orderItems, products, cartItems } from '../../database/schema/index.js';
import { eq, desc, and, inArray } from 'drizzle-orm';
import cuid from 'cuid';
import { createNotification } from './notifications.js';

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
    console.log('[CreateOrder] ===== FUNCTION START =====');
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

    console.log('[CreateOrder] Inserting order items:', selectedCart.length);
    console.log('[CreateOrder] About to process cart items for images...');

    // Get first image from colorImages for each product
    const orderItemsData = selectedCart.map(item => {
      const unitPrice = parseFloat(item.products.price.toString());
      const quantity = item.cart_items.quantity;
      
      console.log('[CreateOrder] Raw product data:', {
        productName: item.products.name,
        colorImagesType: typeof item.products.colorImages,
        colorImagesValue: item.products.colorImages,
        colorImagesString: JSON.stringify(item.products.colorImages).substring(0, 100)
      });
      
      // Parse colorImages if it's a string
      let colorImages = item.products.colorImages;
      if (typeof colorImages === 'string') {
        try {
          colorImages = JSON.parse(colorImages);
          console.log('[CreateOrder] Parsed colorImages:', colorImages);
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

      console.log('[CreateOrder] Product image extraction:', {
        productName: item.products.name,
        selectedColor,
        colorImagesKeys: Object.keys(colorImages),
        selectedColorImagesCount: selectedColorImages.length,
        firstColorImagesCount: firstColorImages.length,
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

    console.log('[CreateOrder] Order items data prepared:', orderItemsData.length);
    console.log('[CreateOrder] First item image:', orderItemsData[0]?.productImage);
    
    await db.insert(orderItems).values(orderItemsData);

    // Delete only selected items from cart
    const selectedIds = selectedCart.map(item => item.cart_items.id);
    console.log('[CreateOrder] Deleting cart items:', selectedIds.length);
    if (selectedIds.length > 0) {
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
  });
