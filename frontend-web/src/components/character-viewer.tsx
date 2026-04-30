import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { IconX } from '@tabler/icons-react'
import { type GenerationJob } from '@/config/3d-agent.config'
import { ErrorBoundary } from 'react-error-boundary'
import { orpc } from '@/lib/oprc'
import { toast } from 'sonner'
import { URL as AppURL } from '@/config'
import { CharacterWithItem } from './character-viewer/character-with-item'
import { LoadingSpinner } from './character-viewer/loading-spinner'
import { ViewerControls } from './character-viewer/viewer-controls'
import { SCALE_FACTORS } from './character-viewer/constants'

interface CharacterViewerProps {
  job: GenerationJob
  onClose: () => void
}

export function CharacterViewer({ job, onClose }: CharacterViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [proxiedItemUrl, setProxiedItemUrl] = useState<string>('')
  const [proxiedItemUrl2, setProxiedItemUrl2] = useState<string>('')
  
  // Load saved position from localStorage or use defaults
  const loadSavedPosition = () => {
    const bodyPartType = job.bodyPartType || 'chest'
    const key = `3d-position-${bodyPartType}`
    
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        const data = JSON.parse(saved)
        console.log(`✅ Loaded saved position for ${bodyPartType}:`, data)
        return {
          scale: data.scale || SCALE_FACTORS[bodyPartType] || 500,
          positionX: data.positionX || 0,
          positionY: data.positionY || 0,
          positionZ: data.positionZ || 0,
        }
      }
    } catch (error) {
      console.error('Failed to load saved position:', error)
    }
    
    return {
      scale: SCALE_FACTORS[bodyPartType] || 500,
      positionX: 0,
      positionY: 0,
      positionZ: 0,
    }
  }
  
  const savedPosition = loadSavedPosition()
  
  const [scale, setScale] = useState<number>(savedPosition.scale)
  const [positionX, setPositionX] = useState<number>(savedPosition.positionX)
  const [positionY, setPositionY] = useState<number>(savedPosition.positionY)
  const [positionZ, setPositionZ] = useState<number>(savedPosition.positionZ)
  const [availableAnimations, setAvailableAnimations] = useState<string[]>([])
  const [selectedAnimation, setSelectedAnimation] = useState<string>('idle')
  const [isSaving, setIsSaving] = useState(false)
  const [savedModelId, setSavedModelId] = useState<string | null>(null)
  const [savedModelData, setSavedModelData] = useState<any>(null)
  const [isCheckingSaved, setIsCheckingSaved] = useState(true)
  const [showXbot, setShowXbot] = useState(true)
  
  const characterModelUrl = '/Xbot.glb'
  
  const itemUrl = savedModelData?.leftLegFile 
    ? `${AppURL.BASE}/api/admin/3d-models/files/${savedModelData.leftLegFile}` 
    : (job.result?.fileUrl || '')
  const itemUrl2 = savedModelData?.rightLegFile 
    ? `${AppURL.BASE}/api/admin/3d-models/files/${savedModelData.rightLegFile}` 
    : (job.result?.fileUrl2 || '')
  
  // Check if model is already saved
  useEffect(() => {
    const checkSaved = async () => {
      try {
        setIsCheckingSaved(true)
        const result = await orpc.checkModelSaved({
          prompt: job.prompt,
          bodyPartType: job.bodyPartType || 'chest'
        })
        
        if (result.isSaved && result.modelId && result.model) {
          setSavedModelId(result.modelId)
          setSavedModelData(result.model)
          
          if (result.model.scale) setScale(typeof result.model.scale === 'string' ? parseFloat(result.model.scale) : result.model.scale)
          if (result.model.positionX !== null && result.model.positionX !== undefined) setPositionX(parseFloat(String(result.model.positionX)))
          if (result.model.positionY !== null && result.model.positionY !== undefined) setPositionY(parseFloat(String(result.model.positionY)))
          if (result.model.positionZ !== null && result.model.positionZ !== undefined) setPositionZ(parseFloat(String(result.model.positionZ)))
          
          console.log('✅ Loaded saved model with adjustments:', {
            scale: result.model.scale,
            positionX: result.model.positionX,
            positionY: result.model.positionY,
            positionZ: result.model.positionZ,
            leftLegFile: result.model.leftLegFile,
            rightLegFile: result.model.rightLegFile
          })
        }
      } catch (error) {
        console.error('Failed to check if model is saved:', error)
      } finally {
        setIsCheckingSaved(false)
      }
    }
    
    checkSaved()
  }, [job.prompt, job.bodyPartType])
  
  // Fetch GLB files
  useEffect(() => {
    let isMounted = true
    
    const fetchViaProxy = async (url: string): Promise<string> => {
      console.log('📥 Fetching GLB via backend proxy from:', url)
      
      const result = await orpc.proxyGLB({ url })
      
      if (!result.success) {
        throw new Error('Proxy returned error')
      }
      
      const binaryString = atob(result.data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: 'model/gltf-binary' })
      
      console.log('✅ GLB blob created via proxy, size:', blob.size)
      return URL.createObjectURL(blob)
    }
    
    const fetchDirectly = async (url: string): Promise<string> => {
      console.log('📥 Fetching GLB directly from local server:', url)
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`)
      }
      
      const blob = await response.blob()
      console.log('✅ GLB blob created directly, size:', blob.size)
      return URL.createObjectURL(blob)
    }
    
    const loadGLBs = async () => {
      try {
        if (itemUrl && isMounted) {
          const isLocalUrl = itemUrl.startsWith(AppURL.BASE) || itemUrl.startsWith('/api/')
          
          if (isLocalUrl) {
            console.log('📥 Fetching left leg GLB from local server...')
            const blobUrl = await fetchDirectly(itemUrl)
            if (isMounted) {
              setProxiedItemUrl(blobUrl)
              console.log('✅ Left leg GLB loaded from local server')
            }
          } else {
            console.log('📥 Fetching left leg GLB via proxy...')
            const blobUrl = await fetchViaProxy(itemUrl)
            if (isMounted) {
              setProxiedItemUrl(blobUrl)
              console.log('✅ Left leg GLB loaded via proxy')
            }
          }
        }
        
        if (itemUrl2 && isMounted) {
          const isLocalUrl = itemUrl2.startsWith(AppURL.BASE) || itemUrl2.startsWith('/api/')
          
          if (isLocalUrl) {
            console.log('📥 Fetching right leg GLB from local server...')
            const blobUrl2 = await fetchDirectly(itemUrl2)
            if (isMounted) {
              setProxiedItemUrl2(blobUrl2)
              console.log('✅ Right leg GLB loaded from local server')
            }
          } else {
            console.log('📥 Fetching right leg GLB via proxy...')
            const blobUrl2 = await fetchViaProxy(itemUrl2)
            if (isMounted) {
              setProxiedItemUrl2(blobUrl2)
              console.log('✅ Right leg GLB loaded via proxy')
            }
          }
        }
      } catch (error) {
        console.error('❌ Failed to fetch GLB files:', error)
        if (isMounted) {
          handleLoadError(error)
        }
      }
    }
    
    if (itemUrl) {
      loadGLBs()
    }
    
    return () => {
      isMounted = false
      if (proxiedItemUrl) URL.revokeObjectURL(proxiedItemUrl)
      if (proxiedItemUrl2) URL.revokeObjectURL(proxiedItemUrl2)
    }
  }, [itemUrl, itemUrl2])
  
  const handleSaveModel = async () => {
    setIsSaving(true)
    try {
      const colorName = job.colorVariants[0]?.colorName || job.colorVariants[0]?.colorHex || 'default'
      const bodyPart = job.bodyPartType?.replace(/-/g, ' ') || 'item'
      const autoName = `${colorName} ${bodyPart} - ${new Date().toLocaleString()}`
      
      const result = await orpc.save3DModel({
        id: savedModelId || undefined,
        name: autoName,
        bodyPartType: job.bodyPartType || 'chest',
        colorName: job.colorVariants[0]?.colorName,
        colorHex: job.colorVariants[0]?.colorHex,
        prompt: job.prompt,
        leftLegUrl: job.result?.fileUrl,
        rightLegUrl: job.result?.fileUrl2,
        scale,
        positionX,
        positionY,
        positionZ,
        inferenceSteps: job.parameters.inferenceSteps,
        guidanceScale: job.parameters.guidanceScale,
      })

      if (result.id) {
        setSavedModelId(result.id)
        const checkResult = await orpc.checkModelSaved({
          prompt: job.prompt,
          bodyPartType: job.bodyPartType || 'chest'
        })
        if (checkResult.model) {
          setSavedModelData(checkResult.model)
        }
      }

      toast.success(savedModelId ? 'Model updated successfully!' : 'Model saved successfully!')
      window.dispatchEvent(new CustomEvent('model-saved'))
    } catch (error) {
      console.error('Failed to save model:', error)
      toast.error('Failed to save model')
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleSavePositionLocally = () => {
    try {
      const bodyPartType = job.bodyPartType || 'chest'
      const key = `3d-position-${bodyPartType}`
      
      const positionData = {
        scale,
        positionX,
        positionY,
        positionZ,
      }
      
      localStorage.setItem(key, JSON.stringify(positionData))
      toast.success(`Position saved for ${bodyPartType.replace(/-/g, ' ')}`)
      console.log(`✅ Saved position locally for ${bodyPartType}:`, positionData)
    } catch (error) {
      console.error('Failed to save position locally:', error)
      toast.error('Failed to save position')
    }
  }
  
  const handleLoadError = (error: any) => {
    console.error('❌ Failed to load character/item:', error)
    const errorMsg = error?.message || 'Failed to load 3D models'
    
    if (errorMsg.includes('CORS') || errorMsg.includes('fetch') || errorMsg.includes('Failed to load')) {
      setLoadError('Cannot load 3D model due to CORS restrictions.')
    } else {
      setLoadError(errorMsg)
    }
    setIsLoading(false)
  }
  
  const handleReset = () => {
    const bodyPartType = job.bodyPartType || 'chest'
    setScale(SCALE_FACTORS[bodyPartType] || 500)
    setPositionX(0)
    setPositionY(0)
    setPositionZ(0)
  }
  
  if (!itemUrl) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground">No 3D model available</p>
            <Button onClick={onClose} className="mt-4">Close</Button>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Main 3D Viewer Area */}
      <div className="flex-1 flex flex-col">
        {/* Compact Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
          <div>
            <h2 className="text-lg font-bold">Character Try-On</h2>
            <p className="text-xs text-muted-foreground">
              {job.bodyPartType?.replace(/-/g, ' ')}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <IconX className="h-4 w-4" />
          </Button>
        </div>

        {/* 3D Character Viewer */}
        <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden" style={{ touchAction: 'none' }}>
          {isLoading && !loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-900/80">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-white text-sm">Loading character...</p>
            </div>
          )}
          
          {!loadError && (
            <ErrorBoundary
              fallback={<div />}
              onError={(error) => {
                console.error('ErrorBoundary caught:', error)
                handleLoadError(error)
              }}
            >
              <Canvas
                camera={{ position: [0, 1.5, 3], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
                onCreated={() => setIsLoading(false)}
                onError={handleLoadError}
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
                  <directionalLight position={[-5, 3, -5]} intensity={0.5} />
                  <spotLight position={[0, 10, 0]} intensity={0.3} />
                  
                  {proxiedItemUrl && (
                    <CharacterWithItem 
                      characterUrl={characterModelUrl}
                      itemUrl={proxiedItemUrl}
                      itemUrl2={proxiedItemUrl2}
                      bodyPartType={job.bodyPartType || 'chest'}
                      scale={scale}
                      positionX={positionX}
                      positionY={positionY}
                      positionZ={positionZ}
                      selectedAnimation={selectedAnimation}
                      showXbot={showXbot}
                      onAnimationsLoaded={setAvailableAnimations}
                    />
                  )}
                  
                  <Environment preset="sunset" />
                  
                  <OrbitControls 
                    target={[0, 1, 0]}
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={2}
                    maxDistance={10}
                    maxPolarAngle={Math.PI / 2}
                  />
                  
                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                    <planeGeometry args={[20, 20]} />
                    <meshStandardMaterial color="#2a2a2a" />
                  </mesh>
                </Suspense>
              </Canvas>
            </ErrorBoundary>
          )}
          
          {loadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-20">
              <div className="text-center p-8 max-w-md">
                <div className="mb-4 text-red-400 text-5xl">⚠️</div>
                <h3 className="text-xl font-bold text-white mb-3">Cannot Load 3D Model</h3>
                <p className="text-sm text-gray-300 mb-6">{loadError}</p>
                <div className="space-y-3">
                  <Button onClick={onClose} variant="outline" className="w-full">
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Side Panel with Controls */}
      <ViewerControls
        availableAnimations={availableAnimations}
        selectedAnimation={selectedAnimation}
        onAnimationChange={setSelectedAnimation}
        showXbot={showXbot}
        onShowXbotChange={setShowXbot}
        scale={scale}
        onScaleChange={setScale}
        positionX={positionX}
        onPositionXChange={setPositionX}
        positionY={positionY}
        onPositionYChange={setPositionY}
        positionZ={positionZ}
        onPositionZChange={setPositionZ}
        onSavePositionLocally={handleSavePositionLocally}
        onReset={handleReset}
        onSaveModel={handleSaveModel}
        onClose={onClose}
        isSaving={isSaving}
        isCheckingSaved={isCheckingSaved}
        savedModelId={savedModelId}
        bodyPartType={job.bodyPartType || 'chest'}
      />
    </div>
  )
}
