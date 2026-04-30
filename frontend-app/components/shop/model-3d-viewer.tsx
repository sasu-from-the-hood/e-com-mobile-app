import { View, StyleSheet, Animated } from 'react-native';
import { WebView } from 'react-native-webview';
import { useState, useEffect, useRef, useMemo } from 'react';
import { AppTheme } from '@/constants/app-theme';
import { ThemedText } from '@/components/themed-text';
import { URL } from '@/config';

interface Model3DViewerProps {
  modelIds: string[];
}

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

function LoadingFallback() {
  return (
    <View style={styles.loadingContainer}>
      <DotsLoading />
      <ThemedText style={styles.loadingText}></ThemedText>
    </View>
  );
}

export function Model3DViewer({ modelIds }: Model3DViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const webViewRef = useRef<WebView>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const modelUrl = useMemo(() => {
    if (modelIds.length === 0) return null;
    return `${URL.BASE}/api/admin/3d-models/files/${modelIds[0]}_left.glb`;
  }, [modelIds]);

  // Fallback timeout - if model doesn't load in 5 seconds, show it anyway
  useEffect(() => {
    if (isLoading && modelUrl) {
      timeoutRef.current = setTimeout(() => {
        console.log('[Model3DViewer] Timeout - showing viewer anyway');
        setIsLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 5000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading, modelUrl]);

  // Handle message from WebView when model is loaded
  const handleMessage = (event: any) => {
    const message = event.nativeEvent.data;
    console.log('[Model3DViewer] Received message:', message);
    
    if (message === 'MODEL_LOADED') {
      console.log('[Model3DViewer] Model loaded, waiting 2 seconds...');
      // Clear the fallback timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Wait 2 seconds after model loads, then fade in
      setTimeout(() => {
        setIsLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 500);
    } else if (message === 'MODEL_ERROR') {
      console.log('[Model3DViewer] Model failed to load');
      // Clear the fallback timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Show error immediately
      setIsLoading(false);
    }
  };

  // HTML content with Three.js
  const htmlContent = useMemo(() => {
    if (!modelUrl) return '<html><body><p>No model available</p></body></html>';
    
    // Add timestamp to prevent caching
    const timestamp = Date.now();
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <title>3D Model Viewer - ${timestamp}</title>
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
  <script>
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0.1, 1.8); // Raised Y from 0.5 to 0.8 to look higher
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas: document.getElementById('canvas'),
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    
    // Enhanced Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    
    // Main directional light (key light) - stronger
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    
    // Fill light (softer, from opposite side)
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);
    
    // Rim light (from behind for edge highlights)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.5);
    rimLight.position.set(0, 3, -5);
    scene.add(rimLight);
    
    // Hemisphere light for natural ambient lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
    
    // Add point lights for extra sparkle
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
    scene.add(spotLight);
    
    // Load model
    const loader = new THREE.GLTFLoader();
    let model = null;
    let modelLoaded = false;
    
    console.log('Starting to load model from:', '${modelUrl}');
    
    loader.load(
      '${modelUrl}',
      function(gltf) {
        console.log('Model loaded successfully');
        model = gltf.scene;
        
        // Enhanced materials for better light reflection
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              // Enhanced material properties for better reflections
              child.material.envMapIntensity = 1.5;
              child.material.metalness = 0.2;
              child.material.roughness = 0.4;
              child.material.needsUpdate = true;
              
              // Ensure textures are properly loaded
              if (child.material.map) {
                child.material.map.encoding = THREE.sRGBEncoding;
                child.material.map.anisotropy = 16;
              }
            }
          }
        });
        
        // Center and scale model - make it much bigger
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.1 / maxDim; // Increased to 4.5 for much bigger display
        
        model.scale.set(scale, scale, scale);
        model.position.sub(center.multiplyScalar(scale));
        
        scene.add(model);
        modelLoaded = true;
        
        // Notify React Native that model is loaded
        console.log('Sending MODEL_LOADED message');
        try {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage('MODEL_LOADED');
            console.log('Message sent successfully');
          } else {
            console.log('ReactNativeWebView not available');
          }
        } catch (e) {
          console.error('Error sending message:', e);
        }
      },
      function(progress) {
        const percent = (progress.loaded / progress.total * 100).toFixed(2);
        console.log('Loading progress:', percent + '%');
      },
      function(error) {
        console.error('Error loading model:', error);
        // Send error message to React Native
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage('MODEL_ERROR');
        }
      }
    );
    
    // Animation
    function animate() {
      requestAnimationFrame(animate);
      
      if (model && modelLoaded) {
        model.rotation.y += 0.01;
      }
      
      renderer.render(scene, camera);
    }
    
    animate();
    
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
  }, [modelUrl]);

  if (isLoading) {
    return <LoadingFallback />;
  }



  return (
    <View style={styles.container}>
      {isLoading && <LoadingFallback />}
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
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
          onMessage={handleMessage}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('[Model3DViewer] WebView error:', nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('[Model3DViewer] HTTP error:', nativeEvent.statusCode, nativeEvent.url);
          }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  webview: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.secondary,
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
    fontSize: 12,
    color: AppTheme.colors.foreground,
    marginTop: 8,
  },
  errorContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.secondary,
  },
  errorText: {
    fontSize: 12,
    color: AppTheme.colors.error,
  },
});
