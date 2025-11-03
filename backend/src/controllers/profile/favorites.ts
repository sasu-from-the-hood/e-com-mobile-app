import { z } from 'zod';
import { protectedProcedure } from '../../middleware/orpc.js';
import { db } from '../../database/db.js';
import { favorites, products } from '../../database/schema/index.js';
import { eq, and } from 'drizzle-orm';
import cuid from 'cuid';

const parseProductData = (product: any) => {
  const colorImages = typeof product.colorImages === 'string' ? JSON.parse(product.colorImages || '{}') : product.colorImages || {};
  const colors = Object.keys(colorImages);
  const images = colors.length > 0 ? colorImages[colors[0]] || [] : [];

  return {
    ...product,
    colorImages,
    colors,
    images,
    sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes || '[]') : product.sizes || [],
    tags: typeof product.tags === 'string' ? JSON.parse(product.tags || '[]') : product.tags || []
  };
};

export const getFavorites = protectedProcedure
  .handler(async ({ context }) => {
    const result = await db
      .select({
        id: favorites.id,
        product: products
      })
      .from(favorites)
      .innerJoin(products, eq(favorites.productId, products.id))
      .where(eq(favorites.userId, context.user.id));
    
    return result.map(item => ({
      ...item,
      product: parseProductData(item.product)
    }));
  });

export const addToFavorites = protectedProcedure
  .input(z.string())
  .handler(async ({ input, context }) => {
    const existing = await db
      .select()
      .from(favorites)
      .where(and(
        eq(favorites.userId, context.user.id),
        eq(favorites.productId, input)
      ));

    if (existing.length > 0) {
      throw new Error('Already in favorites');
    }

    return await db.insert(favorites).values({
      id: cuid(),
      userId: context.user.id,
      productId: input
    });
  });

export const removeFromFavorites = protectedProcedure
  .input(z.string())
  .handler(async ({ input, context }) => {
    return await db
      .delete(favorites)
      .where(and(
        eq(favorites.userId, context.user.id),
        eq(favorites.productId, input)
      ));
  });