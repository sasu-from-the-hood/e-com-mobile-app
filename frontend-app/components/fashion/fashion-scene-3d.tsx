import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, PanResponder, Animated } from 'react-native';
import { WebView } from 'react-native-webview';
import { URL } from '@/config';
import { AppTheme } from '@/constants/app-theme';
import { PostItem, TextElement } from '@/app/fashion/create-post';
import { ThemedText } from '@/components/themed-text';

interface FashionScene3DProps {
  items: PostItem[];
  textElements: TextElement[];
  is3DMode: boolean;
  backgroundColor?: 'floor' | 'studio' | 'outdoor' | 'minimal';
  isEditable?: boolean;
  onTextElementMove: (id: string, x: number, y: number) => void;
  onTextElementTap: (id: string) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Animated Dot Loading Component
function DotLoading() {
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const anim1 = createAnimation(dot1Anim, 0);
    const anim2 = createAnimation(dot2Anim, 200);
    const anim3 = createAnimation(dot3Anim, 400);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  const createDotStyle = (animValue: Animated.Value) => ({
    opacity: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
    transform: [
      {
        scale: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.2],
        }),
      },
    ],
  });

  return (
    <View style={styles.dotsContainer}>
      <Animated.View style={[styles.dot, createDotStyle(dot1Anim)]} />
      <Animated.View style={[styles.dot, createDotStyle(dot2Anim)]} />
      <Animated.View style={[styles.dot, createDotStyle(dot3Anim)]} />
    </View>
  );
}

