import { z } from 'zod';
import { protectedProcedure } from '../../middleware/orpc.js';
import { db } from '../../database/db.js';
import { cartItems, products } from '../../database/schema/index.js';
import { eq, and, isNull } from 'drizzle-orm';
import cuid from 'cuid';
import { createNotification } from '../notifications.js';

export const getCart = protectedProcedure
  .handler(async ({ context }) => {
    try {
      const result = await db
        .select({
          id: cartItems.id,
          productId: cartItems.productId,
          quantity: cartItems.quantity,
          color: cartItems.color,
          size: cartItems.size,
          selected: cartItems.selected,
          productName: products.name,
          productPrice: products.price,
          productColorImages: products.colorImages
        })
        .from(cartItems)
        .innerJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.userId, context.user.id));

      // Transform to match expected format
      return result.map(item => {
        // Parse colorImages if it's a string
        const colorImages = typeof item.productColorImages === 'string'
          ? JSON.parse(item.productColorImages || '{}')
          : (item.productColorImages as Record<string, string[]> || {});

        const selectedColorImages = item.color && colorImages[item.color] ? colorImages[item.color] : [];
        const firstColorImages = Object.values(colorImages)[0] || [];
        const imageUrl = selectedColorImages[0] || firstColorImages[0] || '';

        console.log('Cart item backend:', {
          productName: item.productName,
          color: item.color,
          colorImagesType: typeof item.productColorImages,
          colorImages: colorImages,
          selectedColorImages: selectedColorImages,
          imageUrl: imageUrl
        });

        return {
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          selected: item.selected === 'true',
          product: {
            id: item.productId,
            name: item.productName,
            price: item.productPrice,
            image: imageUrl,
            imageUrl: imageUrl,
            colorImages: colorImages
          }
        };
      });
    } catch (error) {
      console.error('Cart query error:', error);
      throw error;
    }
  });

export const addToCart = protectedProcedure
  .input(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    color: z.string().optional(),
    size: z.string().optional()
  }))
  .handler(async ({ input, context }) => {

    try {
    // Build where conditions
    const whereConditions = [
      eq(cartItems.userId, context.user.id),
      eq(cartItems.productId, input.productId)
    ];

    if (input.color) {
      whereConditions.push(eq(cartItems.color, input.color));
    } else {
      whereConditions.push(isNull(cartItems.color));
    }

    if (input.size) {
      whereConditions.push(eq(cartItems.size, input.size));
    } else {
      whereConditions.push(isNull(cartItems.size));
    }

    const [existing] = await db
      .select({
        id: cartItems.id,
        quantity: cartItems.quantity
      })
      .from(cartItems)
      .where(and(...whereConditions));

    if (existing) {
      return await db
        .update(cartItems)
        .set({ quantity: existing.quantity + input.quantity })
        .where(eq(cartItems.id, existing.id));
    }

    const result = await db.insert(cartItems).values({
      id: cuid(),
      userId: context.user.id,
      productId: input.productId,
      quantity: input.quantity,
      color: input.color || null,
      size: input.size || null
    });

    // Check if product is low in stock and notify
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, input.productId));

    if (product && product.stockQuantity !== null && product.lowStockThreshold !== null && product.stockQuantity <= product.lowStockThreshold) {
      await createNotification({
        userId: context.user.id,
        title: 'Low Stock Alert',
        message: `${product.name} is running low in stock. Order soon!`,
        type: 'stock_alert',
        category: 'promotion'
      });
    }

    return result;
  }catch (error){
console.log("error in add to cart:", error);
  }
  });

export const updateCart = protectedProcedure
  .input(z.object({
    id: z.string(),
    quantity: z.number().min(1)
  }))
  .handler(async ({ input, context }) => {
    return await db
      .update(cartItems)
      .set({ quantity: input.quantity })
      .where(and(
        eq(cartItems.id, input.id),
        eq(cartItems.userId, context.user.id)
      ));
  });

export const removeFromCart = protectedProcedure
  .input(z.string())
  .handler(async ({ input, context }) => {
    return await db
      .delete(cartItems)
      .where(and(
        eq(cartItems.id, input),
        eq(cartItems.userId, context.user.id)
      ));
  });

export const clearCart = protectedProcedure
  .handler(async ({ context }) => {
    return await db
      .delete(cartItems)
      .where(eq(cartItems.userId, context.user.id));
  });

export const toggleCartItemSelection = protectedProcedure
  .input(z.object({
    id: z.string(),
    selected: z.boolean()
  }))
  .handler(async ({ context, input }) => {
    return await db
      .update(cartItems)
      .set({ selected: input.selected ? 'true' : 'false' })
      .where(and(
        eq(cartItems.id, input.id),
        eq(cartItems.userId, context.user.id)
      ));
  });

export const getCartTotal = protectedProcedure
  .handler(async ({ context }) => {
    const result = await db
      .select({
        quantity: cartItems.quantity,
        selected: cartItems.selected,
        productPrice: products.price,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(and(
        eq(cartItems.userId, context.user.id),
        eq(cartItems.selected, 'true')
      ));

    const total = result.reduce((sum, item) => {
      return sum + (parseFloat(item.productPrice.toString()) * item.quantity);
    }, 0);

    return {
      subtotal: total,
      shipping: 0,
      tax: 0,
      total: total,
      currency: 'ETB' // Ethiopian Birr
    };
  });