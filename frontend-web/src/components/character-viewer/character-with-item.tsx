import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { type GenerationJob } from '@/config/3d-agent.config'
import { ATTACHMENT_BONES, getDefaultOffsets } from './constants'
import { Ammo, type AmmoInstance } from '@fred3d/ammo'
import { PhysicsHelper } from './physics-helper'

interface CharacterWithItemProps {
  characterUrl: string
  itemUrl: string
  itemUrl2?: string
  bodyPartType: GenerationJob['bodyPartType']
  scale: number
  positionX: number
  positionY: number
  positionZ: number
  selectedAnimation: string
  showXbot: boolean
  onAnimationsLoaded: (animations: string[]) => void
}

export function CharacterWithItem({
  characterUrl,
  itemUrl,
  itemUrl2,
  bodyPartType,
  scale,
  positionX,
  positionY,
  positionZ,
  selectedAnimation,
  showXbot,
  onAnimationsLoaded
}: CharacterWithItemProps) {
  const characterRef = useRef<THREE.Group>(null)
  const itemRef = useRef<THREE.Group>(null)
  const itemRef2 = useRef<THREE.Group>(null)
  const attachedRef = useRef(false)
  const attachedItemsRef = useRef<THREE.Object3D[]>([])
  const physicsHelperRef = useRef<PhysicsHelper | null>(null)
  const [physicsReady, setPhysicsReady] = useState(false)
  
  const { scene: characterScene, animations } = useGLTF(characterUrl)
  const { actions, mixer } = useAnimations(animations, characterRef)
  const { scene: itemScene } = useGLTF(itemUrl)
  const itemScene2 = itemUrl2 ? useGLTF(itemUrl2).scene : null
  
  // Initialize physics
  useEffect(() => {
    const initPhysics = async () => {
      try {
        console.log('🔄 Initializing Ammo.js physics...')
        const ammo: AmmoInstance = await Ammo()
        const helper = new PhysicsHelper()
        await helper.initialize(ammo)
        physicsHelperRef.current = helper
        setPhysicsReady(true)
        console.log('✅ Physics initialized for character viewer')
      } catch (error) {
        console.error('❌ Failed to initialize physics:', error)
      }
    }
    
    initPhysics()
    
    return () => {
      if (physicsHelperRef.current) {
        physicsHelperRef.current.cleanup()
      }
    }
  }, [])
  
  // Handle animations
  useEffect(() => {
    if (actions) {
      const animationNames = Object.keys(actions)
      console.log('🎬 Available animations:', animationNames)
      
      onAnimationsLoaded(animationNames)
      Object.values(actions).forEach(action => action?.stop())
      
      const action = actions[selectedAnimation]
      
      if (action) {
        console.log(`✅ Playing animation: ${selectedAnimation}`)
        action.reset()
        action.play()
      } else {
        console.warn(`⚠️ Animation "${selectedAnimation}" not found, trying fallback...`)
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
      return
    }
    
    const character = characterRef.current
    const item = itemRef.current
    
    console.log('🔍 Attempting to attach clothing to bone:', bodyPartType)
    
    const boneNames = ATTACHMENT_BONES[bodyPartType] || ATTACHMENT_BONES['chest']
    let targetBone: THREE.Bone | null = null
    
    character.traverse((child) => {
      if (!targetBone && child instanceof THREE.Bone && boneNames.includes(child.name)) {
        targetBone = child
        console.log('✅ Found target bone:', child.name)
        return
      }
    })
    
    if (!targetBone) {
      console.error('❌ No bone found for body part type:', bodyPartType)
      console.log('Looking for bones:', boneNames)
      
      const allBones: string[] = []
      character.traverse((child) => {
        if (child instanceof THREE.Bone) {
          allBones.push(child.name)
        }
      })
      console.log('Available bones in character:', allBones)
      return
    }
    
    // Type assertion after null check - targetBone is guaranteed to be THREE.Bone here
    const bone: THREE.Bone = targetBone
    
    const itemToAttach = item.clone()
    itemToAttach.userData.isAttachedItem = true
    
    const actualScale = scale / 10
    const { defaultOffsetX, defaultOffsetY, defaultOffsetZ } = getDefaultOffsets(bodyPartType)
    
    // Apply Y-axis offset: if negative, subtract 10 more; if positive, add 20
    const adjustedY = positionY < 0 
      ? positionY - 10  // Make more negative (move down)
      : positionY + 20  // Make more positive (move up)
    
    itemToAttach.scale.setScalar(actualScale)
    itemToAttach.position.set(
      positionX + defaultOffsetX, 
      adjustedY + defaultOffsetY, 
      positionZ + defaultOffsetZ
    )
    itemToAttach.visible = true
    
    console.log('📐 Applying scale:', actualScale, 'from slider value:', scale)
    console.log('📍 Applying position:', {
      x: positionX + defaultOffsetX,
      y: adjustedY + defaultOffsetY,
      z: positionZ + defaultOffsetZ,
      originalY: positionY,
      offset: positionY < 0 ? -10 : +20
    })
    
    let meshCount = 0
    itemToAttach.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshCount++
        child.visible = true
        child.frustumCulled = false
        child.castShadow = true
        child.receiveShadow = true
        
        console.log(`  Mesh ${meshCount}:`, child.name, 'geometry vertices:', child.geometry.attributes.position?.count)
        
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat, idx) => {
              mat.transparent = false
              mat.opacity = 1
              mat.visible = true
              mat.side = THREE.DoubleSide
              mat.needsUpdate = true
              console.log(`    Material ${idx}:`, mat.type, 'color:', (mat as any).color)
            })
          } else {
            child.material.transparent = false
            child.material.opacity = 1
            child.material.visible = true
            child.material.side = THREE.DoubleSide
            child.material.needsUpdate = true
            console.log(`    Material:`, child.material.type, 'color:', (child.material as any).color)
          }
        }
      }
    })
    
    console.log(`✅ Found ${meshCount} mesh es in clothing item`)
    
    const bbox = new THREE.Box3().setFromObject(itemToAttach)
    const size = new THREE.Vector3()
    bbox.getSize(size)
    console.log('📏 Item bounding box size:', size.x, size.y, size.z)
    console.log('📏 Item bounding box center:', bbox.getCenter(new THREE.Vector3()))
    
    bone.add(itemToAttach)
    attachedItemsRef.current.push(itemToAttach)
    
    // Add soft body cloth physics if ready
    if (physicsReady && physicsHelperRef.current) {
      console.log('🧵 Adding soft body cloth physics...')
      itemToAttach.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          try {
            physicsHelperRef.current?.addClothPhysics(child)
            console.log('✅ Added soft body cloth physics to mesh:', child.name)
          } catch (error) {
            console.error('❌ Failed to add cloth physics:', error)
          }
        }
      })
    }
    
    const worldPos = new THREE.Vector3()
    itemToAttach.getWorldPosition(worldPos)
    
    attachedRef.current = true
    
    return () => {
      console.log('🧹 Cleaning up attached items on unmount')
      attachedItemsRef.current.forEach(item => {
        if (item.parent) {
          item.parent.remove(item)
        }
      })
      attachedItemsRef.current = []
      attachedRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Update Xbot visibility
  useEffect(() => {
    if (!characterRef.current) return
    
    characterRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
        let isPartOfAttachedItem = false
        let parent = child.parent
        while (parent) {
          if (parent.userData.isAttachedItem) {
            isPartOfAttachedItem = true
            break
          }
          parent = parent.parent
        }
        
        if (!isPartOfAttachedItem) {
          child.visible = showXbot
        }
      }
    })
  }, [showXbot])
  
  // Update scale and position
  useEffect(() => {
    if (!characterRef.current) return
    
    const actualScale = scale / 10
    const { defaultOffsetX, defaultOffsetY, defaultOffsetZ } = getDefaultOffsets(bodyPartType || 'chest')
    
    console.log('🔄 Updating attached items - Body Part:', bodyPartType, 'Scale:', actualScale, 'Position:', positionX + defaultOffsetX, positionY + defaultOffsetY, positionZ + defaultOffsetZ)
    console.log('🔄 Number of attached items:', attachedItemsRef.current.length)
    
    attachedItemsRef.current.forEach((item, index) => {
      item.scale.setScalar(actualScale)
      item.position.set(positionX + defaultOffsetX, positionY + defaultOffsetY, positionZ + defaultOffsetZ)
      console.log(`  Item ${index + 1} updated - Scale:`, item.scale.x, 'Position:', item.position.x, item.position.y, item.position.z)
    })
  }, [scale, positionX, positionY, positionZ, bodyPartType])
  
  // Animation loop
  useFrame((_state, delta) => {
    if (mixer) {
      mixer.update(delta)
    }
    
    // Update physics simulation
    if (physicsHelperRef.current && physicsReady) {
      physicsHelperRef.current.update(delta)
      
      // Apply gentle wind force occasionally for realistic cloth movement
      if (Math.random() < 0.02) {
        const windForce = new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          0,
          (Math.random() - 0.5) * 0.3
        )
        physicsHelperRef.current.applyWind(windForce)
      }
    }
    
    if (characterRef.current && Math.random() < 0.016) {
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
