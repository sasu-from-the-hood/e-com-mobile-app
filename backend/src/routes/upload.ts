import { os } from '@orpc/server'
import * as z from 'zod'
import * as fs from 'fs'
import * as path from 'path'
import { authMiddleware } from '../middleware/auth.js'

export const uploadAvatar = os
  .input(z.object({ 
    image: z.object({
      data: z.string().optional(),
      type: z.string().optional(),
      name: z.string().optional(),
      oldImageUrl: z.string().optional()
    })
  }))
  .handler(async ({ input, context }) => {
    try {
    const { image } = input
    
    
    if (!image.data || !image.type || !image.name) {
      console.error('Missing required fields:', { data: !!image.data, type: !!image.type, name: !!image.name })
      throw new Error('Invalid image data')
    }
    
    if (!image.type.startsWith('image/')) {
      throw new Error('Only image files are allowed')
    }
    
    if (image.oldImageUrl) {
      try {
        const url = new URL(image.oldImageUrl)
        const relativePath = url.pathname
        const oldFilePath = path.join(process.cwd(), relativePath)
        
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath)
        }
      } catch (error) {
        console.error('Failed to delete old image:', error)
      }
    }
    
    const timestamp = Date.now()
    const randomId = Math.round(Math.random() * 1E9)
    const extension = image.name.split('.').pop() || 'jpg'
    const filename = `avatar-${timestamp}-${randomId}.${extension}`
    

    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    
    const filePath = path.join(uploadDir, filename)
    // Handle base64 data with or without data URL prefix
    let base64Data = image.data
    if (base64Data.startsWith('data:')) {
      const parts = base64Data.split(',')
      base64Data = parts[1] || base64Data
    }
    
    const buffer = Buffer.from(base64Data, 'base64')
    fs.writeFileSync(filePath, buffer)
    
    const imageUrl = `/uploads/avatars/${filename}`
    
    return { imageUrl }
    } catch (error) {
      console.error('Upload avatar error:', error)
      throw new Error('Failed to upload avatar')
    }
  })
