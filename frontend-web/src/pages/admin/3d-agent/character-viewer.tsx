import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, useAnimations, Environment } from '@react-three/drei'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { IconX } from '@tabler/icons-react'
import { type GenerationJob } from '@/config/3d-agent.config'
import * as THREE from 'three'
import { ErrorBoundary } from 'react-error-boundary'
import { orpc } from '@/lib/oprc'
import { toast } from 'sonner'

interface CharacterViewerProps {
  job: GenerationJob
  onClose: () => void
}

// Attachment bone names for different body part types
// Supports multiple naming conventions (Mixamo, Xbot, etc.)
const ATTACHMENT_BONES: Record<string, string[]> = {
  'both-legs': [
    'LeftFoot', 'RightFoot', 
    'mixamorigLeftFoot', 'mixamorigRightFoot',
    'LeftToeBase', 'RightToeBase',
    'mixamorigLeftToeBase', 'mixamorigRightToeBase'
  ],
  'left-leg': [
    'LeftFoot', 'mixamorigLeftFoot', 'LeftToeBase', 'mixamorigLeftToeBase'
  ],
  'right-leg': [
    'RightFoot', 'mixamorigRightFoot', 'RightToeBase', 'mixamorigRightToeBase'
  ],
  'top-head': [
    'Head', 'mixamorigHead', 'HeadTop_End'
  ],
  'middle-head': [
    'Head', 'mixamorigHead'
  ],
  'lower-head': [
    'Head', 'mixamorigHead'
  ],
  'chest': [
    'Spine', 'Spine1', 'Spine2', 
    'mixamorigSpine', 'mixamorigSpine1', 'mixamorigSpine2',
    'UpperChest', 'Chest'
  ],
  'left-hand': [
    'LeftHand', 'mixamorigLeftHand', 'LeftHandIndex1'
  ],
  'right-hand': [
    'RightHand', 'mixamorigRightHand', 'RightHandIndex1'
  ],
}

// Scale factors for different body part types
const SCALE_FACTORS: Record<string, number> = {
  'both-legs': 35,
  'left-leg': 35,
  'right-leg': 35,
  'top-head': 1.0,
  'middle-head': 1.0,
  'lower-head': 1.0,
  'chest': 1.5,
  'left-hand': 0.5,
  'right-hand': 0.5,
}

