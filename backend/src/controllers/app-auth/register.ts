import { os } from '@orpc/server'
import { z } from 'zod'
import { db } from '../../database/db.js'
import { user, account } from '../../database/schema/auth-schema.js'
import { hashPassword } from '../../utils/password.js'
import { createOTP, phoneNumberExists } from '../../utils/otp.js'
import { logger } from '../../utils/logger.js'
import cuid from 'cuid'

// Step 1: Send OTP for registration
export const sendRegisterOTP = os
  .input(z.object({
    phoneNumber: z.string().min(10),
    password: z.string().min(6),
  }))
  .handler(async ({ input }) => {
    const { phoneNumber } = input

    console.log('[Register] OTP request for phone:', phoneNumber)
    logger.info(`[Register] OTP request for phone: ${phoneNumber}`)

    // Check if phone number already exists
    const exists = await phoneNumberExists(phoneNumber)
    console.log('[Register] Phone exists:', exists)

    if (exists) {
      console.log('[Register] Phone number already registered:', phoneNumber)
      logger.warn(`[Register] Phone number already registered: ${phoneNumber}`)
      return {
        success: false,
        error: 'Phone number already registered',
      }
    }

    // Create and send OTP
    const { expiresAt } = await createOTP({
      phoneNumber,
      type: 'register',
    })

    console.log('[Register] OTP sent to', phoneNumber, 'expires at', expiresAt)
    logger.info(`[Register] OTP sent to ${phoneNumber}, expires at ${expiresAt}`)

    return {
      success: true,
      message: 'OTP sent successfully',
      expiresAt,
    }
  })

// Step 2: Verify OTP and create account
export const verifyRegisterOTP = os
  .input(z.object({
    phoneNumber: z.string().min(10),
    otp: z.string().length(6),
    password: z.string().min(6),
    name: z.string().optional(),
  }))
  .handler(async ({ input }) => {
    try {
      const { phoneNumber, otp, password, name } = input

      console.log('[Register] OTP verification for phone:', phoneNumber)
      logger.info(`[Register] OTP verification for phone: ${phoneNumber}`)

      // Verify OTP
      const { verifyOTP, deleteOTP } = await import('../../utils/otp.js')
      const isValid = await verifyOTP({
        phoneNumber,
        otp,
        type: 'register',
      })

      console.log('[Register] OTP valid:', isValid)

      if (!isValid) {
        console.log('[Register] Invalid OTP for phone:', phoneNumber)
        logger.warn(`[Register] Invalid OTP for phone: ${phoneNumber}`)
        return {
          success: false,
          error: 'Invalid or expired OTP',
        }
      }

      // Check again if phone number exists (race condition protection)
      const exists = await phoneNumberExists(phoneNumber)
      if (exists) {
        console.log('[Register] Phone number already registered:', phoneNumber)
        logger.warn(`[Register] Phone number already registered: ${phoneNumber}`)
        return {
          success: false,
          error: 'Phone number already registered',
        }
      }

      // Hash password
      const hashedPassword = await hashPassword(password)
      console.log('[Register] Password hashed')

      // Create user
      const userId = cuid()
      const tempEmail = `${phoneNumber.replace('+', '')}@temp.phone`

      await db.insert(user).values({
        id: userId,
        name: name || phoneNumber,
        email: tempEmail,
        phoneNumber,
        phoneNumberVerified: true,
        emailVerified: false,
        role: 'user',
        banned: false,
      })

      console.log('[Register] User created:', userId)

      // Create account with password
      await db.insert(account).values({
        id: cuid(),
        accountId: phoneNumber,
        providerId: 'credential',
        userId,
        password: hashedPassword,
      })

      console.log('[Register] Account created with password')

      // Delete OTP after successful registration
      await deleteOTP({ phoneNumber, type: 'register' })

      logger.info(`[Register] User created successfully: ${userId}`)

      // Generate tokens
      const { generateTokenPair } = await import('../../utils/jwt.js')
      const tokens = await generateTokenPair({
        id: userId,
        email: tempEmail,
        name: name || phoneNumber,
        role: 'user',
        phoneNumber,
        phoneNumberVerified: true,
        banned: false,
      })

      console.log('[Register] Tokens generated successfully')
      console.log('[Register] Access token length:', tokens.accessToken.length)
      console.log('[Register] Refresh token length:', tokens.refreshToken.length)

      return {
        user: {
          id: userId,
          name: name || phoneNumber,
          email: tempEmail,
          phoneNumber,
          phoneNumberVerified: true,
          role: 'user',
        },
        ...tokens,
      }
    } catch (error) {
      console.error('[Register] Error during registration:', error)
      logger.error('[Register] Error during registration:', error as Record<string, unknown>)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      }
    }
  })
