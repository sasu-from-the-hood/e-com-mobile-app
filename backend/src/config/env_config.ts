import 'dotenv/config'

const nodeEnv = process.env.NODE_ENV ?? 'development'
const version = process.env.VERSION ?? process.env.npm_package_version ?? '1.0.0'
const logLevel = (process.env.LOG_LEVEL ?? 'info') as 'silent' | 'error' | 'warn' | 'info' | 'debug' | 'trace'

const defaultDevOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

const corsAllowedOriginsEnv = process.env.CORS_ALLOWED_ORIGINS ?? ''
export const allowedOrigins = (corsAllowedOriginsEnv
  ? corsAllowedOriginsEnv.split(',')
  : nodeEnv === 'development'
    ? defaultDevOrigins
    : []
)
  .map((o: string) => o.trim())
  .filter(Boolean)

export const corsOptions = {
  origin: (origin: string | undefined) => {
    if (!origin) {
      return '*'
    }
    return allowedOrigins.includes(origin) ? origin : null
  },
  allowMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'Content-Type'],
  credentials: true,
  maxAge: 600,
}

export const port = Number(process.env.PORT ?? 3000)


function toBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback
  const normalized = value.trim().toLowerCase()
  if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) return true
  if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) return false
  return fallback
}

function toNumber(value: string | undefined, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export const config = {
  nodeEnv,
  allowedOrigins,
  port,
  version,
  logLevel,
  mysql: {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? 'app',
  },
  loginEnabled: (process.env.LOGIN_ENABLED),
  registerEnabled: (process.env.REGISTER_ENABLED),
  forgotPasswordEnabled: (process.env.FORGOT_PASSWORD_ENABLED),
  resetPasswordEnabled: (process.env.RESET_PASSWORD_ENABLED),
  otpEnabled: toBoolean(process.env.PHONE_OTP_REQUIRED, true),
  AppName : process.env.APP_NAME,
  BackEndUrl : process.env.BACKEND_URL,
  window: toNumber(process.env.BETTERAUTH_RATE_LIMIT_WINDOW_MS, 900000) / 1000, 
  max: toNumber(process.env.BETTERAUTH_RATE_LIMIT_MAX_ATTEMPTS, 100),
}


