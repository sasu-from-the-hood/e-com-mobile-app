import { useState, useEffect, useRef, useMemo } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { X, User, ChevronLeft } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { authConfig } from '@/config/auth.config';
import { orpc } from '@/lib/orpc-client';

const { height: screenHeight } = Dimensions.get('window');

interface ModelData {
  id: string;
  bodyPartType: string;
  leftLegFile: string | null;
  rightLegFile: string | null;
  scale: number;
  positionX: number;
  positionY: number;
  positionZ: number;
  leftLegUrl: string | null;
  rightLegUrl: string | null;
}

interface ARTryOnModalProps {
  visible: boolean;
  onClose: () => void;
  productModelIds: string[];
}

// Loading dots animation component
function DotsLoading() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(dot1, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(dot1, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(dot2, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(dot3, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
      ]).start(() => animate());
    };
    animate();
  }, []);

  return (
    <View style={styles.dotsContainer}>
      <Animated.View style={[styles.dot, { opacity: dot1 }]} />
      <Animated.View style={[styles.dot, { opacity: dot2 }]} />
      <Animated.View style={[styles.dot, { opacity: dot3 }]} />
    </View>
  );
}

export function ARTryOnModal({ visible, onClose, productModelIds }: ARTryOnModalProps) {
  const [slideAnim] = useState(new Animated.Value(screenHeight));
  const [modelsData, setModelsData] = useState<ModelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMotions, setShowMotions] = useState(false);
  const [showPlaces, setShowPlaces] = useState(false);
  const [showBodyColors, setShowBodyColors] = useState(false);
  const [availableMotions, setAvailableMotions] = useState<string[]>([]);
  const [selectedMotion, setSelectedMotion] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<string>('light');
  const [selectedBodyColor, setSelectedBodyColor] = useState<string>('default');
  const webViewRef = useRef<WebView>(null);

  const handleZoomIn = () => {
    webViewRef.current?.injectJavaScript('zoomIn();');
  };

  const handleZoomOut = () => {
    webViewRef.current?.injectJavaScript('zoomOut();');
  };

  const handleResetView = () => {
    webViewRef.current?.injectJavaScript('resetView();');
  };

  const handleResetPressIn = () => {
    webViewRef.current?.injectJavaScript('startAutoRotate();');
  };

  const handleResetPressOut = () => {
    webViewRef.current?.injectJavaScript('stopAutoRotate();');
  };

  const handleSelectMotion = (motion: string) => {
    setSelectedMotion(motion);
    webViewRef.current?.injectJavaScript(`playAnimation('${motion}');`);
    setShowMotions(false);
  };

  const handleSelectPlace = (place: string) => {
    setSelectedPlace(place);
    webViewRef.current?.injectJavaScript(`changePlace('${place}');`);
    setShowPlaces(false);
  };

  const handleSelectBodyColor = (color: string) => {
    setSelectedBodyColor(color);
    webViewRef.current?.injectJavaScript(`changeBodyColor('${color}');`);
    setShowBodyColors(false);
  };

  // Format animation name: remove underscores and capitalize
  const formatMotionName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Fetch 3D models data
  useEffect(() => {
    if (visible && productModelIds.length > 0) {
      fetchModelsData();
    } else if (visible) {
      setLoading(false);
    }
  }, [visible, productModelIds]);

  const fetchModelsData = async () => {
    try {
      setLoading(true);
      
      const promises = productModelIds.map(id =>
        orpc.get3DModel(id)
      );
      const results = await Promise.all(promises);
      console.log('[ARTryOn] Models data fetched:', results);
      setModelsData(results);
      setLoading(false);
    } catch (error) {
      console.error('[ARTryOn] Failed to fetch models data:', error);
      console.error('[ARTryOn] Error details:', JSON.stringify(error, null, 2));
      setLoading(false);
    }
  };

  // Animate modal in/out
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  // Generate HTML content with Three.js
  const htmlContent = useMemo(() => {
    const timestamp = Date.now();
    console.log('[ARTryOn] Generating HTML with models:', modelsData.length);
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <title>AR Try-On - ${timestamp}</title>
  <style>
    body { 
      margin: 0; 
      overflow: hidden; 
      background-color: #f5f5f5;
      touch-action: none;
    }
    #canvas { 
      width: 100vw; 
      height: 100vh; 
      display: block;
    }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
  <script>
    // Override console.log to send to React Native
    const originalLog = console.log;
    const originalError = console.error;
    console.log = function(...args) {
      originalLog.apply(console, args);
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage('LOG: ' + args.join(' '));
      }
    };
    console.error = function(...args) {
      originalError.apply(console, args);
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage('ERROR: ' + args.join(' '));
      }
    };
    
    console.log('WebView script started');
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    scene.fog = new THREE.Fog(0xf5f5f5, 10, 50);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 4);
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas: document.getElementById('canvas'),
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Orbit controls for pan and zoom
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 8;
    controls.maxPolarAngle = Math.PI / 2 - 0.1; // Prevent camera from going below floor (90 degrees - small offset)
    controls.update();
    
    // Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 1.2); // Increased from 0.8 to 1.2
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0); // Increased from 0.6 to 1.0
    dirLight.position.set(3, 10, 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = -2;
    dirLight.shadow.camera.left = -2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);
    
    // Floor - infinite/endless appearance
    const floorGeometry = new THREE.PlaneGeometry(1000, 1000); // Much larger floor (1000x1000)
    const floorMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xcbcbcb,
      depthWrite: false
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Load models
    const loader = new THREE.GLTFLoader();
    const models = [];
    let mixer = null;
    let animations = [];
    let currentAction = null;
    let xbotSkeleton = null;
    let xbotMesh = null; // Store the Xbot mesh for color changes
    
    // Bone mapping for body part types (with mixamorig prefix)
    const boneMap = {
      'top-head': 'mixamorigHead',
      'middle-head': 'mixamorigHead',
      'lower-head': 'mixamorigHead',
      'chest': 'mixamorigSpine2',
      'left-hand': 'mixamorigLeftHand',
      'right-hand': 'mixamorigRightHand',
      'left-leg': 'mixamorigLeftLeg',
      'right-leg': 'mixamorigRightLeg',
      'both-legs': 'mixamorigHips'
    };
    
    // Load Xbot - make it much bigger
    const xbotUrl = '${authConfig.baseURL}/api/admin/3d-models/files/Xbot.glb';
    console.log('Loading Xbot from backend:', xbotUrl);
    
    loader.load(
      xbotUrl,
      function(gltf) {
        console.log('Xbot loaded successfully from backend');
        const xbot = gltf.scene;
        xbot.scale.set(1.0, 1.0, 1.0);
        xbot.position.set(0, 0, 0);
        
        // Store the Xbot mesh for color changes
        xbotMesh = xbot;
        
        // Enable shadows
        xbot.traverse(function(object) {
          if (object.isMesh) {
            object.castShadow = true;
          }
          // Store skeleton for later use
          if (object.isSkinnedMesh && object.skeleton) {
            xbotSkeleton = object.skeleton;
            console.log('Xbot skeleton found, bones:', xbotSkeleton.bones.map(b => b.name));
          }
        });
        
        scene.add(xbot);
        models.push(xbot);
        console.log('Xbot added to scene, scale:', xbot.scale);
        
        // Setup animations with additive support
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(xbot);
          animations = gltf.animations;
          console.log('Found animations:', animations.length);
          
          const animationNames = [];
          
          // Process animations
          for (let i = 0; i < animations.length; i++) {
            let clip = animations[i];
            const name = clip.name;
            
            // Make pose animations additive
            if (name.endsWith('_pose')) {
              THREE.AnimationUtils.makeClipAdditive(clip);
              clip = THREE.AnimationUtils.subclip(clip, clip.name, 2, 3, 30);
              animations[i] = clip;
            }
            
            animationNames.push(name);
          }
          
          // Send animation names to React Native
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage('ANIMATIONS:' + animationNames.join(','));
          }
          
          // Play idle animation by default if available
          const idleAnim = animations.find(anim => anim.name === 'idle');
          if (idleAnim) {
            currentAction = mixer.clipAction(idleAnim);
            currentAction.play();
          }
        }
      },
      function(progress) {
        console.log('Xbot loading:', (progress.loaded / progress.total * 100).toFixed(2) + '%');
      },
      function(error) {
        console.error('Error loading Xbot:', error);
      }
    );
    
    // Load product models - use scale and position from database
    ${modelsData.map((modelData, index) => {
      // Use scale directly from database (same for web and mobile)
      const scale = Number(modelData.scale) || 1.0;
      const posX = Number(modelData.positionX) || 0;
      const posY = Number(modelData.positionY) || 0;
      const posZ = Number(modelData.positionZ) || 0;
      
      console.log('Model ${index} - bodyPartType:', '${modelData.bodyPartType}', 'scale:', scale, 'position:', posX, posY, posZ);
      
      let code = '';
      
      if (modelData.leftLegFile) {
        const leftPosX = modelData.bodyPartType === 'both-legs' || modelData.bodyPartType === 'left-leg' 
          ? posX - 0.15 : posX;
        code += `
    console.log('Loading left model ${index} from: ${authConfig.baseURL}/api/admin/3d-models/files/${modelData.leftLegFile}');
    loader.load(
      '${authConfig.baseURL}/api/admin/3d-models/files/${modelData.leftLegFile}',
      function(gltf) {
        console.log('Left model ${index} loaded successfully');
        const model = gltf.scene;
        model.scale.set(${scale}, ${scale}, ${scale});
        
        // Enable shadows and ensure textures are visible
        model.traverse(function(object) {
          if (object.isMesh) {
            object.castShadow = true;
            // Ensure material shows textures properly
            if (object.material) {
              if (object.material.map) {
                object.material.map.needsUpdate = true;
                console.log('Texture found on mesh:', object.name);
              }
              object.material.needsUpdate = true;
            }
          }
        });
        
        // Attach to bone if skeleton is available
        const bodyPartType = '${modelData.bodyPartType}';
        const boneName = boneMap[bodyPartType];
        
        console.log('Attaching model to bodyPartType:', bodyPartType, 'boneName:', boneName);
        console.log('Model scale:', ${scale}, 'Position:', ${leftPosX}, ${posY}, ${posZ});
        
        if (xbotSkeleton && boneName) {
          const bone = xbotSkeleton.bones.find(b => b.name === boneName);
          if (bone) {
            console.log('Found bone:', boneName, 'Attaching model...');
            bone.add(model);
            model.position.set(${leftPosX}, ${posY}, ${posZ});
            console.log('Model attached to bone successfully');
          } else {
            console.log('Bone not found:', boneName, 'Available bones:', xbotSkeleton.bones.map(b => b.name).join(','));
            model.position.set(${leftPosX}, ${posY}, ${posZ});
            scene.add(model);
          }
        } else {
          console.log('No skeleton or boneName, adding to scene');
          model.position.set(${leftPosX}, ${posY}, ${posZ});
          scene.add(model);
        }
        
        models.push(model);
        console.log('Left model ${index} added at position:', ${leftPosX}, ${posY}, ${posZ});
      },
      function(progress) {
        console.log('Left model ${index} loading:', (progress.loaded / progress.total * 100).toFixed(2) + '%');
      },
      function(error) {
        console.error('Error loading left model ${index}:', error);
      }
    );
        `;
      }
      
      if (modelData.rightLegFile) {
        const rightPosX = modelData.bodyPartType === 'both-legs' || modelData.bodyPartType === 'right-leg'
          ? posX + 0.15 : posX;
        code += `
    console.log('Loading right model ${index} from: ${authConfig.baseURL}/api/admin/3d-models/files/${modelData.rightLegFile}');
    loader.load(
      '${authConfig.baseURL}/api/admin/3d-models/files/${modelData.rightLegFile}',
      function(gltf) {
        console.log('Right model ${index} loaded successfully');
        const model = gltf.scene;
        model.scale.set(${scale}, ${scale}, ${scale});
        
        // Enable shadows and ensure textures are visible
        model.traverse(function(object) {
          if (object.isMesh) {
            object.castShadow = true;
            // Ensure material shows textures properly
            if (object.material) {
              if (object.material.map) {
                object.material.map.needsUpdate = true;
                console.log('Texture found on mesh:', object.name);
              }
              object.material.needsUpdate = true;
            }
          }
        });
        
        // Attach to bone if skeleton is available
        const bodyPartType = '${modelData.bodyPartType}';
        const boneName = boneMap[bodyPartType];
        
        console.log('Attaching model to bodyPartType:', bodyPartType, 'boneName:', boneName);
        console.log('Model scale:', ${scale}, 'Position:', ${rightPosX}, ${posY}, ${posZ});
        
        if (xbotSkeleton && boneName) {
          const bone = xbotSkeleton.bones.find(b => b.name === boneName);
          if (bone) {
            console.log('Found bone:', boneName, 'Attaching model...');
            bone.add(model);
            model.position.set(${rightPosX}, ${posY}, ${posZ});
            console.log('Model attached to bone successfully');
          } else {
            console.log('Bone not found:', boneName, 'Available bones:', xbotSkeleton.bones.map(b => b.name).join(','));
            model.position.set(${rightPosX}, ${posY}, ${posZ});
            scene.add(model);
          }
        } else {
          console.log('No skeleton or boneName, adding to scene');
          model.position.set(${rightPosX}, ${posY}, ${posZ});
          scene.add(model);
        }
        
        models.push(model);
        console.log('Right model ${index} added at position:', ${rightPosX}, ${posY}, ${posZ});
      },
      function(progress) {
        console.log('Right model ${index} loading:', (progress.loaded / progress.total * 100).toFixed(2) + '%');
      },
      function(error) {
        console.error('Error loading right model ${index}:', error);
      }
    );
        `;
      }
      
      return code;
    }).join('\n')}
    
    // Animation
    let angle = 0;
    let autoRotate = false;
    const clock = new THREE.Clock();
    
    function animate() {
      requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      
      // Update animation mixer
      if (mixer) {
        mixer.update(delta);
      }
      
      // Auto-rotate camera only when enabled
      if (autoRotate) {
        angle += 0.005;
        const distance = camera.position.distanceTo(controls.target);
        camera.position.x = Math.sin(angle) * distance;
        camera.position.z = Math.cos(angle) * distance;
        camera.lookAt(controls.target);
      }
      
      controls.update();
      renderer.render(scene, camera);
    }
    
    animate();
    
    // Function to change place/lighting
    window.changePlace = function(place) {
      console.log('Changing place to:', place);
      if (place === 'light') {
        scene.background = new THREE.Color(0xf5f5f5);
        scene.fog = new THREE.Fog(0xf5f5f5, 10, 50);
        floorMaterial.color.setHex(0xcbcbcb);
      } else if (place === 'dark') {
        scene.background = new THREE.Color(0x000000);
        scene.fog = new THREE.Fog(0x000000, 10, 50);
        floorMaterial.color.setHex(0x222222);
      } else if (place === 'gray') {
        scene.background = new THREE.Color(0x808080);
        scene.fog = new THREE.Fog(0x808080, 10, 50);
        floorMaterial.color.setHex(0x666666);
      }
    };
    
    // Function to change Xbot body color
    window.changeBodyColor = function(color) {
      console.log('Changing body color to:', color);
      
      // Find all models in the scene
      const allModels = [];
      scene.traverse((child) => {
        if (child.isMesh) {
          allModels.push(child.name);
        }
      });
      console.log('All meshes in scene:', allModels.join(', '));
      
      if (!xbotMesh) {
        console.log('Xbot mesh not loaded yet');
        return;
      }
      
      let meshCount = 0;
      
      // Find the Xbot mesh and change its material
      xbotMesh.traverse((child) => {
        if (child.isMesh) {
          meshCount++;
          console.log('Found Xbot mesh:', child.name);
          
          // Store original material if not already stored
          if (!child.userData.originalMaterial) {
            child.userData.originalMaterial = child.material.clone();
            console.log('Stored original material for:', child.name);
          }
          
          // Handle both single material and array of materials
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          
          materials.forEach((mat, index) => {
            if (color === 'default') {
              // Reset to original material
              const originalMats = Array.isArray(child.userData.originalMaterial) 
                ? child.userData.originalMaterial 
                : [child.userData.originalMaterial];
              if (Array.isArray(child.material)) {
                child.material[index] = originalMats[index].clone();
              } else {
                child.material = originalMats[0].clone();
              }
              console.log('Reset to default for:', child.name);
            } else if (color === 'silver') {
              // Gray color
              mat.color.setHex(0x808080); // Gray
              mat.metalness = 0.3;
              mat.roughness = 0.7;
              mat.needsUpdate = true;
              console.log('Applied silver to:', child.name);
            } else if (color === 'black') {
              // Silver metallic look
              mat.color.setHex(0xC0C0C0); // Silver
              mat.metalness = 0.9;
              mat.roughness = 0.1;
              mat.needsUpdate = true;
              console.log('Applied black to:', child.name);
            }
          });
        }
      });
      
      console.log('Body color change complete. Meshes found:', meshCount);
    };
    
    // Function to start auto-rotation
    window.startAutoRotate = function() {
      console.log('Starting auto-rotate');
      autoRotate = true;
    };
    
    // Function to stop auto-rotation
    window.stopAutoRotate = function() {
      console.log('Stopping auto-rotate');
      autoRotate = false;
    };
    
    // Function to play animation by name
    window.playAnimation = function(animationName) {
      console.log('Playing animation:', animationName);
      if (!mixer || animations.length === 0) {
        console.log('No animations available');
        return;
      }
      
      const animation = animations.find(anim => anim.name === animationName);
      if (!animation) {
        console.log('Animation not found:', animationName);
        return;
      }
      
      // Stop current animation
      if (currentAction) {
        currentAction.fadeOut(0.5);
      }
      
      // Play new animation
      currentAction = mixer.clipAction(animation);
      currentAction.reset();
      
      // Set weight based on animation type
      if (animationName.endsWith('_pose')) {
        currentAction.setEffectiveWeight(1);
      }
      
      currentAction.fadeIn(0.5).play();
      console.log('Animation started:', animationName);
    };
    
    // Control functions
    window.zoomIn = function() {
      const distance = camera.position.distanceTo(controls.target);
      const newDistance = Math.max(2, distance - 0.5);
      const direction = camera.position.clone().sub(controls.target).normalize();
      camera.position.copy(controls.target).add(direction.multiplyScalar(newDistance));
    };
    
    window.zoomOut = function() {
      const distance = camera.position.distanceTo(controls.target);
      const newDistance = Math.min(8, distance + 0.5);
      const direction = camera.position.clone().sub(controls.target).normalize();
      camera.position.copy(controls.target).add(direction.multiplyScalar(newDistance));
    };
    
    window.resetView = function() {
      camera.position.set(0, 1.5, 4);
      controls.target.set(0, 1, 0);
      controls.update();
      angle = 0;
    };
    
    // Handle resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>
  `;
  }, [modelsData]); // Close useMemo with dependency on modelsData

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          {/* 3D Viewer - Full Screen */}
          <View style={styles.viewerContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <DotsLoading />
                <ThemedText style={styles.loadingText}></ThemedText>
              </View>
            ) : (
              <WebView
                ref={webViewRef}
                source={{ html: htmlContent }}
                style={styles.webview}
                scrollEnabled={false}
                bounces={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={false}
                androidLayerType="hardware"
                onMessage={(event) => {
                  const message = event.nativeEvent.data;
                  console.log('[ARTryOn WebView]', message);
                  
                  // Check if it's animations list
                  if (message.startsWith('ANIMATIONS:')) {
                    const animations = message.replace('ANIMATIONS:', '').split(',').filter(a => a.length > 0);
                    console.log('[ARTryOn] Available animations:', animations);
                    setAvailableMotions(animations);
                  }
                }}
                onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.error('[ARTryOn WebView] Error:', nativeEvent);
                }}
                onHttpError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.error('[ARTryOn WebView] HTTP Error:', nativeEvent.statusCode, nativeEvent.url);
                }}
              />
            )}
          </View>

          {/* Controls - Lower Right */}
          {!loading && !showMotions && !showPlaces && !showBodyColors && (
            <>
              <View style={styles.controlsContainer}>
                <TouchableOpacity 
                  onPressIn={handleResetPressIn}
                  onPressOut={handleResetPressOut}
                  style={styles.controlButton}
                >
                  <User size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Motion, Place, and Body Color Buttons */}
              {availableMotions.length > 0 && (
                <View style={styles.bottomButtons}>
                  <TouchableOpacity 
                    style={styles.motionButton}
                    onPress={() => setShowMotions(true)}
                  >
                    <ThemedText style={styles.motionButtonText}>Motions</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.placeButton}
                    onPress={() => setShowPlaces(true)}
                  >
                    <ThemedText style={styles.placeButtonText}>Place</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.bodyColorButton}
                    onPress={() => setShowBodyColors(true)}
                  >
                    <ThemedText style={styles.bodyColorButtonText}>Body</ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          {/* Close button when motion, place, or body color sheet is open */}
          {(showMotions || showPlaces || showBodyColors) && (
            <TouchableOpacity onPress={handleClose} style={styles.closeButtonMotionOpen}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          {/* Motion Cards */}
          {showMotions && (
            <View style={styles.motionPanel}>
              <View style={styles.motionHeader}>
                <ThemedText style={styles.motionTitle}>Motion</ThemedText>
                <TouchableOpacity onPress={() => setShowMotions(false)} style={styles.backButtonIcon}>
                  <ChevronLeft size={28} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.motionList}>
                {availableMotions.map((motion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.motionCard,
                      selectedMotion === motion && styles.motionCardSelected
                    ]}
                    onPress={() => handleSelectMotion(motion)}
                  >
                    <ThemedText style={styles.motionCardText}>{formatMotionName(motion)}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Place Cards */}
          {showPlaces && (
            <View style={styles.motionPanel}>
              <View style={styles.motionHeader}>
                <ThemedText style={styles.motionTitle}>Place</ThemedText>
                <TouchableOpacity onPress={() => setShowPlaces(false)} style={styles.backButtonIcon}>
                  <ChevronLeft size={28} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.motionList}>
                <TouchableOpacity
                  style={[
                    styles.motionCard,
                    selectedPlace === 'light' && styles.motionCardSelected
                  ]}
                  onPress={() => handleSelectPlace('light')}
                >
                  <ThemedText style={styles.motionCardText}>Light</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.motionCard,
                    selectedPlace === 'dark' && styles.motionCardSelected
                  ]}
                  onPress={() => handleSelectPlace('dark')}
                >
                  <ThemedText style={styles.motionCardText}>Dark</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.motionCard,
                    selectedPlace === 'gray' && styles.motionCardSelected
                  ]}
                  onPress={() => handleSelectPlace('gray')}
                >
                  <ThemedText style={styles.motionCardText}>Gray</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Body Color Cards */}
          {showBodyColors && (
            <View style={styles.motionPanel}>
              <View style={styles.motionHeader}>
                <ThemedText style={styles.motionTitle}>Body Color</ThemedText>
                <TouchableOpacity onPress={() => setShowBodyColors(false)} style={styles.backButtonIcon}>
                  <ChevronLeft size={28} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.motionList}>
                <TouchableOpacity
                  style={[
                    styles.bodyColorCard,
                    selectedBodyColor === 'default' && styles.motionCardSelected
                  ]}
                  onPress={() => handleSelectBodyColor('default')}
                >
                  <View style={styles.bodyColorPreview}>
                    <View style={[styles.bodyColorSwatch, { backgroundColor: '#8B7355' }]} />
                  </View>
                  <ThemedText style={styles.motionCardText}>Default</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.bodyColorCard,
                    selectedBodyColor === 'silver' && styles.motionCardSelected
                  ]}
                  onPress={() => handleSelectBodyColor('silver')}
                >
                  <View style={styles.bodyColorPreview}>
                    <View style={[styles.bodyColorSwatch, { backgroundColor: '#808080' }]} />
                  </View>
                  <ThemedText style={styles.motionCardText}>Silver</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.bodyColorCard,
                    selectedBodyColor === 'black' && styles.motionCardSelected
                  ]}
                  onPress={() => handleSelectBodyColor('black')}
                >
                  <View style={styles.bodyColorPreview}>
                    <View style={[styles.bodyColorSwatch, { backgroundColor: '#C0C0C0' }]} />
                  </View>
                  <ThemedText style={styles.motionCardText}>Black</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  viewerContainer: {
    flex: 1,
    backgroundColor: AppTheme.colors.secondary,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    gap: 12,
    zIndex: 10,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  closeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  closeButtonMotionOpen: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: AppTheme.colors.primary,
  },
  loadingText: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
    marginTop: 8,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    flexDirection: 'row',
    gap: 12,
  },
  motionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  motionButtonText: {
    color: '#FFFFFF',
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
  },
  placeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  placeButtonText: {
    color: '#FFFFFF',
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
  },
  bodyColorButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  bodyColorButtonText: {
    color: '#FFFFFF',
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
  },
  bodyColorCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  bodyColorPreview: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bodyColorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  motionPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '50%',
  },
  motionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButtonIcon: {
    padding: 4,
  },
  motionTitle: {
    color: '#FFFFFF',
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
    flex: 1,
  },
  motionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  motionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 100,
  },
  motionCardSelected: {
    backgroundColor: AppTheme.colors.primary,
    borderColor: AppTheme.colors.primary,
  },
  motionCardText: {
    color: '#FFFFFF',
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.medium,
    textAlign: 'center',
  },
});
