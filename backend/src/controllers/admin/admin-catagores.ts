import { os } from '@orpc/server'
import { z } from 'zod'
import { db } from '../../database/db.js'
import { categories } from '../../database/schema/categories.js'
import { eq, like, asc } from 'drizzle-orm'
import cuid from 'cuid'
import { authMiddleware } from '../../middleware/auth.js'
import fs from 'fs'
import path from 'path'

// Get all categories
export const getCategories = os
  .input(z.object({
    search: z.string().optional()
  }))
  .handler(async ({ input }) => {
    try {
      const result = await db.select().from(categories).orderBy(asc(categories.name))
      console.log('=== GET CATEGORIES ===')
      console.log('Total categories:', result.length)
      console.log('First category:', result[0])
      console.log('Categories with images:', result.filter(c => c.image).length)
      return result
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw new Error('Failed to fetch categories')
    }
  })

// Create category
export const createCategory = os
  .input(z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    image: z.instanceof(File).optional()
  }))
  .use(authMiddleware)
  .handler(async ({ input, context }) => {
    if (context.user.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    let imageUrl: string | undefined
    if (input.image) {
      const uploadDir = path.join(process.cwd(), 'uploads', 'categories')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      
      const timestamp = Date.now()
      const randomId = Math.round(Math.random() * 1E9)
      const extension = input.image.name.split('.').pop() || 'jpg'
      const filename = `category-${timestamp}-${randomId}.${extension}`
      const filePath = path.join(uploadDir, filename)
      const buffer = Buffer.from(await input.image.arrayBuffer())
      fs.writeFileSync(filePath, buffer)
      imageUrl = `/uploads/categories/${filename}`
    }

    const id = cuid()
    
    await db.insert(categories).values({
      id,
      name: input.name,
      description: input.description,
      image: imageUrl
    })
    
    const [category] = await db.select().from(categories).where(eq(categories.id, id))
    return category
  })

// Update category
export const updateCategory = os
  .input(z.object({
    id: z.string(),
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    image: z.instanceof(File).optional()
  }))
  .use(authMiddleware)
  .handler(async ({ input, context }) => {
    if (context.user.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const { id, ...updateData } = input
    const finalUpdateData: any = { ...updateData }
    
    if (input.image) {
      const uploadDir = path.join(process.cwd(), 'uploads', 'categories')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      
      const timestamp = Date.now()
      const randomId = Math.round(Math.random() * 1E9)
      const extension = input.image.name.split('.').pop() || 'jpg'
      const filename = `category-${timestamp}-${randomId}.${extension}`
      const filePath = path.join(uploadDir, filename)
      const buffer = Buffer.from(await input.image.arrayBuffer())
      fs.writeFileSync(filePath, buffer)
      finalUpdateData.image = `/uploads/categories/${filename}`
    }
    
    await db.update(categories)
      .set(finalUpdateData)
      .where(eq(categories.id, id))
    
    const [category] = await db.select().from(categories).where(eq(categories.id, id))
    return category
  })

// Delete category
export const deleteCategory = os
  .input(z.object({
    id: z.string()
  }))
  .use(authMiddleware)
  .handler(async ({ input, context }) => {
    if (context.user.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    await db.delete(categories).where(eq(categories.id, input.id))
    return { success: true }
  })