import { os } from '@orpc/server'
import { z } from 'zod'
import { db } from '../../database/db.js'
import { user, account } from '../../database/schema/auth-schema.js'
import { eq } from 'drizzle-orm'
import { hashPassword } from '../../utils/password.js'
import { createOTP, verifyOTP, deleteOTP } from '../../utils/otp.js'
import { logger } from '../../utils/logger.js'

// Step 1: Send OTP for password reset
export const sendResetPasswordOTP = os
  .input(z.object({
    phoneNumber: z.string().min(10),
  }))
  .handler(async ({ input }) => {
      const { phoneNumber } = input

      console.log('[ForgotPassword] OTP request for phone:', phoneNumber)
      logger.info(`[ForgotPassword] OTP request for phone: ${phoneNumber}`)

      // Check if user exists
      const [existingUser] = await db
        .select()
        .from(user)
        .where(eq(user.phoneNumber, phoneNumber))
        .limit(1)

      console.log('[ForgotPassword] User found:', existingUser ? 'Yes' : 'No')

      if (!existingUser) {
        // Don't reveal if user exists or not for security
        console.log('[ForgotPassword] User not found:', phoneNumber)
        logger.warn(`[ForgotPassword] User not found: ${phoneNumber}`)
        // Still return success to prevent user enumeration
        return {
          success: true,
          message: 'If this phone number is registered, you will receive an OTP',
        }
      }

      // Create and send OTP
      const { expiresAt } = await createOTP({
        phoneNumber,
        type: 'reset-password',
      })

      console.log('[ForgotPassword] OTP sent to', phoneNumber, 'expires at', expiresAt)
      logger.info(`[ForgotPassword] OTP sent to ${phoneNumber}, expires at ${expiresAt}`)

      return {
        success: true,
        message: 'OTP sent successfully',
        expiresAt,
      }
  })

// Step 2: Verify OTP
export const verifyResetPasswordOTP = os
  .input(z.object({
    phoneNumber: z.string().min(10),
    otp: z.string().length(6),
  }))
  .handler(async ({ input }) => {
      const { phoneNumber, otp } = input

      console.log('[ForgotPassword] OTP verification for phone:', phoneNumber)
      logger.info(`[ForgotPassword] OTP verification for phone: ${phoneNumber}`)

      // Verify OTP
      const isValid = await verifyOTP({
        phoneNumber,
        otp,
        type: 'reset-password',
      })

      console.log('[ForgotPassword] OTP valid:', isValid)

      if (!isValid) {
        console.log('[ForgotPassword] Invalid OTP for phone:', phoneNumber)
        logger.warn(`[ForgotPassword] Invalid OTP for phone: ${phoneNumber}`)
        return {
          success: false,
          error: 'Invalid or expired OTP',
        }
      }

      console.log('[ForgotPassword] OTP verified for phone:', phoneNumber)
      logger.info(`[ForgotPassword] OTP verified for phone: ${phoneNumber}`)

      return {
        success: true,
        message: 'OTP verified successfully',
      }
  })

// Step 3: Reset password
export const resetPassword = os
  .input(z.object({
    phoneNumber: z.string().min(10),
    otp: z.string().length(6),
    newPassword: z.string().min(6),
  }))
  .handler(async ({ input }) => {
      const { phoneNumber, otp, newPassword } = input

      console.log('[ForgotPassword] Password reset for phone:', phoneNumber)
      logger.info(`[ForgotPassword] Password reset for phone: ${phoneNumber}`)

      // Verify OTP again
      const isValid = await verifyOTP({
        phoneNumber,
        otp,
        type: 'reset-password',
      })

      console.log('[ForgotPassword] OTP valid:', isValid)

      if (!isValid) {
        console.log('[ForgotPassword] Invalid OTP during reset for phone:', phoneNumber)
        logger.warn(`[ForgotPassword] Invalid OTP during reset for phone: ${phoneNumber}`)
        return {
          success: false,
          error: 'Invalid or expired OTP',
        }
      }

      // Find user
      const [existingUser] = await db
        .select()
        .from(user)
        .where(eq(user.phoneNumber, phoneNumber))
        .limit(1)

      console.log('[ForgotPassword] User found:', existingUser ? 'Yes' : 'No')

      if (!existingUser) {
        console.log('[ForgotPassword] User not found during reset:', phoneNumber)
        logger.error(`[ForgotPassword] User not found during reset: ${phoneNumber}`)
        return {
          success: false,
          error: 'User not found',
        }
      }

      // Find account
      const [userAccount] = await db
        .select()
        .from(account)
        .where(eq(account.userId, existingUser.id))
        .limit(1)

      console.log('[ForgotPassword] Account found:', userAccount ? 'Yes' : 'No')

      if (!userAccount) {
        console.log('[ForgotPassword] Account not found for user:', existingUser.id)
        logger.error(`[ForgotPassword] Account not found for user: ${existingUser.id}`)
        return {
          success: false,
          error: 'Account not found',
        }
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword)
      console.log('[ForgotPassword] Password hashed')

      // Update password
      await db
        .update(account)
        .set({ password: hashedPassword })
        .where(eq(account.id, userAccount.id))

      console.log('[ForgotPassword] Password updated')

      // Delete OTP
      await deleteOTP({ phoneNumber, type: 'reset-password' })

      console.log('[ForgotPassword] Password reset successful for user:', existingUser.id)
      logger.info(`[ForgotPassword] Password reset successful for user: ${existingUser.id}`)

      return {
        success: true,
        message: 'Password reset successfully',
      }
  })
