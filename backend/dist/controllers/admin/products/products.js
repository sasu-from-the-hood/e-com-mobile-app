import { os } from '@orpc/server';
import { z } from 'zod';
import { db } from '../../../database/db.js';
import { products, categories, warehouses, productVariants, productMedia, productSeo, inventoryTransactions, stockAlerts } from '../../../database/schema/index.js';
import { eq, and, desc, asc, sql, count } from 'drizzle-orm';
import cuid from 'cuid';
import { authMiddleware } from '../../../middleware/auth.js';
import * as fs from 'fs';
import * as path from 'path';
// Enhanced product creation schema
const createProductSchema = z.object({
    name: z.string().min(1),
    slug: z.string().optional(),
    description: z.string().optional(),
    price: z.string(),
    originalPrice: z.string().optional(),
    categoryId: z.string().optional(),
    warehouseId: z.string().optional(),
    sku: z.string().optional(),
    stockQuantity: z.number().default(0),
    lowStockThreshold: z.number().default(10),
    discount: z.number().default(0),
    weight: z.string().optional(),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    isDigital: z.boolean().default(false),
    inStock: z.boolean().default(true),
    sizes: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    variantStock: z.record(z.string(), z.number()).optional(),
    reviewCount: z.number().default(0),
    colorImages: z.record(z.string(), z.array(z.union([z.string(), z.instanceof(File)]))).optional(),
    // Enhanced fields
    variants: z.array(z.object({
        color: z.string().optional(),
        size: z.string().optional(),
        material: z.string().optional(),
        price: z.string().optional(),
        stockQuantity: z.number().default(0),
        sku: z.string(),
        images: z.array(z.union([z.string(), z.instanceof(File)])).optional()
    })).optional(),
    // SEO fields
    seo: z.object({
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        metaKeywords: z.string().optional(),
        ogTitle: z.string().optional(),
        ogDescription: z.string().optional()
    }).optional(),
    // Attributes
    attributes: z.record(z.string(), z.any()).optional()
});
// Get admin products with enhanced filtering
export const getAdminProducts = os
    .input(z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(['active', 'inactive', 'all']).default('all'),
    stockStatus: z.enum(['in_stock', 'low_stock', 'out_of_stock', 'all']).default('all'),
    page: z.number().default(1),
    limit: z.number().default(10),
    sortBy: z.enum(['name', 'price', 'stock', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
}))
    .use(authMiddleware)
    .handler(async ({ input, context }) => {
    if (context.user.role !== 'admin') {
        throw new Error('Unauthorized');
    }
    const { search, category, status, stockStatus, page, limit, sortBy, sortOrder } = input;
    const offset = (page - 1) * limit;
    // Build conditions
    const conditions = [];
    if (search) {
        conditions.push(sql `(${products.name} LIKE ${`%${search}%`} OR ${products.description} LIKE ${`%${search}%`} OR ${products.sku} LIKE ${`%${search}%`})`);
    }
    if (category) {
        conditions.push(eq(products.categoryId, category));
    }
    if (status !== 'all') {
        conditions.push(eq(products.isActive, status === 'active'));
    }
    if (stockStatus !== 'all') {
        switch (stockStatus) {
            case 'out_of_stock':
                conditions.push(eq(products.inStock, false));
                break;
            case 'low_stock':
                conditions.push(sql `${products.stockQuantity} <= ${products.lowStockThreshold} AND ${products.inStock} = true`);
                break;
            case 'in_stock':
                conditions.push(sql `${products.stockQuantity} > ${products.lowStockThreshold} AND ${products.inStock} = true`);
                break;
        }
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    // Build order clause
    let orderColumn;
    switch (sortBy) {
        case 'name':
            orderColumn = products.name;
            break;
        case 'price':
            orderColumn = products.price;
            break;
        case 'stock':
            orderColumn = products.stockQuantity;
            break;
        default:
            orderColumn = products.createdAt;
    }
    const orderFn = sortOrder === 'asc' ? asc(orderColumn) : desc(orderColumn);
    // Main query with enhanced data
    let query = db.select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        sku: products.sku,
        price: products.price,
        originalPrice: products.originalPrice,
        discount: products.discount,
        stockQuantity: products.stockQuantity,
        lowStockThreshold: products.lowStockThreshold,
        weight: products.weight,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        isDigital: products.isDigital,
        inStock: products.inStock,
        sizes: products.sizes,
        tags: products.tags,
        colorImages: products.colorImages,
        variantStock: products.variantStock,
        categoryId: products.categoryId,
        categoryName: categories.name,
        warehouseId: products.warehouseId,
        warehouseName: warehouses.name,
        rating: products.rating,
        reviewCount: products.reviewCount,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt
    })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(warehouses, eq(products.warehouseId, warehouses.id))
        .$dynamic();
    if (whereClause) {
        query = query.where(whereClause);
    }
    const result = await query.orderBy(orderFn).limit(limit).offset(offset);
    console.log('=== GET ADMIN PRODUCTS ===');
    console.log('First product variantStock:', result[0]?.variantStock);
    console.log('First product variantStock type:', typeof result[0]?.variantStock);
    // Get total count
    const totalQuery = db.select({ count: count() }).from(products);
    if (whereClause) {
        totalQuery.where(whereClause);
    }
    const totalResult = await totalQuery;
    const total = totalResult[0]?.count ?? 0;
    // Enhance each product with variant and media info
    const enhancedProducts = await Promise.all(result.map(async (product) => {
        // Get variant count and stock
        const variantStats = await db
            .select({
            count: count(),
            totalStock: sql `COALESCE(SUM(${productVariants.stockQuantity}), 0)`
        })
            .from(productVariants)
            .where(eq(productVariants.productId, product.id));
        // Get media count
        const mediaCount = await db
            .select({ count: count() })
            .from(productMedia)
            .where(eq(productMedia.productId, product.id));
        // Get stock alerts
        const alertCount = await db
            .select({ count: count() })
            .from(stockAlerts)
            .where(and(eq(stockAlerts.productId, product.id), eq(stockAlerts.isResolved, false)));
        return {
            ...product,
            stats: {
                variantCount: variantStats[0]?.count || 0,
                totalVariantStock: variantStats[0]?.totalStock || 0,
                mediaCount: mediaCount[0]?.count || 0,
                alertCount: alertCount[0]?.count || 0,
                stockStatus: product.inStock
                    ? ((product.stockQuantity ?? 0) <= (product.lowStockThreshold ?? 0) ? 'low_stock' : 'in_stock')
                    : 'out_of_stock'
            }
        };
    }));
    return {
        products: enhancedProducts,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
});
// Enhanced product creation
export const createProduct = os
    .input(createProductSchema)
    .use(authMiddleware)
    .handler(async ({ input, context }) => {
    try {
        if (context.user.role !== 'admin') {
            throw new Error('Unauthorized');
        }
        const uploadDir = path.join(process.cwd(), 'uploads', 'products');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        // Process main product images
        const colorImagesUrls = {};
        if (input.colorImages) {
            for (const [color, files] of Object.entries(input.colorImages)) {
                colorImagesUrls[color] = [];
                for (const file of files) {
                    const timestamp = Date.now();
                    const randomId = Math.round(Math.random() * 1E9);
                    const extension = file.name.split('.').pop() || 'jpg';
                    const filename = `product-${timestamp}-${randomId}.${extension}`;
                    const filePath = path.join(uploadDir, filename);
                    const buffer = Buffer.from(await file.arrayBuffer());
                    fs.writeFileSync(filePath, buffer);
                    colorImagesUrls[color].push(`/uploads/products/${filename}`);
                }
            }
        }
        const productId = cuid();
        const slug = input.slug || input.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        // Create main product
        await db.insert(products).values({
            id: productId,
            slug,
            name: input.name,
            description: input.description || undefined,
            price: input.price,
            originalPrice: input.originalPrice && input.originalPrice !== '' ? input.originalPrice : null,
            categoryId: input.categoryId && input.categoryId !== '' ? input.categoryId : null,
            warehouseId: input.warehouseId && input.warehouseId !== '' ? input.warehouseId : null,
            sku: input.sku || undefined,
            stockQuantity: input.stockQuantity,
            lowStockThreshold: input.lowStockThreshold,
            discount: input.discount && typeof input.discount === 'number' && input.discount > 0 ? input.discount : null,
            weight: input.weight && input.weight !== '' ? input.weight : null,
            isActive: input.isActive,
            isFeatured: input.isFeatured,
            isDigital: input.isDigital,
            inStock: input.inStock,
            sizes: input.sizes && input.sizes.length > 0 ? input.sizes : undefined,
            tags: input.tags && input.tags.length > 0 ? input.tags : undefined,
            variantStock: input.variantStock || undefined,
            reviewCount: input.reviewCount || 0,
            colorImages: Object.keys(colorImagesUrls).length > 0 ? colorImagesUrls : undefined
        });
        // Create product variants if provided
        if (input.variants && input.variants.length > 0) {
            for (const variant of input.variants) {
                const variantId = cuid();
                // Process variant images
                const variantImages = [];
                if (variant.images) {
                    for (const image of variant.images) {
                        if (typeof image === 'string') {
                            variantImages.push(image);
                        }
                        else {
                            const timestamp = Date.now();
                            const randomId = Math.round(Math.random() * 1E9);
                            const extension = image.name.split('.').pop() || 'jpg';
                            const filename = `variant-${timestamp}-${randomId}.${extension}`;
                            const filePath = path.join(uploadDir, filename);
                            const buffer = Buffer.from(await image.arrayBuffer());
                            fs.writeFileSync(filePath, buffer);
                            variantImages.push(`/uploads/products/${filename}`);
                        }
                    }
                }
                await db.insert(productVariants).values({
                    id: variantId,
                    productId,
                    sku: variant.sku,
                    color: variant.color,
                    size: variant.size,
                    material: variant.material,
                    price: variant.price,
                    stockQuantity: variant.stockQuantity,
                    images: variantImages.length > 0 ? variantImages : undefined
                });
                // Create inventory transaction for initial stock
                if (variant.stockQuantity > 0) {
                    await db.insert(inventoryTransactions).values({
                        id: cuid(),
                        productId,
                        variantId,
                        type: 'purchase',
                        quantity: variant.stockQuantity,
                        previousStock: 0,
                        newStock: variant.stockQuantity,
                        reason: 'Initial stock',
                        performedBy: context.user.id
                    });
                }
            }
        }
        // Create SEO data if provided
        if (input.seo) {
            await db.insert(productSeo).values({
                id: cuid(),
                productId,
                metaTitle: input.seo.metaTitle,
                metaDescription: input.seo.metaDescription,
                metaKeywords: input.seo.metaKeywords,
                ogTitle: input.seo.ogTitle,
                ogDescription: input.seo.ogDescription
            });
        }
        // Create initial inventory transaction
        if (input.stockQuantity > 0) {
            await db.insert(inventoryTransactions).values({
                id: cuid(),
                productId,
                type: 'purchase',
                quantity: input.stockQuantity,
                previousStock: 0,
                newStock: input.stockQuantity,
                reason: 'Initial stock',
                performedBy: context.user.id
            });
        }
        // Get the created product with all relations
        const [createdProduct] = await db.select().from(products).where(eq(products.id, productId));
        console.log('=== CREATED PRODUCT ===');
        console.log('variantStock saved:', createdProduct?.variantStock);
        return createdProduct;
    }
    catch (error) {
        console.error('Error creating product:', error);
        throw new Error(error.message || 'Failed to create product');
    }
});
// Enhanced product update
export const updateProduct = os
    .input(z.object({
    id: z.string(),
    data: createProductSchema.partial()
}))
    .use(authMiddleware)
    .handler(async ({ input, context }) => {
    try {
        if (context.user.role !== 'admin') {
            throw new Error('Unauthorized');
        }
        const uploadDir = path.join(process.cwd(), 'uploads', 'products');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const updateData = {};
        // Process image updates
        if (input.data.colorImages) {
            const colorImagesUrls = {};
            for (const [color, items] of Object.entries(input.data.colorImages)) {
                colorImagesUrls[color] = [];
                for (const item of items) {
                    if (typeof item === 'string') {
                        colorImagesUrls[color].push(item);
                    }
                    else {
                        const timestamp = Date.now();
                        const randomId = Math.round(Math.random() * 1E9);
                        const extension = item.name.split('.').pop() || 'jpg';
                        const filename = `product-${timestamp}-${randomId}.${extension}`;
                        const filePath = path.join(uploadDir, filename);
                        const buffer = Buffer.from(await item.arrayBuffer());
                        fs.writeFileSync(filePath, buffer);
                        colorImagesUrls[color].push(`/uploads/products/${filename}`);
                    }
                }
            }
            updateData.colorImages = colorImagesUrls;
        }
        // Update basic fields
        const fieldsToUpdate = [
            'name', 'slug', 'description', 'price', 'originalPrice', 'categoryId', 'warehouseId',
            'sku', 'stockQuantity', 'lowStockThreshold', 'discount', 'weight',
            'isActive', 'isFeatured', 'isDigital', 'inStock', 'sizes', 'tags',
            'variantStock', 'reviewCount'
        ];
        fieldsToUpdate.forEach(field => {
            if (input.data[field] !== undefined) {
                let value = input.data[field];
                // Handle empty strings for foreign key fields - convert to null
                if ((field === 'categoryId' || field === 'warehouseId') && (value === '' || value === null)) {
                    value = null;
                }
                // Handle empty strings for numeric fields - convert to null
                if (['weight', 'discount', 'originalPrice'].includes(field) && (value === '' || value === null)) {
                    value = null;
                }
                updateData[field] = value;
            }
        });
        // Handle slug generation
        if (input.data.name && !input.data.slug) {
            updateData.slug = input.data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
        // Log what we're about to save
        console.log('=== UPDATE PRODUCT DEBUG ===');
        console.log('Product ID:', input.id);
        console.log('variantStock in input.data:', input.data.variantStock);
        console.log('variantStock in updateData:', updateData.variantStock);
        console.log('Full updateData:', JSON.stringify(updateData, null, 2));
        // Update product
        await db.update(products).set(updateData).where(eq(products.id, input.id));
        // Update SEO if provided
        if (input.data.seo) {
            const existingSeo = await db.select().from(productSeo).where(eq(productSeo.productId, input.id)).limit(1);
            if (existingSeo.length > 0) {
                await db.update(productSeo)
                    .set(input.data.seo)
                    .where(eq(productSeo.productId, input.id));
            }
            else {
                await db.insert(productSeo).values({
                    id: cuid(),
                    productId: input.id,
                    ...input.data.seo
                });
            }
        }
        // Create inventory transaction for stock changes
        if (input.data.stockQuantity !== undefined) {
            const [currentProduct] = await db.select({ stockQuantity: products.stockQuantity })
                .from(products).where(eq(products.id, input.id));
            const previousStock = currentProduct?.stockQuantity || 0;
            const difference = input.data.stockQuantity - previousStock;
            if (difference !== 0) {
                await db.insert(inventoryTransactions).values({
                    id: cuid(),
                    productId: input.id,
                    type: 'adjustment',
                    quantity: difference,
                    previousStock,
                    newStock: input.data.stockQuantity,
                    reason: 'Manual adjustment',
                    performedBy: context.user.id
                });
            }
        }
        const [updatedProduct] = await db.select().from(products).where(eq(products.id, input.id));
        console.log('=== UPDATED PRODUCT ===');
        console.log('variantStock after update:', updatedProduct?.variantStock);
        return updatedProduct;
    }
    catch (error) {
        console.error('Error updating product:', error);
        throw new Error(error.message || 'Failed to update product');
    }
});
// Delete product
export const deleteProduct = os
    .input(z.object({ id: z.string() }))
    .use(authMiddleware)
    .handler(async ({ input, context }) => {
    try {
        if (context.user.role !== 'admin') {
            throw new Error('Unauthorized');
        }
        // Soft delete by setting isActive to false
        await db.update(products)
            .set({ isActive: false })
            .where(eq(products.id, input.id));
        return { success: true };
    }
    catch (error) {
        console.error('Error deleting product:', error);
        throw new Error(error.message || 'Failed to delete product');
    }
});
// Get product analytics
export const getProductAnalytics = os
    .input(z.object({
    productId: z.string().optional(),
    period: z.enum(['7d', '30d', '90d', '1y']).default('30d')
}))
    .use(authMiddleware)
    .handler(async ({ input, context }) => {
    if (context.user.role !== 'admin') {
        throw new Error('Unauthorized');
    }
    // Calculate date range
    const now = new Date();
    const daysBack = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365
    }[input.period];
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    // Get inventory transactions for the period
    // Build where conditions
    const transactionWhere = input.productId
        ? and(sql `${inventoryTransactions.createdAt} >= ${startDate}`, eq(inventoryTransactions.productId, input.productId))
        : sql `${inventoryTransactions.createdAt} >= ${startDate}`;
    const transactionQuery = db
        .select({
        date: sql `DATE(${inventoryTransactions.createdAt})`,
        type: inventoryTransactions.type,
        quantity: sql `SUM(${inventoryTransactions.quantity})`,
        count: count()
    })
        .from(inventoryTransactions)
        .where(transactionWhere)
        .groupBy(sql `DATE(${inventoryTransactions.createdAt})`, inventoryTransactions.type);
    const transactions = await transactionQuery;
    // Get current stock alerts
    const alertWhere = input.productId
        ? and(eq(stockAlerts.isResolved, false), eq(stockAlerts.productId, input.productId))
        : eq(stockAlerts.isResolved, false);
    const alertQuery = db
        .select({
        alertType: stockAlerts.alertType,
        count: count()
    })
        .from(stockAlerts)
        .where(alertWhere)
        .groupBy(stockAlerts.alertType);
    const alerts = await alertQuery;
    return {
        transactions,
        alerts,
        period: input.period
    };
});
//# sourceMappingURL=products.js.map