import { z } from 'zod'
import { adminProcedure } from '../../middleware/orpc.js'
import { db } from '../../database/db.js'
import { threeDModels } from '../../database/schema/index.js'
import { compressGLB } from '../../utils/glb-compressor.js'
import { eq, desc } from 'drizzle-orm'
import path from 'path'
import fs from 'fs/promises'
import crypto from 'crypto'

// Upload directory
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', '3d-models')

// Ensure uploads directory exists
await fs.mkdir(UPLOADS_DIR, { recursive: true })

/**
 * Save and compress 3D model GLB files
 */
export const save3DModel = adminProcedure
  .input(z.object({
    id: z.string().optional(), // If provided, update existing model
    name: z.string().min(1),
    bodyPartType: z.enum(['both-legs', 'left-leg', 'right-leg', 'top-head', 'middle-head', 'lower-head', 'chest', 'left-hand', 'right-hand']),
    colorName: z.string().optional(),
    colorHex: z.string().optional(),
    prompt: z.string().min(1),
    leftLegUrl: z.string().optional(),
    rightLegUrl: z.string().optional(),
    scale: z.number().optional(),
    positionX: z.number().optional(),
    positionY: z.number().optional(),
    positionZ: z.number().optional(),
    inferenceSteps: z.number().optional(),
    guidanceScale: z.number().optional(),
  }))
  .handler(async ({ input }) => {
    const modelId = input.id || crypto.randomUUID()
    const isUpdate = !!input.id
    
    let leftLegFile: string | null = null
    let rightLegFile: string | null = null
    let leftLegSize: number | null = null
    let rightLegSize: number | null = null
    let leftLegOriginalSize: number | null = null
    let rightLegOriginalSize: number | null = null
    
    // If updating, check if model exists and get existing file info
    if (isUpdate) {
      const [existing] = await db
        .select()
        .from(threeDModels)
        .where(eq(threeDModels.id, modelId))
      
      if (!existing) {
        throw new Error('Model not found')
      }
      
      // Use existing file info (don't re-download)
      leftLegFile = existing.leftLegFile
      rightLegFile = existing.rightLegFile
      leftLegSize = existing.leftLegSize
      rightLegSize = existing.rightLegSize
      leftLegOriginalSize = existing.leftLegOriginalSize
      rightLegOriginalSize = existing.rightLegOriginalSize
      
      console.log('✅ Updating existing model, keeping files:', { leftLegFile, rightLegFile })
    } else {
      // Only download files for new models
      // Download and compress left leg GLB
      if (input.leftLegUrl) {
        console.log('📥 Downloading left leg GLB...')
        const response = await fetch(input.leftLegUrl, {
          headers: {
            'bypass-tunnel-reminder': 'true'
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to download left leg: ${response.statusText}`)
        }

        const buffer = Buffer.from(await response.arrayBuffer())
        const filename = `${modelId}_left.glb`
        const outputPath = path.join(UPLOADS_DIR, filename)
        const result = await compressGLB(buffer, outputPath)

        leftLegFile = filename
        leftLegSize = result.compressedSize
        leftLegOriginalSize = result.originalSize
      }

      // Download and compress right leg GLB
      if (input.rightLegUrl) {
        console.log('📥 Downloading right leg GLB...')
        const response = await fetch(input.rightLegUrl, {
          headers: {
            'bypass-tunnel-reminder': 'true'
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to download right leg: ${response.statusText}`)
        }

        const buffer = Buffer.from(await response.arrayBuffer())
        const filename = `${modelId}_right.glb`
        const outputPath = path.join(UPLOADS_DIR, filename)
        const result = await compressGLB(buffer, outputPath)

        rightLegFile = filename
        rightLegSize = result.compressedSize
        rightLegOriginalSize = result.originalSize
      }
    }

    // Prepare model data
    const modelData = {
      id: modelId,
      name: input.name,
      bodyPartType: input.bodyPartType,
      colorName: input.colorName || null,
      colorHex: input.colorHex || null,
      prompt: input.prompt,
      leftLegFile,
      rightLegFile,
      leftLegSize,
      rightLegSize,
      leftLegOriginalSize,
      rightLegOriginalSize,
      scale: input.scale?.toString() || '1.0',
      positionX: input.positionX?.toString() || '0.0',
      positionY: input.positionY?.toString() || '0.0',
      positionZ: input.positionZ?.toString() || '0.0',
      inferenceSteps: input.inferenceSteps || null,
      guidanceScale: input.guidanceScale?.toString() || null
    }

    if (isUpdate) {
      // Update existing model (only update adjustments, keep files)
      await db
        .update(threeDModels)
        .set({
          name: modelData.name,
          scale: modelData.scale,
          positionX: modelData.positionX,
          positionY: modelData.positionY,
          positionZ: modelData.positionZ,
          updatedAt: new Date()
        })
        .where(eq(threeDModels.id, modelId))
      
      console.log(`✅ 3D model updated: ${modelId}`)
    } else {
      // Insert new model
      await db.insert(threeDModels).values(modelData)
      console.log(`✅ 3D model saved: ${modelId}`)
    }

    return {
      ...modelData,
      leftLegUrl: leftLegFile ? `/api/admin/3d-models/files/${leftLegFile}` : null,
      rightLegUrl: rightLegFile ? `/api/admin/3d-models/files/${rightLegFile}` : null
    }
  })

/**
 * List all 3D models
 */
export const list3DModels = adminProcedure
  .handler(async () => {
    const models = await db
      .select()
      .from(threeDModels)
      .orderBy(desc(threeDModels.createdAt))

    // Add file URLs
    const modelsWithUrls = models.map(model => ({
      ...model,
      leftLegUrl: model.leftLegFile ? `/api/admin/3d-models/files/${model.leftLegFile}` : null,
      rightLegUrl: model.rightLegFile ? `/api/admin/3d-models/files/${model.rightLegFile}` : null
    }))

    return modelsWithUrls
  })

/**
 * Delete a 3D model
 */
export const delete3DModel = adminProcedure
  .input(z.string())
  .handler(async ({ input }) => {
    // Get model to delete files
    const [model] = await db
      .select()
      .from(threeDModels)
      .where(eq(threeDModels.id, input))

    if (!model) {
      throw new Error('Model not found')
    }

    // Delete files
    if (model.leftLegFile) {
      const filePath = path.join(UPLOADS_DIR, model.leftLegFile)
      await fs.unlink(filePath).catch(() => {})
    }

    if (model.rightLegFile) {
      const filePath = path.join(UPLOADS_DIR, model.rightLegFile)
      await fs.unlink(filePath).catch(() => {})
    }

    // Delete from database
    await db
      .delete(threeDModels)
      .where(eq(threeDModels.id, input))

    console.log(`✅ 3D model deleted: ${input}`)

    return { success: true }
  })

/**
 * Check if a model is saved by its prompt and body part type
 */
export const checkModelSaved = adminProcedure
  .input(z.object({
    prompt: z.string(),
    bodyPartType: z.string(),
  }))
  .handler(async ({ input }) => {
    const models = await db
      .select()
      .from(threeDModels)
      .where(eq(threeDModels.prompt, input.prompt))
      .orderBy(desc(threeDModels.createdAt))
      .limit(1)

    // Filter by body part type in memory (since we can't chain where clauses)
    const model = models.find(m => m.bodyPartType === input.bodyPartType)

    return {
      isSaved: !!model,
      modelId: model?.id || null,
      model: model || null
    }
  })
