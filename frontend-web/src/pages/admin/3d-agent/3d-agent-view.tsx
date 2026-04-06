import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IconPlus } from '@tabler/icons-react'
import { GenerationForm } from './generation-form'
import { GenerationHistory } from './generation-history'
import { GenerationQueue } from './generation-queue'
import { ModelViewer } from './model-viewer'
import { CharacterViewer } from './character-viewer'
import { AGENT_3D_CONFIG, type GenerationJob } from '@/config/3d-agent.config'
import { Client } from '@gradio/client'
import { toast } from 'sonner'
import { orpc } from '@/lib/oprc'

export function Agent3DView() {
  const [showForm, setShowForm] = useState(false)
  const [showViewer, setShowViewer] = useState(false)
  const [showCharacterViewer, setShowCharacterViewer] = useState(false)
  const [selectedJob, setSelectedJob] = useState<GenerationJob | null>(null)
  const [editingJob, setEditingJob] = useState<GenerationJob | null>(null)
  const [showApiInput, setShowApiInput] = useState(false)
  const [apiUrl, setApiUrl] = useState(() => {
    // Load API URL from localStorage
    return localStorage.getItem('3d-agent-api-url') || ''
  })
  const [tempApiUrl, setTempApiUrl] = useState(apiUrl)
  const [jobs, setJobs] = useState<GenerationJob[]>(() => {
    // Load jobs from localStorage on mount (only completed/failed jobs with results)
    try {
      const saved = localStorage.getItem('3d-agent-jobs')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Convert date strings back to Date objects
        // Filter out jobs with File objects (pending/processing jobs)
        // Also filter out old jobs with white_mesh.glb URLs
        return parsed
          .filter((job: any) => {
            if (job.status !== 'completed' && job.status !== 'failed') return false
            // Filter out old white_mesh URLs
            if (job.result?.fileUrl?.includes('white_mesh.glb')) return false
            return true
          })
          .map((job: any) => ({
            ...job,
            createdAt: new Date(job.createdAt),
            completedAt: job.completedAt ? new Date(job.completedAt) : undefined,
            // Remove colorVariants with File objects
            colorVariants: job.colorVariants.map((v: any) => ({
              ...v,
              images: { front: null, back: null, left: null, right: null },
              rightLegImages: v.rightLegImages ? { front: null, back: null, left: null, right: null } : undefined
            }))
          }))
      }
    } catch (error) {
      console.error('Failed to load jobs from localStorage:', error)
    }
    return []
  })
  const [savedModels, setSavedModels] = useState<any[]>([])
  const [isLoadingSavedModels, setIsLoadingSavedModels] = useState(true)
  const [queue, setQueue] = useState<GenerationJob[]>([])
  const isProcessingRef = useRef(false) // Use ref to prevent duplicate processing
  const previousQueueLengthRef = useRef(0) // Track previous queue length

  // Load saved models from backend
  const loadSavedModels = async () => {
    try {
      setIsLoadingSavedModels(true)
      const models = await orpc.list3DModels()
      setSavedModels(models)
      console.log('✅ Loaded saved models from backend:', models.length)
      
      // Convert saved models to GenerationJob format and add to jobs if not already present
      const savedJobsFromBackend: GenerationJob[] = models.map(model => ({
        id: model.id,
        apiUrl: apiUrl || 'http://localhost:3000', // Use current API URL or default
        prompt: model.prompt,
        bodyPartType: model.bodyPartType as any,
        colorVariants: [{
          id: `${model.id}-color`,
          colorName: model.colorName || undefined,
          colorHex: model.colorHex || '#000000',
          images: { front: null, back: null, left: null, right: null }
        }],
        parameters: {
          inferenceSteps: model.inferenceSteps || 50,
          guidanceScale: parseFloat(model.guidanceScale || '7.5'),
          seed: 0,
          octreeResolution: 256,
          removeBackground: true,
          numberOfChunks: 1,
          randomizeSeed: false
        },
        status: 'completed' as const,
        progress: 100,
        createdAt: new Date(model.createdAt),
        completedAt: new Date(model.updatedAt),
        result: {
          fileUrl: model.leftLegUrl ? `http://localhost:3000${model.leftLegUrl}` : '',
          fileUrl2: model.rightLegUrl ? `http://localhost:3000${model.rightLegUrl}` : undefined,
          outputHtml: '',
          meshStats: {}
        }
      }))
      
      // Merge with existing jobs, avoiding duplicates
      setJobs(prevJobs => {
        const existingIds = new Set(prevJobs.map(j => j.id))
        const newJobs = savedJobsFromBackend.filter(j => !existingIds.has(j.id))
        return [...prevJobs, ...newJobs].sort((a, b) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        )
      })
    } catch (error) {
      console.error('Failed to load saved models:', error)
    } finally {
      setIsLoadingSavedModels(false)
    }
  }
  
  useEffect(() => {
    loadSavedModels()
  }, [apiUrl])

  // Save only completed/failed jobs to localStorage (without File objects)
  useEffect(() => {
    try {
      const jobsToSave = jobs
        .filter(job => job.status === 'completed' || job.status === 'failed')
        .map(job => ({
          ...job,
          // Remove File objects from colorVariants
          colorVariants: job.colorVariants.map(v => ({
            ...v,
            images: { front: null, back: null, left: null, right: null },
            rightLegImages: v.rightLegImages ? { front: null, back: null, left: null, right: null } : undefined
          }))
        }))
      localStorage.setItem('3d-agent-jobs', JSON.stringify(jobsToSave))
    } catch (error) {
      console.error('Failed to save jobs to localStorage:', error)
    }
  }, [jobs])

  const handleCreateJob = (job: GenerationJob) => {
    if (editingJob) {
      // Update existing job and regenerate
      const updatedJob = {
        ...job,
        id: editingJob.id, // Keep the same ID
        status: 'pending' as const,
        progress: 0,
        error: undefined,
        result: undefined, // Clear previous result
        createdAt: new Date(), // New creation time for regeneration
      }
      
      setJobs(prev => prev.map(j => j.id === editingJob.id ? updatedJob : j))
      setEditingJob(null)
      
      // Add to queue for regeneration
      setQueue(prev => [...prev, updatedJob])
    } else {
      // Add new job
      setJobs(prev => [job, ...prev])
      
      // Add to queue
      setQueue(prev => [...prev, job])
    }
    
    // Hide form
    setShowForm(false)
  }

  const handleViewJob = (job: GenerationJob) => {
    setSelectedJob(job)
    setShowViewer(true)
    setShowCharacterViewer(false)
  }

  const handleShowCharacterViewer = (job: GenerationJob) => {
    setSelectedJob(job)
    setShowViewer(false)
    setShowCharacterViewer(true)
  }

  // Listen for character viewer events
  useEffect(() => {
    const handleCharacterViewerEvent = (event: any) => {
      const job = event.detail as GenerationJob
      handleShowCharacterViewer(job)
    }
    
    const handleModelSavedEvent = () => {
      console.log('🔄 Model saved, reloading saved models...')
      loadSavedModels()
    }
    
    window.addEventListener('show-character-viewer', handleCharacterViewerEvent)
    window.addEventListener('model-saved', handleModelSavedEvent)
    
    return () => {
      window.removeEventListener('show-character-viewer', handleCharacterViewerEvent)
      window.removeEventListener('model-saved', handleModelSavedEvent)
    }
  }, [])

  const handleEditJob = (job: GenerationJob) => {
    setEditingJob(job)
    setShowForm(true)
  }

  const handleRetryJob = async (job: GenerationJob) => {
    // Reset job status and clear errorSeen flag
    const resetJob = {
      ...job,
      status: 'pending' as const,
      progress: 0,
      error: undefined,
      errorSeen: false,
      result: undefined,
      createdAt: new Date(),
    }
    
    setJobs(prev => prev.map(j => 
      j.id === job.id ? resetJob : j
    ))
    
    // Add back to queue
    setQueue(prev => [...prev, resetJob])
  }
  
  // Watch queue and start processing when jobs are added
  useEffect(() => {
    // Only start processing if:
    // 1. Queue has jobs
    // 2. Not already processing
    // 3. Queue length increased (job was added, not removed)
    const queueIncreased = queue.length > previousQueueLengthRef.current
    previousQueueLengthRef.current = queue.length
    
    if (queue.length > 0 && !isProcessingRef.current && queueIncreased) {
      console.log('🎯 New job added to queue, starting processing...')
      processQueue(queue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.length])

  const handleMarkErrorSeen = (jobId: string) => {
    setJobs(prev => prev.map(j => 
      j.id === jobId ? { ...j, errorSeen: true } : j
    ))
  }

  const handleSaveApiUrl = () => {
    if (!tempApiUrl.trim()) {
      alert('Please enter an API URL')
      return
    }
    
    // Validate URL format
    try {
      new URL(tempApiUrl)
    } catch {
      alert('Please enter a valid URL')
      return
    }
    
    setApiUrl(tempApiUrl)
    localStorage.setItem('3d-agent-api-url', tempApiUrl)
    setShowApiInput(false)
  }

  const handleCancelApiInput = () => {
    setTempApiUrl(apiUrl)
    setShowApiInput(false)
  }

  const processQueue = async (currentQueue: GenerationJob[]) => {
    if (isProcessingRef.current) {
      console.log('⏸️ Already processing queue, skipping...')
      return
    }
    
    if (currentQueue.length === 0) {
      console.log('📭 Queue is empty, nothing to process')
      return
    }
    
    isProcessingRef.current = true
    console.log(`🎬 Starting queue processing: ${currentQueue.length} jobs`)
    
    // Process only the jobs that are in the queue at the start
    const jobsToProcess = [...currentQueue]
    
    for (let i = 0; i < jobsToProcess.length; i++) {
      const job = jobsToProcess[i]
      
      console.log(`\n📦 Processing job ${i + 1}/${jobsToProcess.length}: ${job.id}`)
      
      // Update job status to processing
      updateJobStatus(job.id, 'processing', 0)
      
      try {
        // Check if this is a "both-legs" job that needs 2 generations
        const isBothLegs = job.bodyPartType === 'both-legs'
        
        // Process each color variant
        for (let j = 0; j < job.colorVariants.length; j++) {
          const variant = job.colorVariants[j]
          
          // Check if at least one image is uploaded
          const uploadedImages = Object.values(variant.images).filter(img => img !== null)
          
          if (uploadedImages.length === 0) {
            console.warn(`⚠️ Skipping variant ${j + 1} (${variant.colorName || variant.colorHex}) - no images uploaded`)
            continue
          }
          
          // For both-legs, also check right leg images
          if (isBothLegs) {
            const uploadedRightLegImages = variant.rightLegImages 
              ? Object.values(variant.rightLegImages).filter(img => img !== null)
              : []
            
            if (uploadedRightLegImages.length === 0) {
              console.warn(`⚠️ Skipping variant ${j + 1} (${variant.colorName || variant.colorHex}) - no right leg images uploaded`)
              continue
            }
          }
          
          console.log(`\n🎨 Processing color variant ${j + 1}/${job.colorVariants.length}: ${variant.colorName || variant.colorHex}`)
          
          if (isBothLegs) {
            // Generate left leg
            console.log('🦵 Generating LEFT leg...')
            updateJobStatus(job.id, 'processing', 25, undefined, 'Generating left leg...')
            const leftResult = await generateWith3DModel(job, variant, 'left')
            
            // Generate right leg with right leg images if available
            console.log('🦵 Generating RIGHT leg...')
            updateJobStatus(job.id, 'processing', 50, undefined, 'Generating right leg...')
            const rightResult = await generateWith3DModel(job, variant, 'right')
            
            // Store both URLs
            const leftUrl = (leftResult.data as any)[1]?.value?.url || (leftResult.data as any)[1]?.url || ''
            const rightUrl = (rightResult.data as any)[1]?.value?.url || (rightResult.data as any)[1]?.url || ''
            
            setJobs(prev => prev.map(jobItem => 
              jobItem.id === job.id 
                ? { 
                    ...jobItem, 
                    result: {
                      fileUrl: leftUrl,
                      fileUrl2: rightUrl,
                      outputHtml: (leftResult.data as any)[2] || '',
                      meshStats: (leftResult.data as any)[3] || {},
                    }
                  }
                : jobItem
            ))
            
            console.log('🎉 Both legs generated!')
            console.log('  Left leg:', leftUrl)
            console.log('  Right leg:', rightUrl)
          } else {
            // Single generation
            await generateWith3DModel(job, variant)
          }
          
          const progress = ((j + 1) / job.colorVariants.length) * 100
          updateJobStatus(job.id, 'processing', progress)
        }
        
        // Mark as completed
        updateJobStatus(job.id, 'completed', 100)
        console.log(`✅ Job ${job.id} completed successfully`)
        
      } catch (error) {
        // Mark as failed
        console.error(`❌ Job ${job.id} failed:`, error)
        updateJobStatus(job.id, 'failed', 0, error instanceof Error ? error.message : 'Unknown error')
      }
      
      // Remove from queue
      setQueue(prev => prev.filter(q => q.id !== job.id))
      
      // Wait 30 seconds before next job (if not last job)
      if (i < jobsToProcess.length - 1) {
        console.log(`⏳ Waiting ${AGENT_3D_CONFIG.queue.delayBetweenJobs / 1000} seconds before next job...`)
        await new Promise(resolve => setTimeout(resolve, AGENT_3D_CONFIG.queue.delayBetweenJobs))
      }
    }
    
    isProcessingRef.current = false
    console.log('✅ Queue processing complete')
  }

  const updateJobStatus = (
    jobId: string, 
    status: GenerationJob['status'], 
    progress: number,
    error?: string,
    currentStep?: string
  ) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            status, 
            progress,
            error,
            currentStep,
            completedAt: status === 'completed' || status === 'failed' ? new Date() : job.completedAt
          }
        : job
    ))
  }

  const generateWith3DModel = async (job: GenerationJob, variant: any, legSide?: 'left' | 'right') => {
    const sideLabel = legSide ? ` (${legSide} leg)` : ''
    console.log(`🚀 Starting 3D generation for variant: ${variant.colorName || variant.colorHex}${sideLabel}`)
    console.log('📡 API URL:', job.apiUrl)
    console.log('📝 Prompt:', job.prompt)
    
    try {
      // Connect to Gradio client with bypass header for localtunnel
      console.log('🔌 Connecting to Gradio client...')
      const client = await Client.connect(job.apiUrl, {
        // Add bypass-tunnel-reminder header to skip localtunnel reminder page
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      } as any)
      console.log('✅ Connected to Gradio client')

      // For right leg, use rightLegImages if available, otherwise use main images
      const imagesToUse = (legSide === 'right' && variant.rightLegImages) 
        ? variant.rightLegImages 
        : variant.images

      // Get uploaded images and use the first one as fallback for missing views
      const uploadedImages = Object.entries(imagesToUse).filter(([_, img]) => img !== null)
      
      if (uploadedImages.length === 0) {
        throw new Error('No images uploaded')
      }
      
      // Use the first uploaded image as fallback
      const fallbackImage = uploadedImages[0][1] as File
      
      // Convert File objects to Blob, using fallback for missing views
      const frontBlob = imagesToUse.front || fallbackImage
      const backBlob = imagesToUse.back || fallbackImage
      const leftBlob = imagesToUse.left || fallbackImage
      const rightBlob = imagesToUse.right || fallbackImage

      console.log('📸 Images ready:', {
        front: frontBlob.name,
        back: backBlob.name,
        left: leftBlob.name,
        right: rightBlob.name,
        source: (legSide === 'right' && variant.rightLegImages) ? 'rightLegImages' : 'main images',
        uploadedCount: uploadedImages.length,
        usingFallback: uploadedImages.length < 4
      })

      // Use front image as main image
      const mainImage = frontBlob

      console.log('📤 Sending prediction request...')
      console.log('📦 Parameters:', {
        caption: job.prompt,
        steps: job.parameters.inferenceSteps,
        guidance_scale: job.parameters.guidanceScale,
        seed: job.parameters.seed,
        octree_resolution: job.parameters.octreeResolution,
        check_box_rembg: job.parameters.removeBackground,
        num_chunks: job.parameters.numberOfChunks,
        randomize_seed: job.parameters.randomizeSeed,
      })

      // Call the generation_all endpoint for textured models
      const result = await client.predict("/generation_all", {
        caption: job.prompt,
        image: mainImage,
        mv_image_front: frontBlob,
        mv_image_back: backBlob,
        mv_image_left: leftBlob,
        mv_image_right: rightBlob,
        steps: job.parameters.inferenceSteps,
        guidance_scale: job.parameters.guidanceScale,
        seed: job.parameters.seed,
        octree_resolution: job.parameters.octreeResolution,
        check_box_rembg: job.parameters.removeBackground,
        num_chunks: job.parameters.numberOfChunks,
        randomize_seed: job.parameters.randomizeSeed,
      })

      console.log('✅ Prediction completed!', result)
      console.log('📊 Result data:', result.data)

      // Update job with result
      // generation_all returns: [white_mesh_glb, textured_mesh_glb, html, meshStats, seed]
      const resultData = result.data as any[]
      
      // The TEXTURED GLB file is at index 1, not index 0!
      // Index 0 is white_mesh.glb (untextured)
      // Index 1 is textured_mesh.glb (with textures)
      const texturedGlbUrl = resultData[1]?.value?.url || resultData[1]?.url || ''
      const whiteGlbUrl = resultData[0]?.value?.url || resultData[0]?.url || ''
      
      console.log('📦 White mesh GLB URL:', whiteGlbUrl)
      console.log('📦 Textured mesh GLB URL:', texturedGlbUrl)
      console.log('📦 Using textured mesh for viewer')
      
      // Extract HTML path from result (index 2)
      const htmlPath = resultData[2] || ''
      console.log('📄 HTML path:', htmlPath)
      
      // Only update job if not handling both-legs (both-legs is handled in processQueue)
      if (!legSide) {
        setJobs(prev => prev.map(j => 
          j.id === job.id 
            ? { 
                ...j, 
                result: {
                  fileUrl: texturedGlbUrl, // Use the textured mesh!
                  outputHtml: htmlPath,
                  meshStats: resultData[3] || {},
                }
              }
            : j
        ))
      }

      console.log(`🎉 Textured 3D model generated successfully!${legSide ? ` (${legSide} leg)` : ''}`)
      console.log('🔗 Final GLB URL for viewer:', texturedGlbUrl)
      return result
    } catch (error) {
      console.error('❌ Generation failed:', error)
      throw error
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        {!showForm && !showViewer && !showCharacterViewer && (
          <>
            <div className="flex items-center gap-2 flex-1">
              {!showApiInput ? (
                <>
                  <Button onClick={() => setShowApiInput(true)} variant="outline">
                    Set API
                  </Button>
                  {apiUrl && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-md">
                      <span className="text-sm text-muted-foreground">API:</span>
                      <span className="text-sm font-mono truncate max-w-[300px]">
                        {new URL(apiUrl).hostname}
                      </span>
                    </div>
                  )}
                  <Button 
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all generation history? This will remove all locally stored jobs.')) {
                        localStorage.removeItem('3d-agent-jobs')
                        setJobs([])
                        setQueue([])
                        toast.success('Generation history cleared')
                      }
                    }} 
                    variant="outline"
                    size="sm"
                  >
                    Clear History
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="url"
                    placeholder="https://your-gradio-instance.gradio.live"
                    value={tempApiUrl}
                    onChange={(e) => setTempApiUrl(e.target.value)}
                    className="max-w-md"
                  />
                  <Button onClick={handleSaveApiUrl} size="sm">
                    Save
                  </Button>
                  <Button onClick={handleCancelApiInput} variant="ghost" size="sm">
                    Cancel
                  </Button>
                </div>
              )}
            </div>
            <Button 
              onClick={() => {
                if (!apiUrl) {
                  alert('Please set the API URL first')
                  setShowApiInput(true)
                  return
                }
                setShowForm(true)
              }}
            >
              <IconPlus className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingJob ? 'Edit Generation' : 'New 3D Generation'}</CardTitle>
            <CardDescription>
              Upload images for each color variant and configure generation parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GenerationForm 
              onSubmit={handleCreateJob} 
              onCancel={() => {
                setShowForm(false)
                setEditingJob(null)
              }}
              initialData={editingJob || undefined}
              apiUrl={apiUrl}
            />
          </CardContent>
        </Card>
      )}

      {showViewer && selectedJob && (
        <ModelViewer job={selectedJob} onClose={() => {
          setShowViewer(false)
          setSelectedJob(null)
        }} />
      )}

      {showCharacterViewer && selectedJob && (
        <CharacterViewer job={selectedJob} onClose={() => {
          setShowCharacterViewer(false)
          setSelectedJob(null)
        }} />
      )}

      {!showForm && !showViewer && !showCharacterViewer && (
        <GenerationHistory 
          jobs={jobs} 
          onView={handleViewJob}
          onRetry={handleRetryJob}
          onEdit={handleEditJob}
        />
      )}

      {/* Queue notification popup */}
      <GenerationQueue 
        queue={queue} 
        currentJobs={jobs} 
        onRetry={handleRetryJob}
        onMarkErrorSeen={handleMarkErrorSeen}
      />
    </div>
  )
}
