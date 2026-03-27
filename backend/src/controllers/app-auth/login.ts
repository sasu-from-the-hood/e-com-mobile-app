import { os } from '@orpc/server'
import { z } from 'zod'
import { db } from '../../database/db.js'
import { user, account } from '../../database/schema/auth-schema.js'
import { eq } from 'drizzle-orm'
import { verifyPassword } from '../../utils/password.js'
import { generateTokenPair } from '../../utils/jwt.js'
import { logger } from '../../utils/logger.js'

export const login = os
  .input(z.object({
    phoneNumber: z.string().min(10),
    password: z.string().min(6),
  }))
  .handler(async ({ input }) => {
    const { phoneNumber, password } = input

    console.log('[Login] Attempt for phone:', phoneNumber)
    logger.info(`[Login] Attempt for phone: ${phoneNumber}`)

    // Find user by phone number
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.phoneNumber, phoneNumber))
      .limit(1)

    console.log('[Login] User found:', existingUser ? 'Yes' : 'No')

    if (!existingUser) {
      console.log('[Login] User not found:', phoneNumber)
      logger.warn(`[Login] User not found: ${phoneNumber}`)
      return {
        success: false,
        error: 'Invalid phone number or password'
      }
    }

    // Check if user is banned
    if (existingUser.banned) {
      console.log('[Login] Banned user attempted login:', phoneNumber)
      logger.warn(`[Login] Banned user attempted login: ${phoneNumber}`)
      return {
        success: false,
        error: 'Your account has been suspended. Please contact support.'
      }
    }

    // Find account with password
    const [userAccount] = await db
      .select()
      .from(account)
      .where(eq(account.userId, existingUser.id))
      .limit(1)

    console.log('[Login] Account found:', userAccount ? 'Yes' : 'No')
    console.log('[Login] Has password:', userAccount?.password ? 'Yes' : 'No')

    if (!userAccount || !userAccount.password) {
      console.log('[Login] No password set for user:', phoneNumber)
      logger.warn(`[Login] No password set for user: ${phoneNumber}`)
      return {
        success: false,
        error: 'Invalid phone number or password'
      }
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, userAccount.password)
    console.log('[Login] Password valid:', isValidPassword)

    if (!isValidPassword) {
      console.log('[Login] Invalid password for user:', phoneNumber)
      logger.warn(`[Login] Invalid password for user: ${phoneNumber}`)
      return {
        success: false,
        error: 'Invalid phone number or password'
      }
    }

    // Generate JWT tokens
    const tokens = await generateTokenPair({
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
      role: existingUser.role || 'user',
      phoneNumber: existingUser.phoneNumber || '',
      phoneNumberVerified: existingUser.phoneNumberVerified || false,
      banned: existingUser.banned || false,
    })

    console.log('[Login] Token generated - Access token preview:', tokens.accessToken.substring(0, 50) + '...')
    console.log('[Login] Token generated - Refresh token preview:', tokens.refreshToken.substring(0, 50) + '...')
    console.log('[Login] Successful login for user:', existingUser.id)
    logger.info(`[Login] Successful login for user: ${existingUser.id}`)

    return {
      success: true,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        phoneNumber: existingUser.phoneNumber,
        phoneNumberVerified: existingUser.phoneNumberVerified,
        image: existingUser.image,
        role: existingUser.role,
      },
      ...tokens,
    }
  })
