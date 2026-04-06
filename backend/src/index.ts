import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { RPCHandler } from '@orpc/server/fetch'
import * as fs from 'fs'
import * as path from 'path'
import { allowedOrigins, port, config } from './config/env_config.js'
import { logger } from './utils/logger.js'
import { router } from './routes/_app.js'
import { seedAdmin } from './database/seeds/admin-seed.js'
import { betterAuthRateLimitMiddleware } from './middleware/betterAuthRateLimit.js'

const app = new Hono()

// CORS
app.use('*', cors({
  origin: (origin, _c) => {
    return allowedOrigins.includes(origin) ? origin : null
  },
  allowMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'Content-Type'],
  credentials: true,
  maxAge: 600,
}))

let Auth: any = null

// Static file serving for uploads
app.get('/uploads/*', async (c) => {
  const filePath = path.join(process.cwd(), c.req.path)
  if (fs.existsSync(filePath)) {
    const file = fs.readFileSync(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.glb': 'model/gltf-binary'
    }
    c.header('Content-Type', mimeTypes[ext] || 'application/octet-stream')
    c.header('Cache-Control', 'public, max-age=31536000, immutable')
    c.header('Access-Control-Allow-Origin', '*')
    return c.body(file)
  }
  return c.notFound()
})

// Static file serving for 3D model files
app.get('/api/admin/3d-models/files/:filename', async (c) => {
  const filename = c.req.param('filename')
  const filePath = path.join(process.cwd(), 'uploads', '3d-models', filename)
  
  if (fs.existsSync(filePath)) {
    const file = fs.readFileSync(filePath)
    c.header('Content-Type', 'model/gltf-binary')
    c.header('Cache-Control', 'public, max-age=31536000, immutable')
    c.header('Access-Control-Allow-Origin', '*')
    return c.body(file)
  }
  
  return c.notFound()
})

// Static file serving for frontend assets
app.get('/assets/*', async (c) => {
  const filePath = path.join(process.cwd(), 'front-end-build', c.req.path)
  if (fs.existsSync(filePath)) {
    const file = fs.readFileSync(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const mimeTypes: Record<string, string> = {
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
      '.eot': 'application/vnd.ms-fontobject'
    }
    c.header('Content-Type', mimeTypes[ext] || 'application/octet-stream')
    c.header('Cache-Control', 'public, max-age=31536000') // Cache for 1 year
    return c.body(file)
  }
  return c.notFound()
})

// Request logging middleware
app.use('*', async (c, next) => {
  const startedAt = Date.now()
  await next()
  const durationMs = Date.now() - startedAt
  logger.info(`${c.req.method} ${c.req.path} ${c.res.status} - ${durationMs}ms`, {
    version: config.version,
    env: config.nodeEnv,
    durationMs,
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
  })
})

// Auth routes via Better Auth fetch-style handler
app.on(['GET', 'POST'], '/api/auth/*', async (c) => {
  if (!Auth) {
    return c.json({ error: 'Authentication service not ready' }, 503)
  }
  try {
    return await ('handler' in Auth ? Auth.handler(c.req.raw) : (Auth as any)(c.req.raw))
  } catch (error) {
    logger.error('Auth handler error:', {
      error,
      version: config.version,
      env: config.nodeEnv,
      path: c.req.path,
      method: c.req.method,
    })
    return c.json({ error: 'Authentication error' }, 500)
  }
})

app.use("/rpc/*", betterAuthRateLimitMiddleware)

// ORPC via Fetch adapter
const rpcHandler = new RPCHandler(router)

app.all('/rpc/*', async (c) => {
  try {
    const { matched, response } = await rpcHandler.handle(c.req.raw, {
      prefix: '/rpc',
      context: {
        request: c.req.raw
      },
    })
    if (matched) {
      return response
    }
    return c.notFound()
  } catch (error) {
    logger.error('RPC handler error:', {
      error,
      version: config.version,
      env: config.nodeEnv,
      path: c.req.path,
      method: c.req.method,
    })
  }
})

// Catch-all route for SPA - serve index.html for all non-API routes
app.get('*', async (c) => {
  const reqPath = c.req.path
  
  // Skip API and RPC routes
  if (reqPath.startsWith('/api/') || reqPath.startsWith('/rpc/') || reqPath.startsWith('/uploads/')) {
    return c.notFound()
  }
  
  // Serve index.html for all other routes (SPA routing)
  const indexPath = path.resolve('./front-end-build/index.html')
  if (!fs.existsSync(indexPath)) {
    logger.warn('[Frontend] index.html not found at:', { path: indexPath })
    return c.json({ error: 'Frontend not built' }, 404)
  }
  
  const indexContent = fs.readFileSync(indexPath, 'utf-8')
  return c.html(indexContent)
})

// Start server
const startServer = async () => {
  try {
    const { auth } = await import('./utils/auth.js')
    Auth = auth

    // Seed admin user
    await seedAdmin()

    serve({
      port,
      fetch: app.fetch,
    })
    logger.info(`Server listening on port ${port}`, { version: config.version, env: config.nodeEnv })
  } catch (error) {
    logger.error('Failed to start server:', { error, version: config.version, env: config.nodeEnv })
    process.exit(1)
  }
}

startServer()