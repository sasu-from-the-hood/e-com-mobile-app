import { createAuthEndpoint } from 'better-auth/api'
import { db } from '../database/db.js'
import { passkey } from '../database/schema/auth-schema.js'
import { eq, and } from 'drizzle-orm'
import * as crypto from 'crypto'
import { z } from 'zod'

const challenges = new Map<string, { challenge: string, expires: number }>()

function hashDeviceId(deviceId: string): string {
  return crypto.createHash('sha256').update(deviceId).digest('hex')
}

function generateChallenge(): string {
  return crypto.randomBytes(32).toString('base64')
}

function verifySignature(challenge: string, signature: string, secret: string): boolean {
  try {
    const expected = crypto.createHash('sha256').update(challenge + secret).digest('hex')
    return signature === expected
  } catch {
    return false
  }
}

export const biometricPlugin = () => {
  return {
    id: 'biometric-auth',
    endpoints: {
      registerBiometric: createAuthEndpoint('/biometric/register', {
        method: 'POST',
        body: z.object({ 
          deviceId: z.string(),
          publicKey: z.string()
        }),
        requireAuth: true,
      }, async (ctx) => {
        console.log('Register body:', ctx.body)
        if (!ctx.context.session) {
          return ctx.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const userId = ctx.context.session.session.userId
        const { deviceId, publicKey } = ctx.body
        
        const hashedDeviceId = hashDeviceId(deviceId)
        
        await db.insert(passkey).values({
          id: crypto.randomUUID(),
          name: 'Touch ID',
          publicKey,
          userId,
          credentialID: hashedDeviceId,
          counter: 0,
          deviceType: 'mobile',
          backedUp: false,
          transports: 'internal',
          createdAt: new Date(),
        })
        
        return ctx.json({ success: true })
      }),
      
      removeBiometric: createAuthEndpoint('/biometric/remove', {
        method: 'POST',
        requireAuth: true,
      }, async (ctx) => {
        if (!ctx.context.session) {
          return ctx.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const userId = ctx.context.session.session.userId
        
        await db.delete(passkey)
          .where(and(
            eq(passkey.userId, userId),
            eq(passkey.name, 'Touch ID')
          ))
        
        return ctx.json({ success: true })
      }),
      
      checkBiometric: createAuthEndpoint('/biometric/check', {
        method: 'POST',
        body: z.object({ deviceId: z.string() }),
        requireAuth: true,
      }, async (ctx) => {
        if (!ctx.context.session) {
          return ctx.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const userId = ctx.context.session.session.userId
        const { deviceId } = ctx.body
        
        const hashedDeviceId = hashDeviceId(deviceId)
        
        const result = await db.select()
          .from(passkey)
          .where(and(
            eq(passkey.userId, userId),
            eq(passkey.name, 'Touch ID'),
            eq(passkey.credentialID, hashedDeviceId)
          ))
          .limit(1)
        
        return ctx.json({ registered: result.length > 0 })
      }),
      
      generateChallenge: createAuthEndpoint('/biometric/challenge', {
        method: 'POST',
        body: z.object({ deviceId: z.string() }),
      }, async (ctx) => {
        const { deviceId } = ctx.body
        const hashedDeviceId = hashDeviceId(deviceId)
        
        const result = await db.select()
          .from(passkey)
          .where(and(
            eq(passkey.name, 'Touch ID'),
            eq(passkey.credentialID, hashedDeviceId)
          ))
          .limit(1)
        
        if (result.length === 0) {
          return ctx.json({ error: 'Biometric not registered' }, { status: 404 })
        }
        
        const challenge = generateChallenge()
        challenges.set(hashedDeviceId, { 
          challenge, 
          expires: Date.now() + 300000
        })
        
        return ctx.json({ challenge })
      }),
      
      loginWithBiometric: createAuthEndpoint('/biometric/login', {
        method: 'POST',
        body: z.object({ 
          deviceId: z.string(),
          signature: z.string()
        }),
      }, async (ctx) => {
        const { deviceId, signature } = ctx.body
        const hashedDeviceId = hashDeviceId(deviceId)
        
        const challengeData = challenges.get(hashedDeviceId)
        if (!challengeData || challengeData.expires < Date.now()) {
          return ctx.json({ error: 'Invalid or expired challenge' }, { status: 401 })
        }
        
        const result = await db.select()
          .from(passkey)
          .where(and(
            eq(passkey.name, 'Touch ID'),
            eq(passkey.credentialID, hashedDeviceId)
          ))
          .limit(1)
        
        if (result.length === 0 || !result[0]) {
          return ctx.json({ error: 'Biometric not registered' }, { status: 401 })
        }
        
        const isValid = verifySignature(challengeData.challenge, signature, result[0].publicKey)
        challenges.delete(hashedDeviceId)
        
        if (!isValid) {
          return ctx.json({ error: 'Invalid signature' }, { status: 401 })
        }
        
        const userId = result[0].userId
        const sessionData = await ctx.context.internalAdapter.createSession(userId, ctx)
        
        const user = await ctx.context.internalAdapter.findUserById(userId)
        
        return ctx.json({ 
          user: user || undefined, 
          session: sessionData 
        })
      }),
    },
  }
}
