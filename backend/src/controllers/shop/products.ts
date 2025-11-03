import { z } from 'zod';
import { publicProcedure } from '../../middleware/orpc.js';
import { db } from '../../database/db.js';
import { products, categories } from '../../database/schema/index.js';
import { eq, like, desc, count, and } from 'drizzle-orm';

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

export const getProducts = publicProcedure
  .input(z.object({
    category: z.string().optional(),
    search: z.string().optional(),
    limit: z.number().default(20)
  }))
  .handler(async ({ input }) => {
    const baseQuery = db.select().from(products);
    let result;
    
    if (input.category && input.search) {
      result = await baseQuery
        .where(and(eq(products.categoryId, input.category), like(products.name, `%${input.search}%`)))
        .limit(input.limit)
        .orderBy(desc(products.createdAt));
    } else if (input.category) {
      result = await baseQuery
        .where(eq(products.categoryId, input.category))
        .limit(input.limit)
        .orderBy(desc(products.createdAt));
    } else if (input.search) {
      result = await baseQuery
        .where(like(products.name, `%${input.search}%`))
        .limit(input.limit)
        .orderBy(desc(products.createdAt));
    } else {
      result = await baseQuery.limit(input.limit).orderBy(desc(products.createdAt));
    }
    
    return result.map(parseProductData);
  });

export const getProduct = publicProcedure
  .input(z.string())
  .handler(async ({ input }) => {
    const [product] = await db.select().from(products).where(eq(products.id, input));
    if (!product) throw new Error('Product not found');
    return parseProductData(product);
  });

export const getCategories = publicProcedure
  .handler(async () => {
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        productCount: count(products.id)
      })
      .from(categories)
      .leftJoin(products, eq(categories.id, products.categoryId))
      .groupBy(categories.id);
    
    return result;
  });