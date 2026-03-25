import { os } from '@orpc/server'
import { z } from 'zod'
import { db } from '../../../database/db.js'
import { productVariants, inventoryTransactions } from '../../../database/schema/index.js'
import { eq, and } from 'drizzle-orm'
import cuid from 'cuid'
import { authMiddleware } from '../../../middleware/auth.js'
import * as fs from 'fs'
import * as path from 'path'

const variantSchema = z.object({
  productId: z.string(),
  sku: z.string(),
  color: z.string().optional(),
  size: z.string().optional(),
  material: z.string().optional(),
  price: z.string().optional(),
  originalPrice: z.string().optional(),
  stockQuantity: z.number().default(0),
  lowStockThreshold: z.number().default(5),
  weight: z.string().optional(),
  dimensions: z.object({
    length: z.number(),
    width: z.number(),
    height: z.number()
  }).optional(),
  images: z.array(z.union([z.string(), z.instanceof(File)])).optional(),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false)
})

// Get variants for a product
export const getProductVariants = os
  .input(z.object({ productId: z.string() }))
  .use(authMiddleware)
  .handler(async ({ input, context }) => {
    if (context.user.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const variants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, input.productId))

    return variants.map(variant => ({
      ...variant,
      images: typeof variant.images === 'string' ? JSON.parse(variant.images || '[]') : variant.images || [],
      dimensions: typeof variant.dimensions === 'string' ? JSON.parse(variant.dimensions || '{}') : variant.dimensions || {}
    }))
  })

// Create product variant
export const createProductVariant = os
  .input(variantSchema)
  .use(authMiddleware)
  .handler(async ({ input, context }) => {
    try {
      if (context.user.role !== 'admin') {
        throw new Error('Unauthorized')
      }

      const uploadDir = path.join(process.cwd(), 'uploads', 'products')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      // Process variant images
      const variantImages: string[] = []
      if (input.images) {
        for (const image of input.images) {
          if (typeof image === 'string') {
            variantImages.push(image)
          } else {
            const timestamp = Date.now()
            const randomId = Math.round(Math.random() * 1E9)
            const extension = image.name.split('.').pop() || 'jpg'
            const filename = `variant-${timestamp}-${randomId}.${extension}`
            const filePath = path.join(uploadDir, filename)
            const buffer = Buffer.from(await image.arrayBuffer())
            fs.writeFileSync(filePath, buffer)
            variantImages.push(`/uploads/products/${filename}`)
          }
        }
      }

      const variantId = cuid()

      // Create variant
      await db.insert(productVariants).values({
        id: variantId,
        productId: input.productId,
        sku: input.sku,
        color: input.color,
        size: input.size,
        material: input.material,
        price: input.price,
        originalPrice: input.originalPrice,
        stockQuantity: input.stockQuantity,
        lowStockThreshold: input.lowStockThreshold,
        weight: input.weight,
        dimensions: input.dimensions,
        images: variantImages.length > 0 ? variantImages : undefined,
        isActive: input.isActive,
        isDefault: input.isDefault
      })

      // Create inventory transaction for initial stock
      if (input.stockQuantity > 0) {
        await db.insert(inventoryTransactions).values({
          id: cuid(),
          productId: input.productId,
          variantId,
          type: 'purchase',
          quantity: input.stockQuantity,
          previousStock: 0,
          newStock: input.stockQuantity,
          reason: 'Initial variant stock',
          performedBy: context.user.id
        })
      }

      const [createdVariant] = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.id, variantId))

      return createdVariant
    } catch (error: any) {
      console.error('Error creating variant:', error)
      throw new Error(error.message || 'Failed to create variant')
    }
  })

