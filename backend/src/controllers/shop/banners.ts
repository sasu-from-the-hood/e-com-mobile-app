import { publicProcedure } from '../../middleware/orpc.js'
import { z } from 'zod'
import { db } from '../../database/db.js'
import { products } from '../../database/schema/products.js'
import { sql, desc, asc, and, gte, lte } from 'drizzle-orm'

// Helper function to get first image path from colorImages
const getFirstImage = (colorImages: any): string => {
  if (!colorImages) return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8';

  const parsed = typeof colorImages === 'string' ? JSON.parse(colorImages || '{}') : colorImages;
  const colors = Object.keys(parsed);

  if (colors.length === 0) return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8';

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
    const banners = []

    // 1. High Discount Featured Products Banner - Get top 2 products with highest discount
    const highDiscountProducts = await db
      .select({
        id: products.id,
        discount: products.discount,
        colorImages: products.colorImages,
        name: products.name
      })
      .from(products)
      .where(and(
        gte(products.discount, 15), // Lowered threshold to 15% to catch more products
        products.isActive,
        products.inStock,
        products.isFeatured
      ))
      .orderBy(desc(products.discount))
      .limit(2) // Get top 2 instead of 1

    // Add each high discount product as a banner
    highDiscountProducts.forEach((product, index) => {
      if (product.discount && Number(product.discount) > 0) {
        banners.push({
          id: `discount-${index + 1}`,
          title: `${Math.round(Number(product.discount))}% off`,
          subtitle: product.name || 'Product',
          imageUrl: getFirstImage(product.colorImages),
          imageAlt: 'Discount product',
          type: 'discount',
          discount: Math.round(Number(product.discount)),
          productId: product.id,
          isActive: true
        })
      }
    })
    
    // 2. Low Stock Alert Banner (creates urgency) - Featured only
    const lowStockProduct = await db
      .select({
        id: products.id,
        name: products.name,
        colorImages: products.colorImages,
        stockQuantity: products.stockQuantity
      })
      .from(products)
      .where(and(
        lte(products.stockQuantity, products.lowStockThreshold),
        products.inStock,
        products.isActive,
        products.isFeatured
      ))
      .orderBy(asc(products.stockQuantity))
      .limit(1)

    if (lowStockProduct[0]) {
      banners.push({
        id: 'urgency-1',
        title: 'Only few left',
        subtitle: lowStockProduct[0].name,
        imageUrl: getFirstImage(lowStockProduct[0].colorImages),
        imageAlt: 'Limited stock product',
        type: 'urgency',
        productId: lowStockProduct[0].id,
        isActive: true
      })
    }

    // 3. Low Price Banner - Featured only - Get 2 products
    const lowPriceProducts = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        colorImages: products.colorImages
      })
      .from(products)
      .where(and(
        sql`${products.price} <= 150`, // Increased threshold to catch more products
        products.isActive,
        products.inStock,
        products.isFeatured
      ))
      .orderBy(asc(products.price))
      .limit(2) // Get 2 instead of 1

    lowPriceProducts.forEach((product, index) => {
      banners.push({
        id: `low-price-${index + 1}`,
        title: `Only ETB ${Math.round(Number(product.price))}`,
        subtitle: product.name,
        imageUrl: getFirstImage(product.colorImages),
        imageAlt: 'Low price product',
        type: 'low_price',
        productId: product.id,
        isActive: true
      })
    })

    // 4. New Arrivals Banner (recent products) - Featured only - Get 2 products
    const newProducts = await db
      .select({
        id: products.id,
        name: products.name,
        colorImages: products.colorImages
      })
      .from(products)
      .where(and(
        gte(products.createdAt, sql`DATE_SUB(NOW(), INTERVAL 30 DAY)`), // Extended to 30 days
        products.isActive,
        products.inStock,
        products.isFeatured
      ))
      .orderBy(desc(products.createdAt))
      .limit(2) // Get 2 instead of 1

    newProducts.forEach((product, index) => {
      banners.push({
        id: `new-arrival-${index + 1}`,
        title: 'New arrival',
        subtitle: product.name,
        imageUrl: getFirstImage(product.colorImages),
        imageAlt: 'New arrival product',
        type: 'new_arrivals',
        productId: product.id,
        isActive: true
      })
    })
    
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
      ]
    }
    
    // Remove duplicates (same product appearing in multiple banner types)
    const uniqueBanners = banners.reduce((acc: any[], current) => {
      const exists = acc.find(banner => banner.productId === current.productId);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);
    
    return uniqueBanners.slice(0, 6) // Increased limit to 6 banners
  })