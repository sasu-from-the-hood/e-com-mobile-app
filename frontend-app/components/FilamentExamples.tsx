import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { FilamentScene, FilamentView, Model, Camera, DefaultLight } from 'react-native-filament';

// Basic static model viewer
export function BasicModelViewer({ modelSource }: { modelSource: any }) {
  return (
    <View style={styles.container}>
      <FilamentScene>
        <FilamentView style={styles.viewer}>
          <Camera />
          <DefaultLight />
          <Model source={modelSource} />
        </FilamentView>
      </FilamentScene>
    </View>
  );
}

// Animated rotating model
export function RotatingModelViewer({ modelSource }: { modelSource: any }) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 360,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  return (
    <View style={styles.container}>
      <FilamentScene>
        <FilamentView style={styles.viewer}>
          <Camera position={[0, 1, 3]} target={[0, 0, 0]} />
          <DefaultLight />
          <Model 
            source={modelSource}
            rotation={[0, rotation, 0]}
          />
        </FilamentView>
      </FilamentScene>
    </View>
  );
}

// Multiple models viewer
export function MultiModelViewer({ 
  models 
}: { 
  models: Array<{ source: any; position?: [number, number, number] }> 
}) {
  return (
    <View style={styles.container}>
      <FilamentScene>
        <FilamentView style={styles.viewer}>
          <Camera position={[0, 2, 5]} target={[0, 0, 0]} />
          <DefaultLight />
          {models.map((model, index) => (
            <Model
              key={index}
              source={model.source}
              position={model.position || [0, 0, 0]}
            />
          ))}
        </FilamentView>
      </FilamentScene>
    </View>
  );
}

// Interactive model with zoom animation
export function InteractiveModelViewer({ modelSource }: { modelSource: any }) {
  const zoom = useRef(new Animated.Value(5)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Zoom in animation
    Animated.sequence([
      Animated.timing(zoom, {
        toValue: 3,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(zoom, {
        toValue: 5,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 360,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  }, [zoom, rotation]);

  return (
    <View style={styles.container}>
      <FilamentScene>
        <FilamentView style={styles.viewer}>
          <Camera 
            position={[0, 1, zoom as any]}
            target={[0, 0, 0]}
          />
          <DefaultLight />
          <Model 
            source={modelSource}
            rotation={[0, rotation, 0]}
          />
        </FilamentView>
      </FilamentScene>
    </View>
  );
}

// Product showcase viewer (optimized for e-commerce)
export function ProductShowcaseViewer({ 
  modelSource,
  autoRotate = true,
  scale = 1
}: { 
  modelSource: any;
  autoRotate?: boolean;
  scale?: number;
}) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (autoRotate) {
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 360,
          duration: 12000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [autoRotate, rotation]);

  return (
    <View style={styles.container}>
      <FilamentScene>
        <FilamentView style={styles.viewer}>
          <Camera 
            position={[0, 0.5, 2.5]}
            target={[0, 0, 0]}
          />
          <DefaultLight />
          <Model 
            source={modelSource}
            rotation={autoRotate ? [0, rotation, 0] : undefined}
            scale={[scale, scale, scale]}
          />
        </FilamentView>
      </FilamentScene>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  viewer: {
    flex: 1,
  },
});
