// Hunyuan3D-2mv Configuration
// 
// GPU Memory Guidelines:
// - 8GB GPU:  octreeResolution: 64,  numberOfChunks: 50000
// - 12GB GPU: octreeResolution: 96,  numberOfChunks: 75000
// - 16GB GPU: octreeResolution: 128, numberOfChunks: 100000
// - 24GB GPU: octreeResolution: 256, numberOfChunks: 250000
// - 40GB+ GPU: octreeResolution: 384, numberOfChunks: 500000
//
export const AGENT_3D_CONFIG = {
  // Default Gradio API endpoint (can be overridden per generation)
  defaultApiUrl: '',
  
  // API endpoint for shape generation
  endpoint: '/gradio_api/call/generation_all', // Use generation_all for textured models
  
  // Default parameters - Balanced for quality and GPU memory usage (14GB GPU)
  defaults: {
    inferenceSteps: 50,        // Number of denoising steps (higher = better quality but slower)
    guidanceScale: 7.5,        // How closely to follow the prompt (7.5 is balanced, 15 was too high)
    seed: 0,                   // Random seed for reproducibility (0 = random)
    octreeResolution: 128,     // Mesh resolution (128 is good balance, 384 causes OOM on 14GB GPU)
    removeBackground: true,    // Automatically remove image backgrounds
    numberOfChunks: 100000,    // Mesh complexity (100k is balanced, 500k causes OOM)
    randomizeSeed: true,       // Generate random seed each time
  },
  
  // Default text prompt that works for all cases
  defaultPrompt: 'A realistic 3D model, high quality, detailed',
  
  // Parameter ranges
  ranges: {
    inferenceSteps: { min: 1, max: 100, step: 1 },
    guidanceScale: { min: 1, max: 20, step: 0.5 },
    seed: { min: 0, max: 9999999, step: 1 },
    octreeResolution: { min: 8, max: 512, step: 8 },
    numberOfChunks: { min: 1000, max: 5000000, step: 1000 },
  },
  
  // Queue settings
  queue: {
    delayBetweenJobs: 30000, // 30 seconds in milliseconds
    maxRetries: 3,
  },
  
  // Image views required
  imageViews: ['front', 'back', 'left', 'right'] as const,
  
  // Supported image formats
  supportedFormats: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  
  // Max file size (10MB)
  maxFileSize: 10 * 1024 * 1024,
  
  // Body part types for character attachment
  bodyPartTypes: [
    // Legs
    { value: 'both-legs', label: 'Both Legs', generateCount: 2 },
    { value: 'left-leg', label: 'Left Leg', generateCount: 1 },
    { value: 'right-leg', label: 'Right Leg', generateCount: 1 },
    
    // Head
    { value: 'top-head', label: 'Top Head (Hair)', generateCount: 1 },
    { value: 'middle-head', label: 'Middle Head (Eyes)', generateCount: 1 },
    { value: 'lower-head', label: 'Lower Head (Mouth)', generateCount: 1 },
    
    // Torso
    { value: 'chest', label: 'Chest', generateCount: 1 },
    
    // Arms
    { value: 'left-hand', label: 'Left Hand', generateCount: 1 },
    { value: 'right-hand', label: 'Right Hand', generateCount: 1 },
  ] as const,
}

export type ImageView = typeof AGENT_3D_CONFIG.imageViews[number]

export interface ColorVariant {
  id: string
  colorName: string
  colorHex: string
  images: {
    front: File | null
    back: File | null
    left: File | null
    right: File | null
  }
  // For both-legs: separate images for right leg
  rightLegImages?: {
    front: File | null
    back: File | null
    left: File | null
    right: File | null
  }
}

export interface GenerationJob {
  id: string
  apiUrl: string
  prompt: string
  bodyPartType?: 'both-legs' | 'left-leg' | 'right-leg' | 'top-head' | 'middle-head' | 'lower-head' | 'chest' | 'left-hand' | 'right-hand'
  colorVariants: ColorVariant[]
  parameters: {
    inferenceSteps: number
    guidanceScale: number
    seed: number
    octreeResolution: number
    removeBackground: boolean
    numberOfChunks: number
    randomizeSeed: boolean
  }
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  currentStep?: string // e.g., "Generating left leg..." or "Generating right leg..."
  errorSeen?: boolean // Track if user has seen the error notification
  createdAt: Date
  completedAt?: Date
  result?: {
    fileUrl: string
    fileUrl2?: string // For both-legs, this will be the right leg GLB
    meshStats: any
    outputHtml: string
  }
  error?: string
}
