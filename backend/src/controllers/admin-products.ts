import { os } from '@orpc/server'
import { z } from 'zod'
import { db } from '../database/db.js'
import { products } from '../database/schema/products.js'
import { categories } from '../database/schema/categories.js'
import { eq, like, and, desc, asc, sql } from 'drizzle-orm'
import cuid from 'cuid'
import { authMiddleware } from '../middleware/auth.js'
import * as fs from 'fs'
import * as path from 'path'

const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.string(),
  originalPrice: z.string().optional(),
  categoryId: z.string().optional(),
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
  colorImages: z.record(z.string(), z.array(z.union([z.string(), z.instanceof(File)]))).optional()
})

export const getAdminProducts = os
  .input(z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    page: z.number().default(1),
    limit: z.number().default(10),
    sortBy: z.enum(['name', 'price', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  }))
  .use(authMiddleware)
  .handler(async ({ input, context }) => {
    if (context.user.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const { search, category, page, limit, sortBy, sortOrder } = input
    const offset = (page - 1) * limit

    const conditions = []
    if (search) {
      conditions.push(like(products.name, `%${search}%`))
    }
    if (category) {
      conditions.push(eq(products.categoryId, category))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined
    const orderColumn = sortBy === 'name' ? products.name : 
                       sortBy === 'price' ? products.price : products.createdAt
    const orderFn = sortOrder === 'asc' ? asc(orderColumn) : desc(orderColumn)

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
      categoryId: products.categoryId,
      createdAt: products.createdAt,
      categoryName: categories.name
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .$dynamic()

    if (whereClause) {
      query = query.where(whereClause)
    }

    const result = await query.orderBy(orderFn).limit(limit).offset(offset)
    
    const totalResults = await db.select({ count: sql<number>`count(*)` }).from(products)
    const total = totalResults[0]?.count || 0

    return {
      products: result,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }
  })

export const createProduct = os
  .input(createProductSchema)
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

      const colorImagesUrls: Record<string, string[]> = {}
      if (input.colorImages) {
        for (const [color, files] of Object.entries(input.colorImages)) {
          colorImagesUrls[color] = []
          for (const file of files as File[]) {
            const timestamp = Date.now()
            const randomId = Math.round(Math.random() * 1E9)
            const extension = file.name.split('.').pop() || 'jpg'
            const filename = `product-${timestamp}-${randomId}.${extension}`
            const filePath = path.join(uploadDir, filename)
            const buffer = Buffer.from(await file.arrayBuffer())
            fs.writeFileSync(filePath, buffer)
            colorImagesUrls[color].push(`/uploads/products/${filename}`)
          }
        }
      }

      const id = cuid()
      const slug = input.slug || input.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

      await db
        .insert(products)
        .values({
          id,
          slug,
          name: input.name,
          description: input.description || undefined,
          price: input.price,
          originalPrice: input.originalPrice || undefined,
          categoryId: input.categoryId || undefined,
          sku: input.sku || undefined,
          stockQuantity: input.stockQuantity,
          lowStockThreshold: input.lowStockThreshold,
          discount: input.discount,
          weight: input.weight || undefined,
          isActive: input.isActive,
          isFeatured: input.isFeatured,
          isDigital: input.isDigital,
          inStock: input.inStock,
          sizes: input.sizes && input.sizes.length > 0 ? input.sizes : undefined,
          tags: input.tags && input.tags.length > 0 ? input.tags : undefined,
          colorImages: Object.keys(colorImagesUrls).length > 0 ? colorImagesUrls : undefined
        })

      const [product] = await db.select().from(products).where(eq(products.id, id))
      return product
    } catch (error: any) {
      console.error('Error creating product:', error)
      throw new Error(error.message || 'Failed to create product')
    }
  })

export const updateProduct = os
  .input(z.object({
    id: z.string(),
    data: createProductSchema.partial()
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

      const updateData: any = {}

      if (input.data.colorImages) {
        const colorImagesUrls: Record<string, string[]> = {}
        for (const [color, items] of Object.entries(input.data.colorImages)) {
          colorImagesUrls[color] = []
          for (const item of items as any[]) {
            if (typeof item === 'string') {
              colorImagesUrls[color].push(item)
            } else {
              const timestamp = Date.now()
              const randomId = Math.round(Math.random() * 1E9)
              const extension = item.name.split('.').pop() || 'jpg'
              const filename = `product-${timestamp}-${randomId}.${extension}`
              const filePath = path.join(uploadDir, filename)
              const buffer = Buffer.from(await item.arrayBuffer())
              fs.writeFileSync(filePath, buffer)
              colorImagesUrls[color].push(`/uploads/products/${filename}`)
            }
          }
        }
        updateData.colorImages = colorImagesUrls
      }

      if (input.data.name) {
        updateData.name = input.data.name
        updateData.slug = input.data.slug || input.data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }
      if (input.data.slug !== undefined) updateData.slug = input.data.slug || undefined
      if (input.data.description !== undefined) updateData.description = input.data.description || undefined
      if (input.data.price !== undefined) updateData.price = input.data.price
      if (input.data.originalPrice !== undefined) updateData.originalPrice = input.data.originalPrice || undefined
      if (input.data.categoryId !== undefined) updateData.categoryId = input.data.categoryId || undefined
      if (input.data.sku !== undefined) updateData.sku = input.data.sku || undefined
      if (input.data.stockQuantity !== undefined) updateData.stockQuantity = input.data.stockQuantity
      if (input.data.lowStockThreshold !== undefined) updateData.lowStockThreshold = input.data.lowStockThreshold
      if (input.data.discount !== undefined) updateData.discount = input.data.discount
      if (input.data.weight !== undefined) updateData.weight = input.data.weight || undefined
      if (input.data.isActive !== undefined) updateData.isActive = input.data.isActive
      if (input.data.isFeatured !== undefined) updateData.isFeatured = input.data.isFeatured
      if (input.data.isDigital !== undefined) updateData.isDigital = input.data.isDigital
      if (input.data.inStock !== undefined) updateData.inStock = input.data.inStock
      if (input.data.sizes !== undefined) updateData.sizes = input.data.sizes && input.data.sizes.length > 0 ? input.data.sizes : undefined
      if (input.data.tags !== undefined) updateData.tags = input.data.tags && input.data.tags.length > 0 ? input.data.tags : undefined

      await db
        .update(products)
        .set(updateData)
        .where(eq(products.id, input.id))

      const [product] = await db.select().from(products).where(eq(products.id, input.id))
      return product
    } catch (error: any) {
      console.error('Error updating product:', error)
      throw new Error(error.message || 'Failed to update product')
    }
  })

export const deleteProduct = os
  .input(z.object({ id: z.string() }))
  .use(authMiddleware)
  .handler(async ({ input, context }) => {
    try {
      if (context.user.role !== 'admin') {
        throw new Error('Unauthorized')
      }

      await db
        .delete(products)
        .where(eq(products.id, input.id))

      return { success: true }
    } catch (error: any) {
      console.error('Error deleting product:', error)
      throw new Error(error.message || 'Failed to delete product')
    }
  })