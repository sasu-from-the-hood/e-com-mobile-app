import { z } from 'zod';
import { publicProcedure } from '../../middleware/orpc.js';
import { os } from '@orpc/server';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth.js';
import { db } from '../../database/db.js';
import { products, searchHistory } from '../../database/schema/index.js';
import { like, desc, or, sql, eq } from 'drizzle-orm';
import cuid from 'cuid';
const parseProductData = (product) => {
    const colorImages = typeof product.colorImages === 'string' ? JSON.parse(product.colorImages || '{}') : product.colorImages || {};
    const colors = Object.keys(colorImages);
    const firstColorKey = colors.length > 0 ? colors[0] : undefined;
    const images = firstColorKey && colorImages[firstColorKey] ? colorImages[firstColorKey] : [];
    return {
        ...product,
        colorImages,
        colors,
        images,
        sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes || '[]') : product.sizes || [],
        tags: typeof product.tags === 'string' ? JSON.parse(product.tags || '[]') : product.tags || []
    };
};
export const searchProducts = os
    .use(jwtAuthMiddleware)
    .input(z.object({
    query: z.string(),
    limit: z.number().default(20)
}))
    .handler(async ({ input, context }) => {
    const results = await db
        .select()
        .from(products)
        .where(or(like(products.name, `%${input.query}%`), like(products.description, `%${input.query}%`)))
        .limit(input.limit)
        .orderBy(desc(products.rating));
    // Don't save search here - only save when user clicks on a product
    return results.map(parseProductData);
});
export const trackSearchClick = os
    .use(jwtAuthMiddleware)
    .input(z.object({
    productId: z.string()
}))
    .handler(async ({ input, context }) => {
    // Get the product that was clicked
    const product = await db
        .select()
        .from(products)
        .where(eq(products.id, input.productId))
        .limit(1);
    if (product.length === 0) {
        return { success: false, error: 'Product not found' };
    }
    const clickedProduct = product[0];
    if (!clickedProduct) {
        return { success: false, error: 'Product not found' };
    }
    const searchTerm = clickedProduct.name;
    await db.insert(searchHistory).values({
        id: cuid(),
        userId: context.user.id,
        query: searchTerm,
        resultCount: 1,
        clickedProductId: input.productId
    });
    return { success: true };
});
export const getPopularSearches = publicProcedure
    .handler(async () => {
    // Get popular searches from all users (public data)
    const popular = await db
        .select({
        query: searchHistory.query,
        count: sql `COUNT(*)`
    })
        .from(searchHistory)
        .groupBy(searchHistory.query)
        .orderBy(desc(sql `COUNT(*)`))
        .limit(10);
    if (popular.length === 0) {
        return [];
    }
    return popular.map(item => ({
        term: item.query,
        count: item.count
    }));
});
export const getUserSearchHistory = os
    .use(jwtAuthMiddleware)
    .handler(async ({ context }) => {
    const history = await db
        .select({
        query: searchHistory.query,
        count: sql `COUNT(*)`,
        lastSearched: sql `MAX(${searchHistory.createdAt})`
    })
        .from(searchHistory)
        .where(eq(searchHistory.userId, context.user.id))
        .groupBy(searchHistory.query)
        .orderBy(desc(sql `COUNT(*)`))
        .limit(10);
    return history.map(item => ({
        term: item.query,
        count: item.count,
        lastSearched: item.lastSearched
    }));
});
export const clearSearchHistory = os
    .use(jwtAuthMiddleware)
    .handler(async ({ context }) => {
    await db
        .delete(searchHistory)
        .where(eq(searchHistory.userId, context.user.id));
    return { success: true };
});
//# sourceMappingURL=search.js.map