import { os } from '@orpc/server'
import { config } from '../config/env_config.js'
import { db } from '../database/db.js'
import { user } from '../database/schema/auth-schema.js'
import { count } from 'drizzle-orm'

function formatNumber(n: number): string {
  if (n >= 1_000_000) {
    return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  } else if (n >= 1_000) {
    return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  } else {
    return n.toString()
  }
}

export const handshake = os.handler(async () => {
  const totalRes = await db.select({ total: count() }).from(user)
  const totalUsers = totalRes[0]?.total ?? 0

  return {
    service: 'backend',
    version: config.version,
    env: config.nodeEnv,
    auth: {
      login: config.loginEnabled,
      register: config.registerEnabled,
      forgotPassword: config.forgotPasswordEnabled,
      otp: config.otpEnabled,
    },
    stats: {
      totalUsers: formatNumber(totalUsers),
      recentUsers: [
        { name: 'John Doe', avatar: null },
        { name: 'Sarah Smith', avatar: null },
        { name: 'Mike Johnson', avatar: null },
      ],
    },
  }
})
