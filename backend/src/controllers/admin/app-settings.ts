import { os } from '@orpc/server'
import { z } from 'zod'
import { db } from '../../database/db.js'
import { appSettings } from '../../database/schema/index.js'
import { eq } from 'drizzle-orm'
import cuid from 'cuid'
import { authMiddleware } from '../../middleware/auth.js'

// Get all app settings (public)
export const getAppSettings = os
  .handler(async () => {
    const settings = await db.select().from(appSettings)
    
    // Convert to key-value object
    const settingsObj: Record<string, string> = {}
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value
    })
    
    return settingsObj
  })

// Admin: Get all settings with descriptions
export const adminGetAppSettings = os
  .use(authMiddleware)
  .handler(async ({ context }) => {
    if (context.user.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const settings = await db.select().from(appSettings)
    return settings
  })

// Admin: Update or create setting
export const updateAppSetting = os
  .input(z.object({
    key: z.string().min(1),
    value: z.string(),
    description: z.string().optional(),
  }))
  .use(authMiddleware)
  .handler(async ({ input, context }) => {
    if (context.user.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    // Check if setting exists
    const [existing] = await db
      .select()
      .from(appSettings)
      .where(eq(appSettings.key, input.key))
      .limit(1)

    if (existing) {
      // Update existing
      await db
        .update(appSettings)
        .set({
          value: input.value,
          description: input.description || existing.description,
        })
        .where(eq(appSettings.key, input.key))
    } else {
      // Create new
      await db.insert(appSettings).values({
        id: cuid(),
        key: input.key,
        value: input.value,
        description: input.description,
      })
    }

    const [setting] = await db
      .select()
      .from(appSettings)
      .where(eq(appSettings.key, input.key))

    return setting
  })

// Admin: Bulk update settings
export const bulkUpdateAppSettings = os
  .input(z.record(z.string(), z.string()))
  .use(authMiddleware)
  .handler(async ({ input, context }) => {
    if (context.user.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    for (const [key, value] of Object.entries(input)) {
      const [existing] = await db
        .select()
        .from(appSettings)
        .where(eq(appSettings.key, key))
        .limit(1)

      if (existing) {
        await db
          .update(appSettings)
          .set({ value })
          .where(eq(appSettings.key, key))
      } else {
        await db.insert(appSettings).values({
          id: cuid(),
          key,
          value,
        })
      }
    }

    return { success: true }
  })

// Admin: Delete setting
export const deleteAppSetting = os
  .input(z.object({ key: z.string() }))
  .use(authMiddleware)
  .handler(async ({ input, context }) => {
    if (context.user.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    await db.delete(appSettings).where(eq(appSettings.key, input.key))

    return { success: true }
  })
