import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, useAnimations } from '@react-three/drei'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { IconRefresh } from '@tabler/icons-react'
import * as THREE from 'three'
import { ErrorBoundary } from 'react-error-boundary'
import { URL as AppURL } from '@/config'

interface CollectionPreviewProps {
  selectedModelIds: string[]
  models: any[]
}

function XbotWithModels({ xbotUrl, productModels, selectedAnimation }: { xbotUrl: string, productModels: Array<{ url: string, bodyPartType: string, scale: number, positionX: number, positionY: number, positionZ: number }>, selectedAnimation: string }) {
  const xbotRef = useRef<THREE.Group>(null)
  const { scene: xbotScene, animations } = useGLTF(xbotUrl)
  const { actions } = useAnimations(animations, xbotRef)
  const [skeleton, setSkeleton] = useState<THREE.Skeleton | null>(null)
  
  // Load product models
  const productScenes = productModels.map(model => {
    try {
      const { scene } = useGLTF(model.url)
      return { scene, ...model }
    } catch (err) {
      console.error('Failed to load model:', model.url, err)
      return null
    }
  }).filter(Boolean)
  
  console.log('🎨 Product models loaded:', productScenes.map(m => m ? {
    bodyPartType: m.bodyPartType,
    scale: m.scale,
    positionX: m.positionX,
    positionY: m.positionY,
    positionZ: m.positionZ
  } : null))

  // Find skeleton and hide Xbot meshes
  useEffect(() => {
    if (!xbotScene) return

    const skinnedMesh = xbotScene.getObjectByProperty('type', 'SkinnedMesh') as THREE.SkinnedMesh
    if (skinnedMesh && skinnedMesh.skeleton) {
      setSkeleton(skinnedMesh.skeleton)
    }
    
    // Hide all Xbot meshes (but keep the skeleton for bone attachment)
    xbotScene.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
        child.visible = false
      }
    })
    
    console.log('✅ Xbot skeleton loaded, character meshes hidden')
  }, [xbotScene])

  // Attach product models to bones
  useEffect(() => {
    if (!skeleton) return

    const boneMapping: Record<string, string> = {
      'top-head': 'mixamorigHead',
      'middle-head': 'mixamorigHead',
      'lower-head': 'mixamorigHead',
      'chest': 'mixamorigSpine2',
      'left-hand': 'mixamorigLeftHand',
      'right-hand': 'mixamorigRightHand',
      'left-leg': 'mixamorigLeftLeg',
      'right-leg': 'mixamorigRightLeg',
      'both-legs': 'mixamorigHips'
    }

    console.log('🔧 Attaching models to skeleton...')
    console.log('🔧 Product scenes to attach:', productScenes.length)

    // Clear previous attachments
    skeleton.bones.forEach(bone => {
      const childrenToRemove = bone.children.filter(child => child.userData.isProductModel)
      childrenToRemove.forEach(child => {
        console.log('🧹 Removing old attachment from bone:', bone.name)
        bone.remove(child)
      })
    })

    // Attach new models
    productScenes.forEach((model, _) => {
      if (!model) return
      
      const boneName = boneMapping[model.bodyPartType]
      const bone = skeleton.bones.find(b => b.name === boneName)
      
      if (!bone) {
        console.warn(`❌ Bone not found for ${model.bodyPartType}:`, boneName)
        return
      }

      const clonedScene = model.scene.clone()
      
      // Apply scale (divide by 10 to match character viewer scale system)
      const actualScale = model.scale / 10
      clonedScene.scale.set(actualScale, actualScale, actualScale)
      
      // Apply position - use saved positions directly
      // The saved positions already include any offsets that were set when saving
      // Add offset to Y-axis: if negative, subtract 10 more; if positive, add 20
      const adjustedY = model.positionY < 0 
        ? model.positionY - 10  // Make more negative (move down)
        : model.positionY + 20  // Make more positive (move up)
      
      console.log(`🎯 Applying position for ${model.bodyPartType}:`, {
        x: model.positionX,
        y: adjustedY,
        z: model.positionZ,
        scale: actualScale,
        originalY: model.positionY,
        offset: model.positionY < 0 ? -10 : +20
      })
      
      clonedScene.position.set(
        model.positionX, 
        adjustedY, 
        model.positionZ
      )
      clonedScene.userData.isProductModel = true
      
      // Get bone world position for debugging
      const boneWorldPos = new THREE.Vector3()
      bone.getWorldPosition(boneWorldPos)
      bone.add(clonedScene)
      
      console.log(`✅ Attached ${model.bodyPartType} to bone ${boneName}`)
      
      // Verify attachment
      console.log(`   ✅ Attached! Bone has ${bone.children.length} children`)
    })
    
    console.log('✅ All models attached to skeleton')
  }, [skeleton, productScenes])

  // Play selected animation
  useEffect(() => {
    if (!actions || !selectedAnimation) return

    // Stop all animations
    Object.values(actions).forEach(action => action?.stop())

    // Play selected animation
    if (selectedAnimation !== 'none' && actions[selectedAnimation]) {
      const action = actions[selectedAnimation]
      action.reset().fadeIn(0.5).play()
    }
  }, [selectedAnimation, actions])

  return (
    <group ref={xbotRef}>
      <primitive object={xbotScene} scale={1} />
    </group>
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

export function CollectionPreview({ selectedModelIds, models }: CollectionPreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedAnimation, setSelectedAnimation] = useState<string>('none')

  const xbotUrl = `${AppURL.BASE}/api/admin/3d-models/files/Xbot.glb` // Load from backend API
  
  // Clear GLB cache when component mounts to ensure fresh data
  useEffect(() => {
    console.log('🧹 Clearing GLB cache for fresh preview...')
    
    // Clear cache for all selected models
    models
      .filter(m => selectedModelIds.includes(m.id))
      .forEach(m => {
        const url = `${AppURL.BASE}/api/admin/3d-models/files/${m.leftLegFile}`
        try {
          useGLTF.preload(url) // Force reload
          console.log('🔄 Reloading model:', m.bodyPartType)
        } catch (err) {
          console.warn('Failed to reload model:', url)
        }
      })
  }, [selectedModelIds, models])
  
  // Get selected models with their data
  const selectedModels = models
    .filter(m => selectedModelIds.includes(m.id))
    .map(m => {
      // Ensure all position values are properly parsed as numbers
      const scale = typeof m.scale === 'string' ? parseFloat(m.scale) : (m.scale || 1)
      const positionX = typeof m.positionX === 'string' ? parseFloat(m.positionX) : (m.positionX || 0)
      const positionY = typeof m.positionY === 'string' ? parseFloat(m.positionY) : (m.positionY || 0)
      const positionZ = typeof m.positionZ === 'string' ? parseFloat(m.positionZ) : (m.positionZ || 0)
      
      const model = {
        url: `${AppURL.BASE}/api/admin/3d-models/files/${m.leftLegFile}`,
        bodyPartType: m.bodyPartType,
        scale,
        positionX,
        positionY,
        positionZ
      }
      
      console.log('📋 Loading model from database:', {
        id: m.id,
        name: m.name,
        bodyPartType: model.bodyPartType,
        scale: model.scale,
        positionX: model.positionX,
        positionY: model.positionY,
        positionZ: model.positionZ,
        rawValues: {
          scale: m.scale,
          positionX: m.positionX,
          positionY: m.positionY,
          positionZ: m.positionZ
        }
      })
      
      return model
    })

  const handleLoadError = (error: any) => {
    console.error('Failed to load collection preview:', error)
    setLoadError(error?.message || 'Failed to load preview')
    setIsLoading(false)
  }

  // Available animations
  const animations = [
    { value: 'none', label: 'No Animation' },
    { value: 'idle', label: 'Idle' },
    { value: 'walk', label: 'Walk' },
    { value: 'run', label: 'Run' },
    { value: 'jump', label: 'Jump' },
    { value: 'wave', label: 'Wave' },
    { value: 'dance', label: 'Dance' }
  ]

  if (selectedModelIds.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Collection Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[500px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p className="text-sm">Select 3D models to preview</p>
              <p className="text-xs mt-1">Models will appear on Xbot</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Collection Preview ({selectedModelIds.length} models)</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Force re-render by clearing and reloading
              setSelectedAnimation('none')
              setTimeout(() => setSelectedAnimation('idle'), 100)
            }}
            className="h-7 text-xs"
          >
            <IconRefresh className="w-3 h-3 mr-1" />
            Refresh
          </Button>
        </div>
        
        {/* Animation Selector */}
        <div className="flex items-center gap-2">
          <Label className="text-xs whitespace-nowrap">Motion:</Label>
          <Select value={selectedAnimation} onValueChange={setSelectedAnimation}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select animation" />
            </SelectTrigger>
            <SelectContent>
              {animations.map((anim) => (
                <SelectItem key={anim.value} value={anim.value} className="text-xs">
                  {anim.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full h-[500px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden relative">
          {isLoading && !loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-900/80">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-3 text-white text-xs">...</p>
            </div>
          )}
          
          {!loadError && (
            <ErrorBoundary
              fallback={<div className="flex items-center justify-center h-full text-red-400 text-sm">Preview error</div>}
              onError={handleLoadError}
            >
              <Canvas
                key={selectedModelIds.join('-')} // Force remount when selection changes
                camera={{ position: [0, 1, 3], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
                onCreated={() => setIsLoading(false)}
                onError={handleLoadError}
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <ambientLight intensity={1.2} />
                  <directionalLight position={[5, 5, 5]} intensity={1.0} castShadow />
                  <XbotWithModels xbotUrl={xbotUrl} productModels={selectedModels} selectedAnimation={selectedAnimation} />
                  <Environment preset="studio" />
                  
                  {/* Ground plane */}
                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                    <planeGeometry args={[20, 20]} />
                    <meshStandardMaterial color="#2a2a2a" />
                  </mesh>
                  
                  <OrbitControls 
                    enablePan={false}
                    enableZoom={true}
                    enableRotate={true}
                    autoRotate={false}
                    maxPolarAngle={Math.PI / 2 - 0.1}
                    target={[0, 0.8, 0]}
                  />
                </Suspense>
              </Canvas>
            </ErrorBoundary>
          )}
          
          {loadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/95 z-20">
              <div className="text-center p-6">
                <div className="mb-3 text-red-400 text-3xl">⚠️</div>
                <p className="text-xs text-gray-300">{loadError}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
