import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, prune } from '@gltf-transform/functions'
import fs from 'fs/promises'
import path from 'path'

export interface CompressionResult {
  compressedPath: string
  originalSize: number
  compressedSize: number
  compressionRatio: number
}

export async function compressGLB(
  inputBuffer: Buffer,
  outputPath: string
): Promise<CompressionResult> {
  try {
    // Create IO instance
    const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
    
    // Read GLB from buffer
    const document = await io.readBinary(new Uint8Array(inputBuffer))
    
    // Apply basic compression transforms (skip Draco to avoid dependency issues)
    await document.transform(
      // Remove duplicate data
      dedup(),
      // Remove unused data
      prune()
      // Draco compression disabled - requires draco3d.encoder package
    )
    
    // Write compressed GLB
    const compressedBuffer = await io.writeBinary(document)
    
    // Ensure output directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true })
    
    // Write to file
    await fs.writeFile(outputPath, Buffer.from(compressedBuffer))
    
    const originalSize = inputBuffer.length
    const compressedSize = compressedBuffer.byteLength
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(2)
    
    console.log(`✅ GLB compressed: ${(originalSize / 1024).toFixed(2)}KB → ${(compressedSize / 1024).toFixed(2)}KB (${compressionRatio}% reduction)`)
    
    return {
      compressedPath: outputPath,
      originalSize,
      compressedSize,
      compressionRatio: parseFloat(compressionRatio)
    }
  } catch (error) {
    console.error('❌ GLB compression failed:', error)
    throw error
  }
}
