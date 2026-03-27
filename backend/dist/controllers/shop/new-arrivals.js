import { publicProcedure } from '../../middleware/orpc.js';
import { z } from 'zod';
import { db } from '../../database/db.js';
import { products } from '../../database/schema/products.js';
import { sql, desc, and, gte } from 'drizzle-orm';
const ProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    image: z.string().nullable(),
    colors: z.array(z.string()),
    sizes: z.array(z.string()),
    tags: z.array(z.string()),
    rating: z.number(),
    reviewCount: z.number(),
    discount: z.number(),
    createdAt: z.date()
});
export const getNewArrivals = publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .handler(async ({ input }) => {
    const newProducts = await db
        .select()
        .from(products)
        .where(and(gte(products.createdAt, sql `DATE_SUB(NOW(), INTERVAL 7 DAY)`), products.isActive, products.inStock))
        .orderBy(desc(products.createdAt))
        .limit(input.limit);
    // Parse JSON fields
    return newProducts.map(product => {
        const colorImages = typeof product.colorImages === 'string' ? JSON.parse(product.colorImages || '{}') : product.colorImages || {};
        const colors = Object.keys(colorImages);
        const firstColorKey = colors.length > 0 ? colors[0] : undefined;
        const images = firstColorKey && colorImages[firstColorKey] ? colorImages[firstColorKey] : [];
        return {
            ...product,
            price: Number(product.price),
            rating: Number(product.rating || 0),
            colorImages,
            colors,
            images,
            sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes || '[]') : product.sizes || [],
            tags: typeof product.tags === 'string' ? JSON.parse(product.tags || '[]') : product.tags || []
        };
    });
});
//# sourceMappingURL=new-arrivals.js.map