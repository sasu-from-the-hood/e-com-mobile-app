import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Center } from '@react-three/drei'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconX, IconDownload, IconUser } from '@tabler/icons-react'
import { type GenerationJob } from '@/config/3d-agent.config'
import * as THREE from 'three'
import { ErrorBoundary } from 'react-error-boundary'
import { orpc } from '@/lib/oprc'

interface ModelViewerProps {
  job: GenerationJob
  onClose: () => void
}

function Model({ url }: { url: string }) {
  const modelRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(url)
  
  // Auto-rotate the model
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005
    }
  })

  return (
    <Center>
      <primitive ref={modelRef} object={scene} scale={1} />
    </Center>
  )
}

function LoadingSpinner() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#3b82f6" wireframe />
    </mesh>
  )
}

export function ModelViewer({ job, onClose }: ModelViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [proxiedGlbUrl, setProxiedGlbUrl] = useState<string>('')
  const [proxiedGlbUrl2, setProxiedGlbUrl2] = useState<string>('')
  const [savedModelData, setSavedModelData] = useState<any>(null)
  const [isCheckingSaved, setIsCheckingSaved] = useState(true)
  
  // Check if model is already saved and use local URLs if available
  useEffect(() => {
    const checkSaved = async () => {
      try {
        setIsCheckingSaved(true)
        const result = await orpc.checkModelSaved({
          prompt: job.prompt,
          bodyPartType: job.bodyPartType || 'chest'
        })
        
        if (result.isSaved && result.model) {
          setSavedModelData(result.model)
          console.log('✅ Found saved model, will use local URLs')
        }
      } catch (error) {
        console.error('Failed to check if model is saved:', error)
      } finally {
        setIsCheckingSaved(false)
      }
    }
    
    checkSaved()
  }, [job.prompt, job.bodyPartType])
  
  // Use saved model URLs if available, otherwise use job result URLs
  const glbUrl = savedModelData?.leftLegFile 
    ? `http://localhost:3000/api/admin/3d-models/files/${savedModelData.leftLegFile}` 
    : (job.result?.fileUrl || '')
  const glbUrl2 = savedModelData?.rightLegFile 
    ? `http://localhost:3000/api/admin/3d-models/files/${savedModelData.rightLegFile}` 
    : (job.result?.fileUrl2 || '')
  
  const hasBothLegs = job.bodyPartType === 'both-legs' && glbUrl && glbUrl2
  
  // Also try the HTML path as fallback
  const htmlUrl = job.result?.outputHtml 
    ? `${job.apiUrl}${job.result.outputHtml}` 
    : null

  console.log('🎨 Model Viewer - Full Job:', job)
  console.log('🎨 Model Viewer - Result:', job.result)
  console.log('🎨 Model Viewer URLs:', { glbUrl, glbUrl2, htmlUrl, hasBothLegs, savedModelData })
  
  // Fetch GLB files with bypass header and convert to blob URLs
  useEffect(() => {
    let isMounted = true
    
    const fetchViaProxy = async (url: string): Promise<string> => {
      console.log('📥 Fetching GLB via backend proxy from:', url)
      
      // Use oRPC client to call the proxy endpoint
      const result = await orpc.proxyGLB({ url })
      
      if (!result.success) {
        throw new Error('Proxy returned error')
      }
      
      // Convert base64 to blob
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
        // Load first GLB (left leg or single item)
        if (glbUrl && isMounted && !isCheckingSaved) {
          // Check if URL is from local server or external
          const isLocalUrl = glbUrl.startsWith('http://localhost') || glbUrl.startsWith('/api/')
          
          if (isLocalUrl) {
            console.log('📥 Fetching left leg GLB from local server...')
            const blobUrl = await fetchDirectly(glbUrl)
            if (isMounted) {
              setProxiedGlbUrl(blobUrl)
              console.log('✅ Left leg GLB loaded from local server')
            }
          } else {
            console.log('📥 Fetching left leg GLB via proxy...')
            const blobUrl = await fetchViaProxy(glbUrl)
            if (isMounted) {
              setProxiedGlbUrl(blobUrl)
              console.log('✅ Left leg GLB loaded via proxy')
            }
          }
        }
        
        // Load second GLB (right leg) if exists
        if (glbUrl2 && isMounted && !isCheckingSaved) {
          // Check if URL is from local server or external
          const isLocalUrl = glbUrl2.startsWith('http://localhost') || glbUrl2.startsWith('/api/')
          
          if (isLocalUrl) {
            console.log('📥 Fetching right leg GLB from local server...')
            const blobUrl2 = await fetchDirectly(glbUrl2)
            if (isMounted) {
              setProxiedGlbUrl2(blobUrl2)
              console.log('✅ Right leg GLB loaded from local server')
            }
          } else {
            console.log('📥 Fetching right leg GLB via proxy...')
            const blobUrl2 = await fetchViaProxy(glbUrl2)
            if (isMounted) {
              setProxiedGlbUrl2(blobUrl2)
              console.log('✅ Right leg GLB loaded via proxy')
            }
          }
        }
      } catch (error) {
        console.error('❌ Failed to fetch GLB file:', error)
        if (isMounted) {
          handleLoadError(error)
        }
      }
    }
    
    if (glbUrl && !isCheckingSaved) {
      loadGLBs()
    }
    
    // Cleanup
    return () => {
      isMounted = false
      if (proxiedGlbUrl) {
        URL.revokeObjectURL(proxiedGlbUrl)
      }
      if (proxiedGlbUrl2) {
        URL.revokeObjectURL(proxiedGlbUrl2)
      }
    }
  }, [glbUrl, glbUrl2, isCheckingSaved]) // Depend on both URLs and checking state

  const handleDownload = () => {
    if (job.result?.fileUrl) {
      const link = document.createElement('a')
      link.href = job.result.fileUrl
      link.download = `3d-model-${job.id}.glb`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleLoadError = (error: any) => {
    console.error('❌ Failed to load 3D model:', error)
    const errorMsg = error?.message || 'Failed to load 3D model'
    
    // Check if it's a CORS error
    if (errorMsg.includes('CORS') || errorMsg.includes('fetch') || errorMsg.includes('Failed to load')) {
      setLoadError('Cannot load 3D model due to CORS restrictions from the server.')
    } else {
      setLoadError(errorMsg)
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">3D Model Viewer</h2>
          <p className="text-sm text-muted-foreground">
            {job.prompt}
            {hasBothLegs && <span className="ml-2 text-xs">(Showing both legs side by side)</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {job.result?.fileUrl && (
            <Button onClick={handleDownload} variant="outline">
              <IconDownload className="mr-2 h-4 w-4" />
              Download GLB
            </Button>
          )}
          {job.bodyPartType && job.result?.fileUrl && (
            <Button 
              variant="default"
              onClick={() => {
                // Trigger character viewer
                onClose()
                window.dispatchEvent(new CustomEvent('show-character-viewer', { detail: job }))
              }}
            >
              <IconUser className="mr-2 h-4 w-4" />
              Try On Character
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <IconX className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* 3D Viewer */}
      {hasBothLegs ? (
        // Show two viewers side by side for both legs
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Left Leg</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-[600px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden relative">
                {proxiedGlbUrl ? (
                  <>
                    {isLoading && !loadError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-900/80">
                        <div className="relative w-16 h-16">
                          <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
                          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="mt-4 text-white text-sm">Loading left leg...</p>
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
                          camera={{ position: [0, 0, 5], fov: 50 }}
                          gl={{ antialias: true, alpha: true }}
                          onCreated={() => setIsLoading(false)}
                          onError={handleLoadError}
                        >
                          <Suspense fallback={<LoadingSpinner />}>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[10, 10, 5]} intensity={1} />
                            <directionalLight position={[-10, -10, -5]} intensity={0.5} />
                            <Model url={proxiedGlbUrl} />
                            <Environment preset="studio" />
                            <OrbitControls 
                              enablePan={true}
                              enableZoom={true}
                              enableRotate={true}
                              autoRotate={false}
                            />
                          </Suspense>
                        </Canvas>
                      </ErrorBoundary>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-8">
                      <div className="relative w-12 h-12 mx-auto mb-3">
                        <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-sm text-gray-300">Loading...</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Right Leg</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-[600px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden relative">
                {proxiedGlbUrl2 ? (
                  <>
                    {isLoading && !loadError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-900/80">
                        <div className="relative w-16 h-16">
                          <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
                          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="mt-4 text-white text-sm">Loading right leg...</p>
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
                          camera={{ position: [0, 0, 5], fov: 50 }}
                          gl={{ antialias: true, alpha: true }}
                          onCreated={() => setIsLoading(false)}
                          onError={handleLoadError}
                        >
                          <Suspense fallback={<LoadingSpinner />}>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[10, 10, 5]} intensity={1} />
                            <directionalLight position={[-10, -10, -5]} intensity={0.5} />
                            <Model url={proxiedGlbUrl2} />
                            <Environment preset="studio" />
                            <OrbitControls 
                              enablePan={true}
                              enableZoom={true}
                              enableRotate={true}
                              autoRotate={false}
                            />
                          </Suspense>
                        </Canvas>
                      </ErrorBoundary>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-8">
                      <div className="relative w-12 h-12 mx-auto mb-3">
                        <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-sm text-gray-300">Loading...</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Show single viewer for single item
        <Card>
          <CardContent className="p-0">
            <div className="w-full h-[600px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden relative">
              {(proxiedGlbUrl || proxiedGlbUrl2) ? (
                <>
                  {isLoading && !loadError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-900/80">
                      <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="mt-4 text-white text-sm">Loading 3D model...</p>
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
                        camera={{ position: [0, 0, 5], fov: 50 }}
                        gl={{ antialias: true, alpha: true }}
                        onCreated={() => setIsLoading(false)}
                        onError={handleLoadError}
                      >
                        <Suspense fallback={<LoadingSpinner />}>
                          <ambientLight intensity={0.5} />
                          <directionalLight position={[10, 10, 5]} intensity={1} />
                          <directionalLight position={[-10, -10, -5]} intensity={0.5} />
                          {proxiedGlbUrl && <Model url={proxiedGlbUrl} />}
                          <Environment preset="studio" />
                          <OrbitControls 
                            enablePan={true}
                            enableZoom={true}
                            enableRotate={true}
                            autoRotate={false}
                          />
                        </Suspense>
                      </Canvas>
                    </ErrorBoundary>
                  )}
                  
                  {/* Error overlay */}
                  {loadError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/95 z-20">
                      <div className="text-center p-8 max-w-md">
                        <div className="mb-4 text-red-400 text-5xl">⚠️</div>
                        <h3 className="text-xl font-bold text-white mb-3">Cannot Load 3D Model</h3>
                        <p className="text-sm text-gray-300 mb-6">{loadError}</p>
                        <div className="space-y-3">
                          <Button onClick={handleDownload} className="w-full">
                            <IconDownload className="mr-2 h-4 w-4" />
                            Download GLB File
                          </Button>
                          {htmlUrl && (
                            <a 
                              href={htmlUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline" className="w-full">
                                Open HTML Viewer
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : glbUrl ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8 max-w-md">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Loading 3D Model</h3>
                    <p className="text-sm text-gray-300 mb-6">
                      Fetching model file via proxy...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8 max-w-md">
                    <div className="mb-4 text-yellow-400 text-5xl">⚠️</div>
                    <h3 className="text-xl font-bold text-white mb-3">No 3D Model Available</h3>
                    <p className="text-sm text-gray-300 mb-6">
                      The generation did not produce a model file.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Details */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">API URL:</span>
              <a 
                href={job.apiUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate max-w-[200px]"
              >
                {new URL(job.apiUrl).hostname}
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium">{job.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Body Part:</span>
              <span className="font-medium capitalize">{job.bodyPartType?.replace(/-/g, ' ') || 'Not specified'}</span>
            </div>
            {job.result?.fileUrl && (
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Model URL:</span>
                <a 
                  href={job.result.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-xs break-all"
                >
                  {job.result.fileUrl}
                </a>
              </div>
            )}
            {job.result?.fileUrl2 && (
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Model URL 2 (Right):</span>
                <a 
                  href={job.result.fileUrl2} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-xs break-all"
                >
                  {job.result.fileUrl2}
                </a>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Color Variants:</span>
              <div className="flex gap-1">
                {job.colorVariants.map((variant) => (
                  <div
                    key={variant.id}
                    className="w-5 h-5 rounded border"
                    style={{ backgroundColor: variant.colorHex }}
                    title={variant.colorName || variant.colorHex}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Inference Steps:</span>
              <span>{job.parameters.inferenceSteps}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Guidance Scale:</span>
              <span>{job.parameters.guidanceScale}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Octree Resolution:</span>
              <span>{job.parameters.octreeResolution}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Remove Background:</span>
              <span>{job.parameters.removeBackground ? 'Yes' : 'No'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mesh Stats */}
      {job.result?.meshStats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mesh Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-40">
              {JSON.stringify(job.result.meshStats, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
