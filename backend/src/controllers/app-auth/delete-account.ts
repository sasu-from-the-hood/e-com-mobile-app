import { os } from '@orpc/server'
import { z } from 'zod'
import { db } from '../../database/db.js'
import { user, account } from '../../database/schema/auth-schema.js'
import { eq } from 'drizzle-orm'
import { verifyPassword } from '../../utils/password.js'
import { jwtAuthMiddleware } from '../../middleware/jwt-auth.js'
import { logger } from '../../utils/logger.js'

// Delete user account
export const deleteAccount = os
  .use(jwtAuthMiddleware)
  .input(z.object({
    password: z.string().min(6),
    confirmation: z.literal('DELETE'),
  }))
  .handler(async ({ input, context }) => {
      const { password } = input

      console.log('[DeleteAccount] Account deletion request for user:', context.user.id)
      logger.info(`[DeleteAccount] Account deletion request for user: ${context.user.id}`)

      // Get account
      const [userAccount] = await db
        .select()
        .from(account)
        .where(eq(account.userId, context.user.id))
        .limit(1)

      console.log('[DeleteAccount] Account found:', userAccount ? 'Yes' : 'No')
      console.log('[DeleteAccount] Has password:', userAccount?.password ? 'Yes' : 'No')

      if (!userAccount || !userAccount.password) {
        console.log('[DeleteAccount] Account not found for user:', context.user.id)
        logger.error(`[DeleteAccount] Account not found for user: ${context.user.id}`)
        throw new Error('Account not found')
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, userAccount.password)
      console.log('[DeleteAccount] Password valid:', isValidPassword)

      if (!isValidPassword) {
        console.log('[DeleteAccount] Invalid password for user:', context.user.id)
        logger.warn(`[DeleteAccount] Invalid password for user: ${context.user.id}`)
        throw new Error('Invalid password')
      }

      // Delete account (cascade will delete related records)
      await db.delete(user).where(eq(user.id, context.user.id))

      console.log('[DeleteAccount] Account deleted successfully:', context.user.id)
      logger.info(`[DeleteAccount] Account deleted successfully: ${context.user.id}`)

      return {
        success: true,
        message: 'Account deleted successfully',
      }
  })
