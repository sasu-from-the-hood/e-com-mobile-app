import { os } from '@orpc/server'
import { z } from 'zod'
import { db } from '../../../database/db.js'
import { 
  inventoryTransactions, 
  stockAlerts, 
  products, 
  productVariants 
} from '../../../database/schema/index.js'
import { eq, and, desc, sql, count, gte, lte } from 'drizzle-orm'
import cuid from 'cuid'
import { authMiddleware } from '../../../middleware/auth.js'

// Get inventory transactions
export const getInventoryTransactions = os
  .input(z.object({
    productId: z.string().optional(),
    variantId: z.string().optional(),
    type: z.enum(['purchase', 'sale', 'adjustment', 'return', 'damage', 'transfer']).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.number().default(1),
    limit: z.number().default(20)
  }))
  .use(authMiddleware)
  .handler(async ({ input, context }) => {
    if (context.user.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const { page, limit } = input
    const offset = (page - 1) * limit

    // Build conditions
    const conditions = []
    
    if (input.productId) {
      conditions.push(eq(inventoryTransactions.productId, input.productId))
    }
    
    if (input.variantId) {
      conditions.push(eq(inventoryTransactions.variantId, input.variantId))
    }
    
    if (input.type) {
      conditions.push(eq(inventoryTransactions.type, input.type))
    }
    
    if (input.startDate) {
      conditions.push(gte(inventoryTransactions.createdAt, new Date(input.startDate)))
    }
    
    if (input.endDate) {
      conditions.push(lte(inventoryTransactions.createdAt, new Date(input.endDate)))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Get transactions with product info
    let query = db
      .select({
        id: inventoryTransactions.id,
        productId: inventoryTransactions.productId,
        productName: products.name,
        variantId: inventoryTransactions.variantId,
        type: inventoryTransactions.type,
        quantity: inventoryTransactions.quantity,
        previousStock: inventoryTransactions.previousStock,
        newStock: inventoryTransactions.newStock,
        unitCost: inventoryTransactions.unitCost,
        totalCost: inventoryTransactions.totalCost,
        referenceType: inventoryTransactions.referenceType,
        referenceId: inventoryTransactions.referenceId,
        reason: inventoryTransactions.reason,
        notes: inventoryTransactions.notes,
        batchNumber: inventoryTransactions.batchNumber,
        expiryDate: inventoryTransactions.expiryDate,
        performedBy: inventoryTransactions.performedBy,
        createdAt: inventoryTransactions.createdAt
      })
      .from(inventoryTransactions)
      .leftJoin(products, eq(inventoryTransactions.productId, products.id))
      .$dynamic()

    if (whereClause) {
      query = query.where(whereClause)
    }

    const transactions = await query
      .orderBy(desc(inventoryTransactions.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count
    const totalQuery = db.select({ count: count() }).from(inventoryTransactions)
    if (whereClause) {
      totalQuery.where(whereClause)
    }
    const [{ count: total }] = await totalQuery

    return {
      transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  })

// Create inventory adjustment
export const createInventoryAdjustment = os
  .input(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number(),
    reason: z.string(),
    notes: z.string().optional(),
    unitCost: z.string().optional(),
    batchNumber: z.string().optional(),
    expiryDate: z.string().optional()
  }))
  .use(authMiddleware)
  .handler(async ({ input, context }) => {
    try {
      if (context.user.role !== 'admin') {
        throw new Error('Unauthorized')
      }

      // Get current stock
      let currentStock = 0
      if (input.variantId) {
        const [variant] = await db
          .select({ stockQuantity: productVariants.stockQuantity })
          .from(productVariants)
          .where(eq(productVariants.id, input.variantId))
        currentStock = variant?.stockQuantity || 0
      } else {
        const [product] = await db
          .select({ stockQuantity: products.stockQuantity })
          .from(products)
          .where(eq(products.id, input.productId))
        currentStock = product?.stockQuantity || 0
      }

      const newStock = Math.max(0, currentStock + input.quantity)

      // Create transaction
      await db.insert(inventoryTransactions).values({
        id: cuid(),
        productId: input.productId,
        variantId: input.variantId,
        type: 'adjustment',
        quantity: input.quantity,
        previousStock: currentStock,
        newStock,
        unitCost: input.unitCost,
        totalCost: input.unitCost ? (parseFloat(input.unitCost) * Math.abs(input.quantity)).toString() : undefined,
        reason: input.reason,
        notes: input.notes,
        batchNumber: input.batchNumber,
        expiryDate: input.expiryDate ? new Date(input.expiryDate) : undefined,
        performedBy: context.user.id
      })

      // Update stock
      if (input.variantId) {
        await db
          .update(productVariants)
          .set({ stockQuantity: newStock })
          .where(eq(productVariants.id, input.variantId))
      } else {
        await db
          .update(products)
          .set({ stockQuantity: newStock })
          .where(eq(products.id, input.productId))
      }

      return { success: true, newStock, previousStock: currentStock }
    } catch (error: any) {
      console.error('Error creating inventory adjustment:', error)
      throw new Error(error.message || 'Failed to create inventory adjustment')
    }
  })

// Get stock alerts
export const getStockAlerts = os
  .input(z.object({
    alertType: z.enum(['low_stock', 'out_of_stock', 'overstock', 'expiry']).optional(),
    isResolved: z.boolean().optional(),
    page: z.number().default(1),
    limit: z.number().default(20)
  }))
  .use(authMiddleware)
  .handler(async ({ input, context }) => {
    if (context.user.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const { page, limit } = input
    const offset = (page - 1) * limit

    // Build conditions
    const conditions = []
    
    if (input.alertType) {
      conditions.push(eq(stockAlerts.alertType, input.alertType))
    }
    
    if (input.isResolved !== undefined) {
      conditions.push(eq(stockAlerts.isResolved, input.isResolved))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Get alerts with product info
    let query = db
      .select({
        id: stockAlerts.id,
        productId: stockAlerts.productId,
        productName: products.name,
        variantId: stockAlerts.variantId,
        alertType: stockAlerts.alertType,
        threshold: stockAlerts.threshold,
        currentStock: stockAlerts.currentStock,
        message: stockAlerts.message,
        isResolved: stockAlerts.isResolved,
        resolvedAt: stockAlerts.resolvedAt,
        resolvedBy: stockAlerts.resolvedBy,
        createdAt: stockAlerts.createdAt
      })
      .from(stockAlerts)
      .leftJoin(products, eq(stockAlerts.productId, products.id))
      .$dynamic()

    if (whereClause) {
      query = query.where(whereClause)
    }

    const alerts = await query
      .orderBy(desc(stockAlerts.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count
    const totalQuery = db.select({ count: count() }).from(stockAlerts)
    if (whereClause) {
      totalQuery.where(whereClause)
    }
    const [{ count: total }] = await totalQuery

    return {
      alerts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  })

// Resolve stock alert
export const resolveStockAlert = os
  .input(z.object({
    alertId: z.string()
  }))
  .use(authMiddleware)
  .handler(async ({ input, context }) => {
    try {
      if (context.user.role !== 'admin') {
        throw new Error('Unauthorized')
      }

      await db
        .update(stockAlerts)
        .set({
          isResolved: true,
          resolvedAt: new Date(),
          resolvedBy: context.user.id
        })
        .where(eq(stockAlerts.id, input.alertId))

      return { success: true }
    } catch (error: any) {
      console.error('Error resolving stock alert:', error)
      throw new Error(error.message || 'Failed to resolve stock alert')
    }
  })

// Generate stock report
export const generateStockReport = os
  .input(z.object({
    includeVariants: z.boolean().default(true),
    lowStockOnly: z.boolean().default(false),
    categoryId: z.string().optional()
  }))
  .use(authMiddleware)
  .handler(async ({ input, context }) => {
    if (context.user.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    // Get products with stock info
    const conditions = [eq(products.isActive, true)]
    
    if (input.categoryId) {
      conditions.push(eq(products.categoryId, input.categoryId))
    }
    
    if (input.lowStockOnly) {
      conditions.push(sql`${products.stockQuantity} <= ${products.lowStockThreshold}`)
    }

    const productsData = await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        stockQuantity: products.stockQuantity,
        lowStockThreshold: products.lowStockThreshold,
        price: products.price,
        inStock: products.inStock
      })
      .from(products)
      .where(and(...conditions))

    // Get variants if requested
    let variantsData: any[] = []
    if (input.includeVariants) {
      const productIds = productsData.map(p => p.id)
      if (productIds.length > 0) {
        variantsData = await db
          .select({
            id: productVariants.id,
            productId: productVariants.productId,
            sku: productVariants.sku,
            color: productVariants.color,
            size: productVariants.size,
            stockQuantity: productVariants.stockQuantity,
            lowStockThreshold: productVariants.lowStockThreshold,
            price: productVariants.price
          })
          .from(productVariants)
          .where(and(
            eq(productVariants.isActive, true),
            sql`${productVariants.productId} IN (${productIds.join(',')})`
          ))
      }
    }

    // Calculate totals
    const totalProducts = productsData.length
    const lowStockProducts = productsData.filter(p => p.stockQuantity <= p.lowStockThreshold).length
    const outOfStockProducts = productsData.filter(p => !p.inStock || p.stockQuantity === 0).length
    const totalStockValue = productsData.reduce((sum, p) => sum + (p.stockQuantity * parseFloat(p.price)), 0)

    return {
      summary: {
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        totalStockValue: totalStockValue.toFixed(2)
      },
      products: productsData,
      variants: variantsData,
      generatedAt: new Date()
    }
  })