// Update product variant
export const updateProductVariant = os
  .input(z.object({
    id: z.string(),
    data: variantSchema.partial().omit({ productId: true })
  }))
  .use(authMiddleware)
  .handler(async ({ input, context }) => {
    try {
      if (context.user.role !== 'admin') {
        throw new Error('Unauthorized')
      }

      const uploadDir = path.join(process.cwd(), 'uploads', 'products')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      const updateData: any = { ...input.data }

      // Process image updates
      if (input.data.images) {
        const variantImages: string[] = []
        for (const image of input.data.images) {
          if (typeof image === 'string') {
            variantImages.push(image)
          } else {
            const timestamp = Date.now()
            const randomId = Math.round(Math.random() * 1E9)
            const extension = image.name.split('.').pop() || 'jpg'
            const filename = `variant-${timestamp}-${randomId}.${extension}`
            const filePath = path.join(uploadDir, filename)
            const buffer = Buffer.from(await image.arrayBuffer())
            fs.writeFileSync(filePath, buffer)
            variantImages.push(`/uploads/products/${filename}`)
          }
        }
        updateData.images = variantImages.length > 0 ? variantImages : undefined
      }

      // Handle stock quantity changes
      if (input.data.stockQuantity !== undefined) {
        const [currentVariant] = await db
          .select({ stockQuantity: productVariants.stockQuantity, productId: productVariants.productId })
          .from(productVariants)
          .where(eq(productVariants.id, input.id))

        if (currentVariant) {
          const previousStock = currentVariant.stockQuantity || 0
          const difference = input.data.stockQuantity - previousStock

          if (difference !== 0) {
            await db.insert(inventoryTransactions).values({
              id: cuid(),
              productId: currentVariant.productId,
              variantId: input.id,
              type: 'adjustment',
              quantity: difference,
              previousStock,
              newStock: input.data.stockQuantity,
              reason: 'Manual variant adjustment',
              performedBy: context.user.id
            })
          }
        }
      }

      // Update variant
      await db
        .update(productVariants)
        .set(updateData)
        .where(eq(productVariants.id, input.id))

      const [updatedVariant] = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.id, input.id))

      return updatedVariant
    } catch (error: any) {
      console.error('Error updating variant:', error)
      throw new Error(error.message || 'Failed to update variant')
    }
  })

// Delete product variant
export const deleteProductVariant = os
  .input(z.object({ id: z.string() }))
  .use(authMiddleware)
  .handler(async ({ input, context }) => {
    try {
      if (context.user.role !== 'admin') {
        throw new Error('Unauthorized')
      }

      // Soft delete by setting isActive to false
      await db
        .update(productVariants)
        .set({ isActive: false })
        .where(eq(productVariants.id, input.id))

      return { success: true }
    } catch (error: any) {
      console.error('Error deleting variant:', error)
      throw new Error(error.message || 'Failed to delete variant')
    }
  })

// Bulk update variant stock
export const bulkUpdateVariantStock = os
  .input(z.object({
    updates: z.array(z.object({
      variantId: z.string(),
      stockQuantity: z.number(),
      reason: z.string().optional()
    }))
  }))
  .use(authMiddleware)
  .handler(async ({ input, context }) => {
    try {
      if (context.user.role !== 'admin') {
        throw new Error('Unauthorized')
      }

      const results = []

      for (const update of input.updates) {
        // Get current stock
        const [currentVariant] = await db
          .select({ 
            stockQuantity: productVariants.stockQuantity, 
            productId: productVariants.productId 
          })
          .from(productVariants)
          .where(eq(productVariants.id, update.variantId))

        if (currentVariant) {
          const previousStock = currentVariant.stockQuantity || 0
          const difference = update.stockQuantity - previousStock

          // Update variant stock
          await db
            .update(productVariants)
            .set({ stockQuantity: update.stockQuantity })
            .where(eq(productVariants.id, update.variantId))

          // Create inventory transaction
          if (difference !== 0) {
            await db.insert(inventoryTransactions).values({
              id: cuid(),
              productId: currentVariant.productId,
              variantId: update.variantId,
              type: 'adjustment',
              quantity: difference,
              previousStock,
              newStock: update.stockQuantity,
              reason: update.reason || 'Bulk stock update',
              performedBy: context.user.id
            })
          }

          results.push({
            variantId: update.variantId,
            previousStock,
            newStock: update.stockQuantity,
            difference
          })
        }
      }

      return { success: true, results }
    } catch (error: any) {
      console.error('Error bulk updating variant stock:', error)
      throw new Error(error.message || 'Failed to bulk update variant stock')
    }
  })