function CharacterWithItem({ characterUrl, itemUrl, itemUrl2, bodyPartType, scale, positionX, positionY, positionZ, selectedAnimation, onAnimationsLoaded }: { 
  characterUrl: string
  itemUrl: string
  itemUrl2?: string // For both-legs, this is the right leg GLB
  bodyPartType: GenerationJob['bodyPartType']
  scale: number // Dynamic scale from parent
  positionX: number
  positionY: number
  positionZ: number
  selectedAnimation: string
  onAnimationsLoaded: (animations: string[]) => void
}) {
  const characterRef = useRef<THREE.Group>(null)
  const itemRef = useRef<THREE.Group>(null)
  const itemRef2 = useRef<THREE.Group>(null) // For right leg
  const attachedRef = useRef(false) // Track if items are already attached
  const attachedItemsRef = useRef<THREE.Object3D[]>([]) // Store attached items
  
  // Load character model
  const { scene: characterScene, animations } = useGLTF(characterUrl)
  const { actions, mixer } = useAnimations(animations, characterRef)
  
  // Load item model (left leg or single item)
  const { scene: itemScene } = useGLTF(itemUrl)
  
  // Load second item model (right leg) if provided
  const itemScene2 = itemUrl2 ? useGLTF(itemUrl2).scene : null
  
  // Start animation
  useEffect(() => {
    if (actions) {
      const animationNames = Object.keys(actions)
      console.log('🎬 Available animations:', animationNames)
      
      // Send available animations to parent
      onAnimationsLoaded(animationNames)
      
      // Stop all current animations
      Object.values(actions).forEach(action => action?.stop())
      
      // Play selected animation
      const action = actions[selectedAnimation]
      
      if (action) {
        console.log(`✅ Playing animation: ${selectedAnimation}`)
        action.reset()
        action.play()
      } else {
        console.warn(`⚠️ Animation "${selectedAnimation}" not found, trying fallback...`)
        // Fallback to idle or first animation
        const fallbackAction = 
          actions['idle'] || 
          actions['Idle'] || 
          actions['T-Pose'] ||
          actions['TPose'] ||
          Object.values(actions)[0]
        
        if (fallbackAction) {
          console.log('✅ Playing fallback animation')
          fallbackAction.reset()
          fallbackAction.play()
        }
      }
    }
  }, [actions, selectedAnimation, onAnimationsLoaded])
  
  // Attach item to character bone
  useEffect(() => {
    if (!characterRef.current || !itemRef.current || !bodyPartType) return
    if (attachedRef.current) {
      console.log('⏭️ Skipping attachment - already attached')
      return // Prevent duplicate attachments
    }
    
    const character = characterRef.current
    const item = itemRef.current
    const item2 = itemRef2.current // Right leg (if exists)
    
    console.log('🔍 Searching for bones to attach', bodyPartType)
    
    // Log all bones in the character for debugging
    const allBones: string[] = []
    character.traverse((child) => {
      if (child.type === 'Bone' || child instanceof THREE.Bone) {
        allBones.push(child.name)
      }
    })
    console.log('📋 Available bones:', allBones)
    
    // Find the appropriate bones (can be multiple for legs)
    const boneNames = ATTACHMENT_BONES[bodyPartType] || []
    const targetBones: THREE.Object3D[] = []
    const foundBoneNames = new Set<string>() // Track unique bone names
    
    character.traverse((child) => {
      if (child.type === 'Bone' || child instanceof THREE.Bone) {
        // Skip if we already found this bone name
        if (foundBoneNames.has(child.name)) return
        
        for (const boneName of boneNames) {
          if (child.name.toLowerCase().includes(boneName.toLowerCase())) {
            targetBones.push(child)
            foundBoneNames.add(child.name)
            break // Only match once per bone
          }
        }
      }
    })
    
    console.log(`🎯 Found ${targetBones.length} bones for ${bodyPartType}:`, targetBones.map(b => b.name))
    
    if (targetBones.length > 0) {
      // For legs, attach to ONLY the main foot bones (not toes)
      // For other items, attach to the first bone found
      let bonesToUse: THREE.Object3D[] = []
      
      if (bodyPartType === 'both-legs' || bodyPartType === 'left-leg' || bodyPartType === 'right-leg') {
        // Only use LeftFoot and RightFoot, not toe bones
        // Filter to get exactly one left foot and one right foot
        const leftFoot = targetBones.find(b => 
          b.name.toLowerCase().includes('leftfoot') && !b.name.toLowerCase().includes('toe')
        )
        const rightFoot = targetBones.find(b => 
          b.name.toLowerCase().includes('rightfoot') && !b.name.toLowerCase().includes('toe')
        )
        
        if (leftFoot) bonesToUse.push(leftFoot)
        if (rightFoot) bonesToUse.push(rightFoot)
      } else {
        bonesToUse = [targetBones[0]]
      }
      
      console.log(`📌 Attaching to ${bonesToUse.length} bone(s):`, bonesToUse.map(b => b.name))
      
      bonesToUse.forEach((targetBone, index) => {
        console.log(`\n🔧 Attaching item #${index + 1}:`)
        console.log('  🦴 Target bone:', targetBone.name)
        console.log('  👶 Bone children BEFORE cleanup:', targetBone.children.length)
        
        // First, remove any existing items attached to this bone (cleanup old attachments)
        const existingChildren = [...targetBone.children]
        let removedCount = 0
        existingChildren.forEach(child => {
          // Only remove items we added (Groups), not the bone's natural children
          if (child.type === 'Group' && child.userData.isAttachedItem) {
            targetBone.remove(child)
            removedCount++
            console.log(`  🗑️ Removed existing item from ${targetBone.name}`)
          }
        })
        console.log(`  🧹 Removed ${removedCount} existing items`)
        console.log('  👶 Bone children AFTER cleanup:', targetBone.children.length)
        
        // For both-legs, use the appropriate GLB for each foot
        let itemToAttach: THREE.Group
        const isLeftFoot = targetBone.name.toLowerCase().includes('left')
        const isRightFoot = targetBone.name.toLowerCase().includes('right')
        
        if (bodyPartType === 'both-legs' && item2 && isRightFoot) {
          // Use right leg GLB for right foot
          itemToAttach = item2.clone()
          console.log('  🦵 Using RIGHT leg GLB for right foot')
        } else {
          // Use left leg GLB for left foot (or single item for other body parts)
          itemToAttach = item.clone()
          if (bodyPartType === 'both-legs' && isLeftFoot) {
            console.log('  🦵 Using LEFT leg GLB for left foot')
          }
        }
        
        itemToAttach.userData.isAttachedItem = true // Mark as our attached item
        
        console.log('  📦 Item to attach:', itemToAttach)
        console.log('  📏 Item children count:', itemToAttach.children.length)
        
        // Make sure all materials are visible
        let meshCount = 0
        const meshes: THREE.Mesh[] = []
        itemToAttach.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            meshCount++
            meshes.push(child)
            console.log(`    🔹 Mesh ${meshCount}:`, child.name || 'unnamed', 'visible:', child.visible)
            child.visible = true
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((mat, i) => {
                  console.log(`      🎨 Material ${i}:`, mat.type, 'opacity:', mat.opacity)
                  mat.transparent = false
                  mat.opacity = 1
                  mat.visible = true
                })
              } else {
                console.log(`      🎨 Material:`, child.material.type, 'opacity:', child.material.opacity)
                child.material.transparent = false
                child.material.opacity = 1
                child.material.visible = true
              }
            }
          }
        })
        
        console.log(`  ✅ Found ${meshCount} meshes in item`)
        
        // Use the dynamic scale from props
        itemToAttach.scale.setScalar(scale)
        
        // Use dynamic position from props
        itemToAttach.position.set(positionX, positionY, positionZ)
        
        // Make item visible
        itemToAttach.visible = true
        
        // Attach item to bone
        targetBone.add(itemToAttach)
        attachedItemsRef.current.push(itemToAttach) // Store in ref
        
        console.log(`  ✅ Attached to bone: ${targetBone.name}`)
        console.log(`  📐 Scale: ${scale}`)
        console.log(`  📍 Position:`, itemToAttach.position)
        console.log(`  👁️ Visible:`, itemToAttach.visible)
        console.log(`  👶 Bone children count after attach:`, targetBone.children.length)
        console.log(`  🌳 Item parent:`, itemToAttach.parent?.name || 'none')
      })
      
      console.log(`\n🎉 Attachment complete! Total items attached: ${bonesToUse.length}`)
      
      // Count total visible attached items in the scene
      let totalAttachedItems = 0
      character.traverse((child) => {
        if (child.userData.isAttachedItem) {
          totalAttachedItems++
        }
      })
      console.log(`📊 Total attached items in character scene: ${totalAttachedItems}`)
      
      attachedRef.current = true // Mark as attached
      
      // Cleanup function to remove attached items only when component unmounts
      return () => {
        console.log('🧹 Cleaning up attached items on unmount')
        attachedItemsRef.current.forEach(item => {
          if (item.parent) {
            item.parent.remove(item)
          }
        })
        attachedItemsRef.current = []
        attachedRef.current = false // Reset on unmount
      }
    } else {
      console.warn(`⚠️ Could not find bone for ${bodyPartType}. Tried:`, boneNames)
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array - only run once on mount
  
  // Update scale and position when they change
  useEffect(() => {
    if (!characterRef.current) return
    
    // Update scale and position of all attached items
    attachedItemsRef.current.forEach(item => {
      item.scale.setScalar(scale)
      item.position.set(positionX, positionY, positionZ)
    })
  }, [scale, positionX, positionY, positionZ])
  
  // Update animation
  useFrame((_state, delta) => {
    if (mixer) {
      mixer.update(delta)
    }
    
    // Debug: Log visible shoe count every 60 frames (about once per second)
    if (characterRef.current && Math.random() < 0.016) { // ~1/60 chance
      let shoeCount = 0
      characterRef.current.traverse((child) => {
        if (child.userData.isAttachedItem && child.visible) {
          shoeCount++
        }
      })
      if (shoeCount > 0) {
        console.log(`👟 Currently visible attached items: ${shoeCount}`)
      }
    }
  })
  
  return (
    <>
      <primitive ref={characterRef} object={characterScene} />
      <primitive ref={itemRef} object={itemScene} visible={false} />
      {itemScene2 && <primitive ref={itemRef2} object={itemScene2} visible={false} />}
    </>
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

export function CharacterViewer({ job, onClose }: CharacterViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [proxiedItemUrl, setProxiedItemUrl] = useState<string>('')
  const [proxiedItemUrl2, setProxiedItemUrl2] = useState<string>('')
  const [scale, setScale] = useState<number>(SCALE_FACTORS[job.bodyPartType || 'chest'] || 1.0)
  const [positionX, setPositionX] = useState<number>(0)
  const [positionY, setPositionY] = useState<number>(job.bodyPartType?.includes('leg') ? -0.1 : 0)
  const [positionZ, setPositionZ] = useState<number>(job.bodyPartType?.includes('leg') ? 0.05 : 0)
  const [availableAnimations, setAvailableAnimations] = useState<string[]>([])
  const [selectedAnimation, setSelectedAnimation] = useState<string>('idle')
  const [isSaving, setIsSaving] = useState(false)
  const [savedModelId, setSavedModelId] = useState<string | null>(null)
  const [savedModelData, setSavedModelData] = useState<any>(null)
  const [isCheckingSaved, setIsCheckingSaved] = useState(true)
  
  // Character model path
  const characterModelUrl = '/Xbot.glb'
  
  // Use saved model URLs if available, otherwise use job result URLs
  const itemUrl = savedModelData?.leftLegFile 
    ? `http://localhost:3000/api/admin/3d-models/files/${savedModelData.leftLegFile}` 
    : (job.result?.fileUrl || '')
  const itemUrl2 = savedModelData?.rightLegFile 
    ? `http://localhost:3000/api/admin/3d-models/files/${savedModelData.rightLegFile}` 
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
          
          // Load saved adjustments
          if (result.model.scale) setScale(parseFloat(result.model.scale))
          if (result.model.positionX) setPositionX(parseFloat(result.model.positionX))
          if (result.model.positionY) setPositionY(parseFloat(result.model.positionY))
          if (result.model.positionZ) setPositionZ(parseFloat(result.model.positionZ))
          
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
        if (itemUrl && isMounted) {
          // Check if URL is from local server or external
          const isLocalUrl = itemUrl.startsWith('http://localhost') || itemUrl.startsWith('/api/')
          
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
          // Check if URL is from local server or external
          const isLocalUrl = itemUrl2.startsWith('http://localhost') || itemUrl2.startsWith('/api/')
          
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
    
    // Cleanup
    return () => {
      isMounted = false
      if (proxiedItemUrl) URL.revokeObjectURL(proxiedItemUrl)
      if (proxiedItemUrl2) URL.revokeObjectURL(proxiedItemUrl2)
    }
  }, [itemUrl, itemUrl2]) // Depend on both URLs
  
  const handleSaveModel = async () => {
    setIsSaving(true)
    try {
      // Generate automatic name based on body part and color
      const colorName = job.colorVariants[0]?.colorName || job.colorVariants[0]?.colorHex || 'default'
      const bodyPart = job.bodyPartType?.replace(/-/g, ' ') || 'item'
      const autoName = `${colorName} ${bodyPart} - ${new Date().toLocaleString()}`
      
      const result = await orpc.save3DModel({
        id: savedModelId || undefined, // Pass ID if updating
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

      // Update saved model ID and data
      if (result.id) {
        setSavedModelId(result.id)
        // Reload the saved model data to get file paths
        const checkResult = await orpc.checkModelSaved({
          prompt: job.prompt,
          bodyPartType: job.bodyPartType || 'chest'
        })
        if (checkResult.model) {
          setSavedModelData(checkResult.model)
        }
      }

      toast.success(savedModelId ? 'Model updated successfully!' : 'Model saved successfully!')
      
      // Dispatch event to reload saved models
      window.dispatchEvent(new CustomEvent('model-saved'))
    } catch (error) {
      console.error('Failed to save model:', error)
      toast.error('Failed to save model')
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleLoadError = (error: any) => {
    console.error('❌ Failed to load character/item:', error)
    const errorMsg = error?.message || 'Failed to load 3D models'
    
    // Check if it's a CORS error
    if (errorMsg.includes('CORS') || errorMsg.includes('fetch') || errorMsg.includes('Failed to load')) {
      setLoadError('Cannot load 3D model due to CORS restrictions.')
    } else {
      setLoadError(errorMsg)
    }
    setIsLoading(false)
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
                  
                  {/* Ground plane */}
                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                    <planeGeometry args={[20, 20]} />
                    <meshStandardMaterial color="#2a2a2a" />
                  </mesh>
                </Suspense>
              </Canvas>
            </ErrorBoundary>
          )}
          
          {/* Error message */}
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
      <div className="w-80 border-l bg-background overflow-y-auto">
        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-4">Adjustments</h3>
            
            {/* Animation Control */}
            {availableAnimations.length > 0 && (
              <div className="space-y-2 mb-6">
                <Label className="text-xs">Animation</Label>
                <select
                  value={selectedAnimation}
                  onChange={(e) => setSelectedAnimation(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded bg-background"
                >
                  {availableAnimations.map((anim) => (
                    <option key={anim} value={anim}>
                      {anim}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Scale Control */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <Label className="text-xs">Scale</Label>
                <span className="text-xs text-muted-foreground font-mono">{scale.toFixed(1)}</span>
              </div>
              <Slider
                value={[scale]}
                onValueChange={([value]) => setScale(value)}
                min={0.1}
                max={50}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Position X Control */}
            <div className="space-y-2 mb-6">
              <Label className="text-xs">Position X (Left/Right)</Label>
              <input
                type="number"
                value={positionX.toFixed(2)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value)
                  if (!isNaN(val)) {
                    setPositionX(val)
                  }
                }}
                className="w-full px-3 py-2 text-sm border rounded bg-background"
                step="0.01"
              />
            </div>

            {/* Position Y Control */}
            <div className="space-y-2 mb-6">
              <Label className="text-xs">Position Y (Up/Down)</Label>
              <input
                type="number"
                value={positionY.toFixed(2)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value)
                  if (!isNaN(val)) {
                    setPositionY(val)
                  }
                }}
                className="w-full px-3 py-2 text-sm border rounded bg-background"
                step="0.01"
              />
            </div>

            {/* Position Z Control */}
            <div className="space-y-2 mb-6">
              <Label className="text-xs">Position Z (Forward/Back)</Label>
              <input
                type="number"
                value={positionZ.toFixed(2)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value)
                  if (!isNaN(val)) {
                    setPositionZ(val)
                  }
                }}
                className="w-full px-3 py-2 text-sm border rounded bg-background"
                step="0.01"
              />
            </div>

            {/* Reset Button */}
            <Button 
              size="sm" 
              variant="outline"
              className="w-full"
              onClick={() => {
                setScale(SCALE_FACTORS[job.bodyPartType || 'chest'] || 1.0)
                setPositionX(0)
                setPositionY(job.bodyPartType?.includes('leg') ? -0.1 : 0)
                setPositionZ(job.bodyPartType?.includes('leg') ? 0.05 : 0)
              }}
            >
              Reset All to Default
            </Button>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t space-y-2">
            <Button 
              onClick={handleSaveModel} 
              className="w-full" 
              size="sm"
              disabled={isSaving || isCheckingSaved}
            >
              {isSaving ? 'Saving...' : isCheckingSaved ? 'Checking...' : savedModelId ? 'Update Model' : 'Save Model'}
            </Button>
            
            <Button onClick={onClose} variant="outline" className="w-full" size="sm">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