// Draggable Text Component with PanResponder
function DraggableText({ 
  text, 
  onMove, 
  onTap 
}: { 
  text: TextElement; 
  onMove: (id: string, x: number, y: number) => void;
  onTap: (id: string) => void;
}) {
  const [position, setPosition] = React.useState({
    x: (text.positionX / 100) * SCREEN_WIDTH,
    y: (text.positionY / 100) * SCREEN_HEIGHT,
  });

  const isDragging = useRef(false);
  const startTouch = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: (evt) => {
        isDragging.current = false;
        startTouch.current = {
          x: evt.nativeEvent.pageX,
          y: evt.nativeEvent.pageY,
        };
      },
      onPanResponderMove: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5) {
          isDragging.current = true;
        }
        
        if (isDragging.current) {
          setPosition({
            x: (text.positionX / 100) * SCREEN_WIDTH + gestureState.dx,
            y: (text.positionY / 100) * SCREEN_HEIGHT + gestureState.dy,
          });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (isDragging.current) {
          const finalX = (text.positionX / 100) * SCREEN_WIDTH + gestureState.dx;
          const finalY = (text.positionY / 100) * SCREEN_HEIGHT + gestureState.dy;
          
          const percentX = (finalX / SCREEN_WIDTH) * 100;
          const percentY = (finalY / SCREEN_HEIGHT) * 100;
          
          onMove(text.id, percentX, percentY);
        } else {
          // Single tap - open editor
          onTap(text.id);
        }
        isDragging.current = false;
      },
    })
  ).current;

  return (
    <View
      style={[
        styles.textElement,
        {
          left: position.x,
          top: position.y,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.textBorder}>
        <ThemedText
          style={{
            fontSize: text.fontSize,
            fontFamily: text.fontFamily,
            color: text.color,
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
            transform: [{ rotate: `${text.rotation}deg` }],
          }}
        >
          {text.content}
        </ThemedText>
        
        {/* Corner handles - tap to open editor for resize/rotate */}
        <View style={[styles.cornerHandle, styles.cornerHandleTopLeft]} />
        <View style={[styles.cornerHandle, styles.cornerHandleTopRight]} />
        <View style={[styles.cornerHandle, styles.cornerHandleBottomLeft]} />
        <View style={[styles.cornerHandle, styles.cornerHandleBottomRight]} />
      </View>
    </View>
  );
}

export function FashionScene3D({ 
  items, 
  textElements, 
  is3DMode,
  backgroundColor = 'floor',
  isEditable = false,
  onTextElementMove,
  onTextElementTap 
}: FashionScene3DProps) {
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  React.useEffect(() => {
    generateHTML();
  }, [items, backgroundColor]); // Regenerate when items or backgroundColor change

  const generateHTML = () => {
    const baseURL = URL.BASE;
    
    // Set background color based on selection
    const bgColors = {
      floor: '#8B7355',      // Wood floor brown
      studio: '#E8E8E8',     // Light gray studio
      outdoor: '#87CEEB',    // Sky blue
      minimal: '#FFFFFF',    // Pure white
    };
    const bgColor = bgColors[backgroundColor];
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              width: 100vw; 
              height: 100vh; 
              overflow: hidden; 
              background: ${bgColor};
              touch-action: none;
            }
            #canvas-container { 
              width: 100%; 
              height: 100%; 
              position: relative;
            }
            canvas { display: block; }
          </style>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
        </head>
        <body>
          <div id="canvas-container"></div>
          <script>
            const itemsData = ${JSON.stringify(items)};
            const is3DMode = ${is3DMode};
            const bgColor = '${bgColor}';
            
            console.log('=== FASHION SCENE STARTED ===');
            console.log('Items:', itemsData.length);
            console.log('Mode:', is3DMode ? '3D' : '2D');
            console.log('Background Color:', bgColor);
            
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(bgColor);
            
            const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
            
            // Set camera position based on mode
            if (is3DMode) {
              camera.position.set(0, 0.8, 2.5); // Lower camera to center clothing in view
              camera.lookAt(0, 0.6, 0); // Look at center of clothing
            } else {
              // 2D mode: Front camera view
              camera.position.set(0, 0.8, 2); 
              camera.lookAt(0, 0.6, 0);
            }
            
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setClearColor(bgColor, 1);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            document.getElementById('canvas-container').appendChild(renderer.domElement);
            
            // OrbitControls - disabled in edit mode to allow text dragging
            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enabled = ${!isEditable}; // Disable controls when editing text
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.enableZoom = ${!isEditable};
            controls.enableRotate = ${!isEditable};
            controls.enablePan = false;
            controls.autoRotate = false;
            controls.minPolarAngle = Math.PI / 2; // Lock to horizontal plane (90 degrees)
            controls.maxPolarAngle = Math.PI / 2; // Lock to horizontal plane (90 degrees)
            controls.target.set(0, 0.6, 0); // Target center of clothing
            controls.update();
            
            const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // Brighter ambient
            scene.add(ambientLight);
            
            // Main directional light (key light) - stronger
            const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
            directionalLight.position.set(5, 5, 5);
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;
            scene.add(directionalLight);
            
            // Fill light (softer, from opposite side)
            const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
            fillLight.position.set(-5, 3, -3);
            scene.add(fillLight);
            
            // Rim light (from behind for edge highlights) - stronger
            const rimLight = new THREE.DirectionalLight(0xffffff, 1.5);
            rimLight.position.set(0, 3, -5);
            scene.add(rimLight);
            
            // Hemisphere light for natural ambient lighting
            const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
            hemiLight.position.set(0, 20, 0);
            scene.add(hemiLight);
            
            // Add point lights for extra sparkle - brighter
            const pointLight1 = new THREE.PointLight(0xffffff, 0.8, 10);
            pointLight1.position.set(2, 2, 2);
            scene.add(pointLight1);
            
            const pointLight2 = new THREE.PointLight(0xffffff, 0.8, 10);
            pointLight2.position.set(-2, 2, 2);
            scene.add(pointLight2);
            
            // Add spotlight for dramatic effect
            const spotLight = new THREE.SpotLight(0xffffff, 1.0);
            spotLight.position.set(0, 5, 0);
            spotLight.angle = Math.PI / 4;
            spotLight.penumbra = 0.3;
            spotLight.castShadow = true;
            scene.add(spotLight);
            
            const loader = new THREE.GLTFLoader();
            let xbotGroup = null;
            let skeleton = null;
            let mixer = null;
            
            // Load Xbot (invisible)
            console.log('Loading Xbot...');
            loader.load(
              '${baseURL}/api/admin/3d-models/files/Xbot.glb',
              (gltf) => {
                console.log('Xbot loaded');
                xbotGroup = gltf.scene;
                xbotGroup.scale.set(1, 1, 1);
                xbotGroup.position.y = -0.5; // Move Xbot down so feet are below floor
                
                // Hide Xbot meshes (keep skeleton for bone attachment)
                xbotGroup.traverse((child) => {
                  if (child.isMesh || child.isSkinnedMesh) {
                    child.visible = false;
                  }
                });
                
                scene.add(xbotGroup);
                console.log('Xbot added (hidden), moved down');
                
                // Disable animation - keep Xbot static for rotation
                // if (gltf.animations && gltf.animations.length > 0) {
                //   mixer = new THREE.AnimationMixer(xbotGroup);
                //   const idleAction = mixer.clipAction(gltf.animations[0]);
                //   idleAction.setLoop(THREE.LoopRepeat);
                //   idleAction.play();
                // }
                console.log('Xbot animation disabled - will rotate instead');
                
                // Find skeleton
                xbotGroup.traverse((child) => {
                  if (child.isSkinnedMesh && child.skeleton) {
                    skeleton = child.skeleton;
                    loadProductModels();
                  }
                });
              },
              undefined,
              (error) => {
                console.error('Error loading Xbot:', error);
              }
            );
            
            async function loadProductModels() {
              if (!skeleton) {
                console.error('[FashionScene] No skeleton found');
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'loaded' }));
                return;
              }
              
              console.log('[FashionScene] Loading', itemsData.length, 'products');
              console.log('[FashionScene] Items data:', JSON.stringify(itemsData));
              
              for (const item of itemsData) {
                try {
                  if (!item.leftLegFile) {
                    console.error('[FashionScene] No leftLegFile for item:', item.modelId);
                    continue;
                  }
                  
                  const fileUrl = '${baseURL}/api/admin/3d-models/files/' + item.leftLegFile;
                  console.log('[FashionScene] Loading model from:', fileUrl);
                  console.log('[FashionScene] Item data:', JSON.stringify(item));
                  
                  await new Promise((resolve, reject) => {
                    loader.load(
                      fileUrl,
                      (gltf) => {
                        console.log('[FashionScene] Model loaded successfully:', item.leftLegFile);
                        const bone = skeleton.bones.find(b => b.name === item.boneName);
                        
                        if (bone) {
                          const productModel = gltf.scene;
                          // Scale needs to be divided by 10 to match web preview
                          const savedScale = item.scale;
                          const actualScale = savedScale / 10;
                          
                          console.log('[FashionScene] Saved scale:', savedScale, '→ Actual scale:', actualScale);
                          console.log('[FashionScene] Position:', item.positionX, item.positionY, item.positionZ);
                          
                          productModel.scale.set(actualScale, actualScale, actualScale);
                          productModel.position.set(item.positionX, item.positionY, item.positionZ);
                          
                          // Enhance materials for better light reflection
                          productModel.traverse((child) => {
                            if (child.isMesh) {
                              child.castShadow = true;
                              child.receiveShadow = true;
                              
                              if (child.material) {
                                // Enhanced material properties for better reflections
                                child.material.envMapIntensity = 1.5; // Stronger environment reflections
                                child.material.metalness = 0.2; // More metallic look
                                child.material.roughness = 0.4; // Shinier surface
                                
                                // Ensure proper lighting response
                                if (child.material.map) {
                                  child.material.map.anisotropy = 16; // Better texture quality
                                }
                                
                                child.material.needsUpdate = true;
                              }
                            }
                          });
                          
                          bone.add(productModel);
                          console.log('[FashionScene] ✓ Attached to', item.boneName);
                          resolve();
                        } else {
                          console.error('[FashionScene] Bone not found:', item.boneName);
                          console.error('[FashionScene] Available bones:', skeleton.bones.map(b => b.name).join(', '));
                          reject(new Error('Bone not found'));
                        }
                      },
                      (progress) => {
                        console.log('[FashionScene] Loading progress:', (progress.loaded / progress.total * 100).toFixed(2) + '%');
                      },
                      (error) => {
                        console.error('[FashionScene] Error loading product:', error);
                        reject(error);
                      }
                    );
                  });
                } catch (error) {
                  console.error('[FashionScene] Failed to load item:', item.modelId, error);
                }
              }
              
              console.log('[FashionScene] All products loaded');
              window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'loaded' }));
            }
            
            const clock = new THREE.Clock();
            
            function animate() {
              requestAnimationFrame(animate);
              
              const delta = clock.getDelta();
              
              // Disable animation mixer - keep Xbot static
              // if (mixer) {
              //   mixer.update(delta);
              // }
              
              // Add slow rotation like collection card
              if (xbotGroup) {
                xbotGroup.rotation.y += 0.01; // Smooth rotation
              }
              
              controls.update();
              renderer.render(scene, camera);
            }
            animate();
            
            window.addEventListener('resize', () => {
              camera.aspect = window.innerWidth / window.innerHeight;
              camera.updateProjectionMatrix();
              renderer.setSize(window.innerWidth, window.innerHeight);
            });
          </script>
        </body>
      </html>
    `;
    
    setHtmlContent(html);
  };

  return (
    <View style={styles.container}>
      {/* 3D Scene WebView - Bottom Layer */}
      {htmlContent && (
        <WebView
          ref={webViewRef}
          source={{ html: htmlContent }}
          style={styles.webview}
          scrollEnabled={false}
          bounces={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          androidLayerType="hardware"
          pointerEvents="auto"
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'loaded') {
                setIsLoading(false);
              }
            } catch (e) {
              console.error('Error parsing WebView message:', e);
            }
          }}
          onLoadEnd={() => {
            console.log('[FashionScene3D] WebView loaded');
          }}
        />
      )}
      
      {/* Text Elements Overlay - Top Layer with higher z-index */}
      {isEditable && (
        <View style={styles.textOverlayContainer} pointerEvents="box-none">
          {textElements.map((text) => (
            <DraggableText
              key={text.id}
              text={text}
              onMove={onTextElementMove}
              onTap={onTextElementTap}
            />
          ))}
        </View>
      )}
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <DotLoading />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: AppTheme.colors.background,
  },
  webview: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
    zIndex: 1,
  },
  textOverlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  textElement: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  textBorder: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: 'gray',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    position: 'relative',
  },
  cornerHandle: {
    position: 'absolute',
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    borderColor: '#aaa',
  },
  cornerHandleTopLeft: {
    top: -12,
    left: -12,
  },
  cornerHandleTopRight: {
    top: -12,
    right: -12,
  },
  cornerHandleBottomLeft: {
    bottom: -12,
    left: -12,
  },
  cornerHandleBottomRight: {
    bottom: -12,
    right: -12,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
});
