import { View, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { WebView } from 'react-native-webview';
import { URL } from '@/config';
import React, { useEffect, useRef } from 'react';
import { orpcClient } from '@/lib/orpc-client';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_CARD_WIDTH = 180; // Default Width
const DEFAULT_CARD_HEIGHT = (DEFAULT_CARD_WIDTH / 2.5) * 5; // Even taller - 2.5:5 aspect ratio to show full legs

interface CollectionCardProps {
  collection: any;
  onPress: () => void;
  width?: number; // Optional custom width
  height?: number; // Optional custom height
  hideInfo?: boolean; // Optional flag to hide name and price info
}

// Loading dots component (same as ProductCard)
function LoadingDots() {
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
    <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: AppTheme.colors.primary, opacity: dot1 }} />
      <Animated.View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: AppTheme.colors.primary, opacity: dot2 }} />
      <Animated.View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: AppTheme.colors.primary, opacity: dot3 }} />
    </View>
  );
}

export function CollectionCard({ collection, onPress, width, height, hideInfo = false }: CollectionCardProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [htmlContent, setHtmlContent] = React.useState<string>('');
  
  // Use custom dimensions or defaults
  const cardWidth = width || DEFAULT_CARD_WIDTH;
  const cardHeight = height || DEFAULT_CARD_HEIGHT;

  // Debug: Log collection data
  React.useEffect(() => {
    if (Array.isArray(collection.glbModelIds)) {
      console.log('[CollectionCard] glbModelIds length:', collection.glbModelIds.length);
      console.log('[CollectionCard] glbModelIds content:', JSON.stringify(collection.glbModelIds));
    }
    console.log('[CollectionCard] ===========================');
  }, [collection]);

  // Generate HTML with model data
  React.useEffect(() => {
    const loadHTML = async () => {
      const html = await generateHTML();
      setHtmlContent(html);
    };
    loadHTML();
  }, [collection]);

  // Generate HTML for WebView with Xbot and collection models
  const generateHTML = async () => {
    const modelIds = Array.isArray(collection.glbModelIds) 
      ? collection.glbModelIds 
      : (typeof collection.glbModelIds === 'string' ? JSON.parse(collection.glbModelIds) : []);

    const baseURL = URL.BASE;
    
    // Fetch model data in React Native (not in WebView)
    console.log('[CollectionCard] Fetching model data for:', modelIds);
    const modelsData: any[] = [];
    
    for (const modelId of modelIds) {
      try {
        const modelData = await orpcClient.get3DModel(modelId);
        modelsData.push(modelData);
        console.log('[CollectionCard] ✓ Model fetched:', modelId);
        console.log('[CollectionCard] Model data:', JSON.stringify(modelData, null, 2));
      } catch (error) {
        console.warn('[CollectionCard] ⚠️ Skipping non-existent model:', modelId);
        // Skip models that don't exist - don't break the entire collection
      }
    }
    
    console.log('[CollectionCard] Total models fetched:', modelsData.length, 'out of', modelIds.length);

    return `
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
              background: #ffffff;
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
            // Models data passed from React Native
            const modelsData = ${JSON.stringify(modelsData)};
            
            // FIRST TEST - Does WebView execute JavaScript at all?
            try {
              window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'test', message: 'WebView JavaScript is running!' }));
            } catch (e) {
              alert('Error posting message: ' + e.message);
            }
            
            console.log('=== COLLECTION CARD WEBVIEW STARTED ===');
            console.log('Base URL:', '${baseURL}');
            console.log('Models data:', modelsData);
            
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xffffff);
            
            const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 0.9, 2.5); // Moved back from 2 to 2.5
            camera.lookAt(0, 0.9, 0);
            
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setClearColor(0xffffff, 1); // Ensure white background
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            document.getElementById('canvas-container').appendChild(renderer.domElement);
            
            // Add OrbitControls for manual rotation
            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.enableZoom = true;
            controls.enablePan = false;
            controls.autoRotate = false; // Disable auto-rotation
            controls.target.set(0, 0.9, 0);
            controls.update();
            console.log('OrbitControls initialized (no auto-rotation)');
            
            // Enhanced Lights — clean neutral product-card style
            const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
            scene.add(ambientLight);
            
            // Key light — front top
            const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
            keyLight.position.set(2, 4, 4);
            keyLight.castShadow = true;
            keyLight.shadow.mapSize.width = 2048;
            keyLight.shadow.mapSize.height = 2048;
            scene.add(keyLight);
            
            // Fill light — opposite side, softer
            const fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
            fillLight.position.set(-3, 2, 2);
            scene.add(fillLight);
            
            // Back rim light — edge definition
            const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
            rimLight.position.set(0, 2, -4);
            scene.add(rimLight);
            
            // Top hemisphere for even ambient
            const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.2);
            hemiLight.position.set(0, 10, 0);
            scene.add(hemiLight);
            
            const loader = new THREE.GLTFLoader();
            let xbotGroup = null;
            let skeleton = null;
            let mixer = null;
            let idleAction = null;
            
            // Load Xbot
            console.log('Loading Xbot from:', '${baseURL}/api/admin/3d-models/files/Xbot.glb');
            loader.load(
              '${baseURL}/api/admin/3d-models/files/Xbot.glb',
              (gltf) => {
                console.log('Xbot loaded successfully');
                xbotGroup = gltf.scene;
                xbotGroup.scale.set(1, 1, 1);
                xbotGroup.position.y = -0.2; // Move Xbot down so feet are below floor
                xbotGroup.rotation.y = -0.3; // Rotate slightly to the right (negative = right turn)
                
                // Hide Xbot meshes (keep skeleton for bone attachment)
                xbotGroup.traverse((child) => {
                  if (child.isMesh || child.isSkinnedMesh) {
                    child.visible = false;
                  }
                });
                
                scene.add(xbotGroup);
                console.log('Xbot added to scene (hidden), rotated slightly to the right');
                
                // Setup animation mixer for idle animation
                if (gltf.animations && gltf.animations.length > 0) {
                  console.log('Found', gltf.animations.length, 'animations — keeping Xbot static (no animation)');
                  // Do NOT play any animation — keep Xbot in T-pose / static
                } else {
                  console.warn('No animations found in Xbot model');
                }
                
                // Find skeleton and apply custom pose
                xbotGroup.traverse((child) => {
                  if (child.isSkinnedMesh && child.skeleton) {
                    console.log('Found skeleton with', child.skeleton.bones.length, 'bones');
                    skeleton = child.skeleton;
                    
                    // Log before calling loadProductModels
                    console.log('About to call loadProductModels...');
                    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ 
                      type: 'log', 
                      message: 'Skeleton found, calling loadProductModels...' 
                    }));
                    
                    loadProductModels();
                  }
                });
                
                if (!skeleton) {
                  console.error('No skeleton found in Xbot model!');
                }
              },
              (progress) => {
                console.log('Xbot loading progress:', Math.round((progress.loaded / progress.total) * 100) + '%');
              },
              (error) => {
                console.error('Error loading Xbot:', error);
              }
            );
            
            const boneMapping = {
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
            
            async function loadProductModels() {
              const log = (msg) => {
                console.log(msg);
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'log', message: msg }));
              };
              
              log('=== loadProductModels STARTED ===');
              
              if (!skeleton) {
                log('ERROR: No skeleton found!');
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'loaded' }));
                return;
              }
              
              log('Loading ' + modelsData.length + ' models');
              log('Models data: ' + JSON.stringify(modelsData.map(m => ({ id: m.id, name: m.name }))));
              
              if (modelsData.length === 0) {
                log('ERROR: No models data!');
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'loaded' }));
                return;
              }
              
              let loadedCount = 0;
              
              for (const model of modelsData) {
                try {
                  log('=== LOADING MODEL ===');
                  log('Model ID: ' + model.id);
                  log('Model name: ' + (model.name || 'N/A'));
                  log('Body part: ' + model.bodyPartType);
                  log('Scale: ' + model.scale);
                  log('Position: ' + model.positionX + ', ' + model.positionY + ', ' + model.positionZ);
                  log('leftLegFile: ' + model.leftLegFile);
                  log('leftLegUrl: ' + model.leftLegUrl);
                  
                  if (model && model.leftLegFile) {
                    const fileUrl = '${baseURL}/api/admin/3d-models/files/' + model.leftLegFile;
                    log('Loading 3D file from: ' + fileUrl);
                    
                    await new Promise((resolve, reject) => {
                      loader.load(
                        fileUrl,
                        (gltf) => {
                          log('✓ 3D file loaded successfully');
                          const boneName = boneMapping[model.bodyPartType];
                          log('Attaching to bone: ' + boneName);
                          const bone = skeleton.bones.find(b => b.name === boneName);
                          
                          if (bone) {
                            const productModel = gltf.scene;
                            // Use scale and position from database
                            // Scale needs to be divided by 10 to match web preview
                            const savedScale = parseFloat(model.scale);
                            const actualScale = savedScale / 10;
                            const posX = parseFloat(model.positionX);
                            const posY = parseFloat(model.positionY);
                            const posZ = parseFloat(model.positionZ);
                            
                            log('Saved scale: ' + savedScale + ' → Actual scale: ' + actualScale);
                            log('Applying position: ' + posX + ', ' + posY + ', ' + posZ);
                            
                            productModel.scale.set(actualScale, actualScale, actualScale);
                            productModel.position.set(posX, posY, posZ);
                            
                            // Enhance materials for better light reflection
                            productModel.traverse((child) => {
                              if (child.isMesh) {
                                child.castShadow = true;
                                child.receiveShadow = true;
                                
                                if (child.material) {
                                  // Enhanced material properties for better reflections
                                  child.material.envMapIntensity = 1.5;
                                  child.material.metalness = 0.2;
                                  child.material.roughness = 0.4;
                                  
                                  // Ensure proper lighting response
                                  if (child.material.map) {
                                    child.material.map.anisotropy = 16;
                                  }
                                  
                                  child.material.needsUpdate = true;
                                }
                              }
                            });
                            
                            bone.add(productModel);
                            
                            log('SUCCESS: Model attached to ' + boneName);
                            log('Model children count: ' + productModel.children.length);
                            log('Model visible: ' + productModel.visible);
                            loadedCount++;
                            resolve();
                          } else {
                            log('ERROR: Bone not found: ' + boneName);
                            log('Available bones: ' + skeleton.bones.map(b => b.name).slice(0, 10).join(', '));
                            reject();
                          }
                        },
                        (progress) => {
                          if (progress.total > 0) {
                            const percent = Math.round((progress.loaded / progress.total) * 100);
                            log('Loading progress: ' + percent + '%');
                          }
                        },
                        (error) => {
                          log('ERROR loading 3D file: ' + error.message);
                          log('File URL was: ' + fileUrl);
                          reject(error);
                        }
                      );
                    });
                  } else {
                    log('ERROR: Model missing leftLegFile or invalid model data');
                  }
                } catch (error) {
                  log('ERROR in loadProductModels loop: ' + error.message);
                  log('ERROR stack: ' + (error.stack || 'no stack'));
                }
              }
              
              log('COMPLETE: Loaded ' + loadedCount + ' of ' + modelsData.length + ' models');
              window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'loaded' }));
            }
            
            const clock = new THREE.Clock();
            
            function animate() {
              requestAnimationFrame(animate);
              
              const delta = clock.getDelta();
              if (mixer) {
                mixer.update(delta);
              }
              
              // Auto-rotate the entire scene for 3D effect
              if (xbotGroup) {
                xbotGroup.rotation.y += 0.01; // Smooth rotation like product card
              }
              
              controls.update(); // Update OrbitControls
              
              renderer.render(scene, camera);
            }
            animate();
            console.log('Animation loop started with auto-rotation');
            
            window.addEventListener('resize', () => {
              camera.aspect = window.innerWidth / window.innerHeight;
              camera.updateProjectionMatrix();
              renderer.setSize(window.innerWidth, window.innerHeight);
            });
          </script>
        </body>
      </html>
    `;
  };

  const isLowStock = Boolean(collection.inStock && collection.stockQuantity && collection.stockQuantity <= (collection.lowStockThreshold || 10));
  const isOutOfStock = Boolean(!collection.inStock || collection.stockQuantity === 0);
  const hasDiscount = Boolean(collection.discount && Number(collection.discount) > 0);
  const showBadges = hasDiscount || isOutOfStock || isLowStock;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
        {/* Xbot Preview */}
        <View style={styles.previewContainer}>
          {htmlContent ? (
            <WebView
              source={{ html: htmlContent }}
              style={styles.webview}
              scrollEnabled={false}
              bounces={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              androidLayerType="hardware"
              onMessage={(event) => {
                try {
                  const data = JSON.parse(event.nativeEvent.data);
                  if (data.type === 'log') {
                    console.log('[WebView]', data.message);
                  } else if (data.type === 'test') {
                    console.log('[CollectionCard] ✓ WebView is running!', data.message);
                  } else if (data.type === 'loaded') {
                    console.log('[CollectionCard] ✓ Models loaded!');
                    setIsLoading(false);
                  } else {
                    console.log('[CollectionCard] WebView message:', data);
                  }
                } catch (e) {
                  console.error('[CollectionCard] Error parsing WebView message:', e);
                }
              }}
              onConsoleMessage={(event : any) => {
                // Forward WebView console logs to React Native console
                console.log('[WebView Console]', event.nativeEvent.message);
              }}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.error('[CollectionCard] WebView error:', nativeEvent);
              }}
              onLoadEnd={() => {
                console.log('[CollectionCard] WebView finished loading');
              }}
            />
          ) : (
            <View style={styles.loadingOverlay}>
              <LoadingDots />
            </View>
          )}
          
          {/* Loading Indicator */}
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <LoadingDots />
            </View>
          )}
        </View>
        
        {/* Badges — grouped pill, outer edges curved only */}
        {showBadges ? (
          <View style={styles.badgesContainer}>
            {hasDiscount ? (
              <View style={[
                styles.discountBadge,
                (isOutOfStock || isLowStock) ? styles.badgeLeft : styles.badgeSolo,
              ]}>
                <ThemedText style={styles.discountText}>
                  {`-${Math.round(Number(collection.discount || 0))}%`}
                </ThemedText>
              </View>
            ) : null}
            {isOutOfStock ? (
              <View style={[
                styles.outOfStockBadge,
                hasDiscount ? styles.badgeRight : styles.badgeSolo,
              ]}>
                <ThemedText style={styles.outOfStockText}>Out of Stock</ThemedText>
              </View>
            ) : null}
            {(isLowStock && !isOutOfStock) ? (
              <View style={[
                styles.lowStockBadge,
                hasDiscount ? styles.badgeRight : styles.badgeSolo,
              ]}>
                <ThemedText style={styles.lowStockText}>
                  {`${collection.stockQuantity || 0} left`}
                </ThemedText>
              </View>
            ) : null}
          </View>
        ) : null}
        
      </View>

      {/* Info below image — name + price */}
      {!hideInfo && (
        <View style={styles.infoContainer}>
          <ThemedText style={styles.collectionName} numberOfLines={1}>
            {String(collection.name || 'Collection')}
          </ThemedText>
          <View style={styles.priceRow}>
            {hasDiscount ? (
              <>
                <ThemedText style={styles.price}>
                  {`ETB ${collection.price || '0.00'}`}
                </ThemedText>
                <ThemedText style={styles.originalPrice}>
                  {`ETB ${(Number(collection.price || 0) / (1 - Number(collection.discount || 0) / 100)).toFixed(2)}`}
                </ThemedText>
              </>
            ) : (
              <ThemedText style={styles.price}>
                {`ETB ${collection.price || '0.00'}`}
              </ThemedText>
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    // Width and height will be set dynamically via props
    borderRadius: AppTheme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: AppTheme.colors.secondary,
  },
  previewContainer: {
    width: '100%',
    height: '100%',
  },
  webview: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  infoContainer: {
    marginTop: AppTheme.spacing.sm,
    gap: 4,
  },
  collectionName: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.semibold,
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.primary,
  },
  originalPrice: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.medium,
    color: AppTheme.colors.mutedForeground,
    textDecorationLine: 'line-through',
  },
  badgesContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    zIndex: 1,
  },
  badgeSolo: {
    borderRadius: 6,
  },
  badgeLeft: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  badgeRight: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  discountBadge: {
    backgroundColor: AppTheme.colors.error,
    paddingHorizontal: 6,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  discountText: {
    fontSize: 10,
    fontWeight: AppTheme.fontWeight.bold,
    color: '#fff',
  },
  outOfStockBadge: {
    backgroundColor: '#666',
    paddingHorizontal: 6,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  outOfStockText: {
    fontSize: 10,
    fontWeight: AppTheme.fontWeight.bold,
    color: '#fff',
  },
  lowStockBadge: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 6,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  lowStockText: {
    fontSize: 10,
    fontWeight: AppTheme.fontWeight.bold,
    color: '#fff',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
