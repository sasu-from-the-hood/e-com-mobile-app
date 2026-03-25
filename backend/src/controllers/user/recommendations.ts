import { z } from 'zod';
import { publicProcedure } from '../../middleware/orpc.js';
import { os } from '@orpc/server';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth.js';
import { db } from '../../database/db.js';
import { products, userInteractions, favorites, searchHistory } from '../../database/schema/index.js';
import { eq, desc, sql, and, inArray, ne, gte } from 'drizzle-orm';

const parseProductData = (product: any) => {
  const colorImages = typeof product.colorImages === 'string' ? JSON.parse(product.colorImages || '{}') : product.colorImages || {}
  const colors = Object.keys(colorImages)
  const images = colors.length > 0 ? colorImages[colors[0]] || [] : []
  
  return {
    ...product,
    colorImages,
    colors,
    images,
    sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes || '[]') : product.sizes || [],
    tags: typeof product.tags === 'string' ? JSON.parse(product.tags || '[]') : product.tags || []
  }
};

export const getRecommendations = os
  .use(jwtAuthMiddleware)
  .input(z.object({ limit: z.number().default(10) }))
  .handler(async ({ input, context }) => {
    // Get new arrivals to exclude from recommendations
    const newArrivals = await db
      .select({ id: products.id })
      .from(products)
      .where(and(
        gte(products.createdAt, sql`DATE_SUB(NOW(), INTERVAL 7 DAY)`),
        products.isActive,
        products.inStock
      ));
    
    const newArrivalIds = newArrivals.map(p => p.id);

    // Advanced recommendation algorithm with multiple factors
    const userHistory = await db
      .select({
        productId: userInteractions.productId,
        score: userInteractions.score,
        categoryId: products.categoryId,
        price: products.price
      })
      .from(userInteractions)
      .innerJoin(products, eq(userInteractions.productId, products.id))
      .where(eq(userInteractions.userId, context.user.id));

    if (userHistory.length === 0) {
      // Smart fallback: trending + discounted + highly rated, excluding new arrivals
      const popular = await db
        .select()
        .from(products)
        .where(and(
          eq(products.isActive, true),
          eq(products.inStock, true),
          newArrivalIds.length > 0 ? sql`${products.id} NOT IN (${newArrivalIds.map(() => '?').join(',')})` : sql`1=1`
        ))
        .orderBy(
          desc(sql`(
            ${products.rating} * 0.4 + 
            ${products.discount} * 0.3 + 
            ${products.reviewCount} * 0.3
          )`)
        )
        .limit(input.limit);
      return popular.map(parseProductData);
    }

    // Extract user preferences
    const preferredCategories = [...new Set(userHistory.map(h => h.categoryId).filter(Boolean))];
    const avgPrice = userHistory.reduce((sum, h) => sum + Number(h.price), 0) / userHistory.length;
    const interactedIds = userHistory.map(h => h.productId);
    const excludeIds = [...interactedIds, ...newArrivalIds];

    // Multi-factor recommendation scoring, excluding new arrivals
    const recommendations = await db
      .select()
      .from(products)
      .where(and(
        eq(products.isActive, true),
        eq(products.inStock, true),
        excludeIds.length > 0 ? sql`${products.id} NOT IN (${excludeIds.map(() => '?').join(',')})` : sql`1=1`
      ))
      .orderBy(
        desc(sql`(
          CASE WHEN ${products.categoryId} IN (${preferredCategories.map(() => '?').join(',') || 'NULL'}) THEN 3 ELSE 0 END +
          CASE WHEN ABS(${products.price} - ${avgPrice}) < ${avgPrice * 0.5} THEN 2 ELSE 0 END +
          ${products.rating} * 0.5 +
          CASE WHEN ${products.discount} > 0 THEN 1 ELSE 0 END +
          RAND() * 0.1
        )`)
      )
      .limit(input.limit);

    return recommendations.map(parseProductData);
  });

export const getPopularSearches = publicProcedure
  .handler(async () => {
    const popular = await db
      .select({
        query: searchHistory.query,
        count: sql<number>`COUNT(*)`
      })
      .from(searchHistory)
      .groupBy(searchHistory.query)
      .orderBy(desc(sql`COUNT(*)`))
      .limit(10);

    return popular.map(item => ({
      term: item.query,
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 5)]
    }));
  });

export const trackInteraction = os
  .use(jwtAuthMiddleware)
  .input(z.object({
    productId: z.string(),
    type: z.enum(['view', 'favorite', 'cart', 'purchase'])
  }))
  .handler(async ({ input, context }) => {
    const scores = { view: 1, favorite: 3, cart: 5, purchase: 10 };
    
    await db.insert(userInteractions).values({
      id: crypto.randomUUID(),
      userId: context.user.id,
      productId: input.productId,
      interactionType: input.type,
      score: scores[input.type]
    });
  });