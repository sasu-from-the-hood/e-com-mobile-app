import { publicProcedure } from '../../middleware/orpc.js';
import { z } from 'zod';
import { db } from '../../database/db.js';
import { products } from '../../database/schema/products.js';
import { sql, desc, asc, and, gte, lte } from 'drizzle-orm';
// Helper function to get first image path from colorImages
const getFirstImage = (colorImages) => {
    if (!colorImages)
        return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8';
    const parsed = typeof colorImages === 'string' ? JSON.parse(colorImages || '{}') : colorImages;
    const colors = Object.keys(parsed);
    if (colors.length === 0)
        return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8';
    const firstColorKey = colors[0];
    const firstColorImages = firstColorKey ? parsed[firstColorKey] : undefined;
    if (!firstColorImages || firstColorImages.length === 0) {
        return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8';
    }
    const imagePath = firstColorImages[0];
    // Return the path as-is, let frontend handle base URL
    return imagePath;
};
export const getBanners = publicProcedure
    .output(z.array(z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string(),
    imageUrl: z.string(),
    imageAlt: z.string(),
    type: z.string().optional(),
    discount: z.number().optional(),
    productId: z.string().optional(),
    isActive: z.boolean().optional()
})))
    .handler(async () => {
    const banners = [];
    // 1. High Discount Featured Products Banner
    const highDiscountProduct = await db
        .select({
        id: products.id,
        discount: products.discount,
        colorImages: products.colorImages,
        name: products.name
    })
        .from(products)
        .where(and(gte(products.discount, 20), products.isActive, products.inStock, products.isFeatured))
        .orderBy(desc(products.discount))
        .limit(1);
    if (highDiscountProduct[0]?.discount && Number(highDiscountProduct[0].discount) > 0) {
        banners.push({
            id: '1',
            title: `${Math.round(Number(highDiscountProduct[0].discount))}% off`,
            subtitle: highDiscountProduct[0].name || 'Product',
            imageUrl: getFirstImage(highDiscountProduct[0].colorImages),
            imageAlt: 'Discount product',
            type: 'discount',
            discount: Math.round(Number(highDiscountProduct[0].discount)),
            productId: highDiscountProduct[0].id,
            isActive: true
        });
    }
    // 2. Low Stock Alert Banner (creates urgency) - Featured only
    const lowStockProduct = await db
        .select({
        id: products.id,
        name: products.name,
        colorImages: products.colorImages,
        stockQuantity: products.stockQuantity
    })
        .from(products)
        .where(and(lte(products.stockQuantity, products.lowStockThreshold), products.inStock, products.isActive, products.isFeatured))
        .orderBy(asc(products.stockQuantity))
        .limit(1);
    if (lowStockProduct[0]) {
        banners.push({
            id: '2',
            title: 'Only few left',
            subtitle: lowStockProduct[0].name,
            imageUrl: getFirstImage(lowStockProduct[0].colorImages),
            imageAlt: 'Limited stock product',
            type: 'urgency',
            productId: lowStockProduct[0].id,
            isActive: true
        });
    }
    // 3. Low Price Banner - Featured only
    const lowPriceProduct = await db
        .select({
        id: products.id,
        name: products.name,
        price: products.price,
        colorImages: products.colorImages
    })
        .from(products)
        .where(and(sql `${products.price} <= 25`, products.isActive, products.inStock, products.isFeatured))
        .orderBy(asc(products.price))
        .limit(1);
    if (lowPriceProduct[0]) {
        banners.push({
            id: '3',
            title: `Only ETB ${Math.round(Number(lowPriceProduct[0].price))}`,
            subtitle: lowPriceProduct[0].name,
            imageUrl: getFirstImage(lowPriceProduct[0].colorImages),
            imageAlt: 'Low price product',
            type: 'low_price',
            productId: lowPriceProduct[0].id,
            isActive: true
        });
    }
    // 4. New Arrivals Banner (recent products) - Featured only
    const newProduct = await db
        .select({
        id: products.id,
        name: products.name,
        colorImages: products.colorImages
    })
        .from(products)
        .where(and(gte(products.createdAt, sql `DATE_SUB(NOW(), INTERVAL 7 DAY)`), products.isActive, products.inStock, products.isFeatured))
        .orderBy(desc(products.createdAt))
        .limit(1);
    if (newProduct[0]) {
        banners.push({
            id: '4',
            title: 'New arrival',
            subtitle: newProduct[0].name,
            imageUrl: getFirstImage(newProduct[0].colorImages),
            imageAlt: 'New arrival product',
            type: 'new_arrivals',
            productId: newProduct[0].id,
            isActive: true
        });
    }
    // Fallback banners if no featured products
    if (banners.length === 0) {
        return [
            {
                id: '1',
                title: 'Welcome to our store',
                subtitle: 'discover amazing products',
                imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
                imageAlt: 'Welcome banner',
                type: 'welcome',
                isActive: true
            }
        ];
    }
    return banners.slice(0, 4); // Limit to 4 banners
});
//# sourceMappingURL=banners.js.map