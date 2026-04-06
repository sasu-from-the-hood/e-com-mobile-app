import { View, StyleSheet, Animated } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useState, useEffect, useRef } from 'react';
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
    </View>
  );
}

export function Model3DViewer({ modelIds }: Model3DViewerProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modelUrl, setModelUrl] = useState<string>('');

  useEffect(() => {
    const fetchModelUrl = async () => {
      try {
        console.log('[Model3DViewer] Fetching model URL for IDs:', modelIds);
        setLoading(true);
        setError(null);
        
        if (modelIds.length === 0) {
          throw new Error('No model IDs provided');
        }
        
        // Use first model
        const url = `${URL.BASE}/api/admin/3d-models/files/${modelIds[0]}_left.glb`;
        console.log('[Model3DViewer] Generated URL:', url);
        setModelUrl(url);
        setLoading(false);
      } catch (err) {
        console.error('[Model3DViewer] Failed to fetch model URL:', err);
        setError(err instanceof Error ? err.message : 'Failed to load model');
        setLoading(false);
      }
    };

    fetchModelUrl();
  }, [modelIds]);

  const onContextCreate = async (gl: any) => {
    try {
      console.log('[Model3DViewer] GL context created, initializing scene');
      
      // Create renderer
      const renderer = new Renderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      console.log('[Model3DViewer] Renderer created');

      // Create scene
      const scene = new THREE.Scene();
      
      // Create camera
      const camera = new THREE.PerspectiveCamera(
        50,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 3);
      console.log('[Model3DViewer] Scene and camera created');

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight1.position.set(5, 5, 5);
      scene.add(directionalLight1);
      
      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
      directionalLight2.position.set(-5, -5, -5);
      scene.add(directionalLight2);
      console.log('[Model3DViewer] Lights added');

      // Load GLB model
      console.log('[Model3DViewer] Loading GLB from:', modelUrl);
      const loader = new GLTFLoader();
      
      loader.load(
        modelUrl,
        (gltf) => {
          console.log('[Model3DViewer] GLB loaded successfully');
          const model = gltf.scene;
          model.scale.set(0.8, 0.8, 0.8);
          scene.add(model);
          console.log('[Model3DViewer] Model added to scene');
        },
        (progress) => {
          console.log('[Model3DViewer] Loading progress:', (progress.loaded / progress.total * 100).toFixed(2) + '%');
        },
        (error) => {
          console.error('[Model3DViewer] Error loading GLB:', error);
          setError('Failed to load 3D model file');
        }
      );

      // Animation loop
      const render = () => {
        requestAnimationFrame(render);
        
        // Rotate model slowly
        if (scene.children.length > 3) { // lights + model
          scene.children[3].rotation.y += 0.01;
        }
        
        renderer.render(scene, camera);
        gl.endFrameEXP();
      };
      render();
      
      console.log('[Model3DViewer] Render loop started');
    } catch (err) {
      console.error('[Model3DViewer] GL context error:', err);
      setError('Failed to initialize 3D viewer');
    }
  };

  if (loading) {
    console.log('[Model3DViewer] Showing loading state');
    return <LoadingFallback />;
  }

  if (error) {
    console.error('[Model3DViewer] Error state:', error);
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </View>
    );
  }

  console.log('[Model3DViewer] Rendering GLView');
  return (
    <View style={styles.container}>
      <GLView
        style={styles.glView}
        onContextCreate={onContextCreate}
      />
      <View style={styles.hint}>
        <ThemedText style={styles.hintText}>Auto-rotating</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  glView: {
    width: '100%',
    height: '100%',
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
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: AppTheme.colors.primary,
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
  hint: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hintText: {
    fontSize: 10,
    color: '#fff',
  },
});
