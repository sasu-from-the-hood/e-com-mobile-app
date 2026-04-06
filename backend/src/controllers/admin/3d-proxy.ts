import { os } from '@orpc/server'
import { z } from 'zod'

/**
 * Proxy GLB files from Gradio to avoid CORS issues
 * This downloads the file from Gradio and streams it to the client
 */
export const proxyGLB = os
  .input(z.object({
    url: z.string().url()
  }))
  .handler(async ({ input }) => {
    try {
      console.log('📥 Proxying GLB from:', input.url)
      
      const response = await fetch(input.url, {
        headers: {
          'bypass-tunnel-reminder': 'true',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
      }
      
      const buffer = await response.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      
      console.log(`✅ GLB proxied successfully: ${(buffer.byteLength / 1024).toFixed(2)}KB`)
      
      return {
        success: true,
        data: base64,
        size: buffer.byteLength,
        contentType: 'model/gltf-binary'
      }
    } catch (error) {
      console.error('❌ Failed to proxy GLB:', error)
      throw new Error(`Failed to proxy GLB: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  })
