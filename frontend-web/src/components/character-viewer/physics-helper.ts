import * as THREE from 'three'

export class PhysicsHelper {
  private ammo: any = null
  private world: any = null
  private softBodies: any[] = []
  private tmpTransform: any = null
  private softBodyHelpers: any = null
  
  async initialize(ammoInstance: any) {
    this.ammo = ammoInstance
    
    // Create collision configuration with soft body support
    const collisionConfiguration = new this.ammo.btSoftBodyRigidBodyCollisionConfiguration()
    const dispatcher = new this.ammo.btCollisionDispatcher(collisionConfiguration)
    const broadphase = new this.ammo.btDbvtBroadphase()
    const solver = new this.ammo.btSequentialImpulseConstraintSolver()
    
    // Create soft body world
    this.world = new this.ammo.btSoftRigidDynamicsWorld(
      dispatcher,
      broadphase,
      solver,
      collisionConfiguration
    )
    
    // Set gravity
    this.world.setGravity(new this.ammo.btVector3(0, -9.81, 0))
    
    // Get world info for soft bodies
    const worldInfo = this.world.getWorldInfo()
    worldInfo.set_m_gravity(new this.ammo.btVector3(0, -9.81, 0))
    
    // Create soft body helpers
    this.softBodyHelpers = new this.ammo.btSoftBodyHelpers()
    
    // Create temp transform for updates
    this.tmpTransform = new this.ammo.btTransform()
    
    console.log('✅ Soft body physics world initialized')
  }
  
  addClothPhysics(mesh: THREE.Mesh) {
    if (!this.ammo || !this.world || !this.softBodyHelpers) {
      console.warn('Physics not initialized')
      return null
    }
    
    // Get geometry
    const geometry = mesh.geometry
    if (!geometry.attributes.position) {
      console.warn('Mesh has no position attribute')
      return null
    }
    
    const positions = geometry.attributes.position.array
    const indices = geometry.index ? geometry.index.array : null
    
    // Create soft body from mesh
    const vertexCount = positions.length / 3
    
    // Get mesh bounds
    geometry.computeBoundingBox()
    const bbox = geometry.boundingBox!
    const width = bbox.max.x - bbox.min.x
    const height = bbox.max.y - bbox.min.y
    
    // Create cloth patch (simplified grid)
    const segmentsX = Math.min(20, Math.floor(width * 10))
    const segmentsY = Math.min(20, Math.floor(height * 10))
    
    // Create soft body cloth
    const clothCorner00 = new this.ammo.btVector3(bbox.min.x, bbox.max.y, bbox.min.z)
    const clothCorner01 = new this.ammo.btVector3(bbox.min.x, bbox.max.y, bbox.max.z)
    const clothCorner10 = new this.ammo.btVector3(bbox.max.x, bbox.max.y, bbox.min.z)
    const clothCorner11 = new this.ammo.btVector3(bbox.max.x, bbox.max.y, bbox.max.z)
    
    const softBody = this.softBodyHelpers.CreatePatch(
      this.world.getWorldInfo(),
      clothCorner00,
      clothCorner01,
      clothCorner10,
      clothCorner11,
      segmentsX,
      segmentsY,
      0, // fixed corners (0 = none, 1 = corner00, 2 = corner01, etc.)
      true // generate diagonal links
    )
    
    // Configure soft body material
    const sbConfig = softBody.get_m_cfg()
    sbConfig.set_viterations(10) // Velocity solver iterations
    sbConfig.set_piterations(10) // Position solver iterations
    sbConfig.set_kDF(0.2) // Dynamic friction coefficient
    sbConfig.set_kDP(0.01) // Damping coefficient
    sbConfig.set_kPR(0.0) // Pressure coefficient
    
    // Set material properties
    const material = softBody.get_m_materials().at(0)
    material.set_m_kLST(0.9) // Linear stiffness (0-1, higher = stiffer)
    material.set_m_kAST(0.9) // Angular stiffness
    
    // Enable soft body features
    softBody.setTotalMass(0.5, false) // Total mass, fromfaces
    softBody.generateBendingConstraints(2) // Distance for bending constraints
    
    // Add collision margin
    softBody.getCollisionShape().setMargin(0.05)
    
    // Add to world
    this.world.addSoftBody(softBody, 1, -1)
    
    // Store reference with original mesh
    this.softBodies.push({ 
      mesh, 
      softBody,
      geometry: geometry.clone() // Clone geometry for updates
    })
    
    console.log('✅ Added soft body cloth physics to mesh')
    console.log(`   Segments: ${segmentsX}x${segmentsY}, Nodes: ${softBody.get_m_nodes().size()}`)
    
    return softBody
  }
  
  update(deltaTime: number) {
    if (!this.world || !this.ammo) return
    
    // Step physics simulation
    this.world.stepSimulation(deltaTime, 10)
    
    // Update mesh vertices from soft body nodes
    for (const { mesh, softBody, geometry } of this.softBodies) {
      const nodes = softBody.get_m_nodes()
      const nodeCount = nodes.size()
      
      // Update geometry positions from soft body nodes
      const positions = geometry.attributes.position.array
      
      for (let i = 0; i < Math.min(nodeCount, positions.length / 3); i++) {
        const node = nodes.at(i)
        const pos = node.get_m_x()
        
        positions[i * 3] = pos.x()
        positions[i * 3 + 1] = pos.y()
        positions[i * 3 + 2] = pos.z()
      }
      
      // Update mesh geometry
      mesh.geometry.attributes.position.needsUpdate = true
      mesh.geometry.computeVertexNormals()
    }
  }
  
  cleanup() {
    if (!this.world || !this.ammo) return
    
    // Remove all soft bodies
    for (const { softBody } of this.softBodies) {
      this.world.removeSoftBody(softBody)
      this.ammo.destroy(softBody)
    }
    
    this.softBodies = []
    
    console.log('🧹 Soft body physics cleaned up')
  }
  
  applyWind(windForce: THREE.Vector3) {
    // Apply wind force to all cloth soft bodies
    for (const { softBody } of this.softBodies) {
      if (this.ammo) {
        const ammoForce = new this.ammo.btVector3(windForce.x, windForce.y, windForce.z)
        softBody.addForce(ammoForce)
      }
    }
  }
  
  setClothStiffness(stiffness: number) {
    // Update stiffness for all cloth bodies (0-1)
    for (const { softBody } of this.softBodies) {
      const material = softBody.get_m_materials().at(0)
      material.set_m_kLST(stiffness)
      material.set_m_kAST(stiffness)
    }
  }
}
