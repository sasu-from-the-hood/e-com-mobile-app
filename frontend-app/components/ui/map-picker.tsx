import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/onboarding/primary-button';
import { MapComponent, MapRef } from '@/components/map/MapComponent';
import { AppTheme } from '@/constants/app-theme';
import { X } from 'lucide-react-native';

interface MapPickerProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (latitude: number, longitude: number) => void;
  initialLatitude?: number;
  initialLongitude?: number;
}

const MAP_ZOOM_KEY = '@map_picker_zoom_level';
const MAP_CENTER_KEY = '@map_picker_center';

export function MapPicker({ 
  visible, 
  onClose, 
  onLocationSelect, 
  initialLatitude = 9.0320, 
  initialLongitude = 38.7469 
}: MapPickerProps) {
  const mapRef = useRef<MapRef>(null);
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: initialLatitude,
    longitude: initialLongitude,
  });
  const [savedZoom, setSavedZoom] = useState<number>(15);
  const [savedCenter, setSavedCenter] = useState({
    latitude: initialLatitude,
    longitude: initialLongitude,
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Load saved zoom level and center on mount, or get current location
  useEffect(() => {
    const loadMapSettings = async () => {
      try {
        const [zoom, center] = await Promise.all([
          AsyncStorage.getItem(MAP_ZOOM_KEY),
          AsyncStorage.getItem(MAP_CENTER_KEY),
        ]);
        
        if (zoom) {
          setSavedZoom(parseFloat(zoom));
        }
        
        // If we have a saved center, use it
        if (center) {
          const parsedCenter = JSON.parse(center);
          setSavedCenter(parsedCenter);
          setSelectedLocation(parsedCenter);
          setIsLoadingLocation(false);
        } else {
          // Otherwise, get current location
          try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
              const currentLocation = await Location.getCurrentPositionAsync({});
              const currentCenter = {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
              };
              setSavedCenter(currentCenter);
              setSelectedLocation(currentCenter);
            }
          } catch (error) {
            console.log('Error getting current location:', error);
          } finally {
            setIsLoadingLocation(false);
          }
        }
      } catch (error) {
        console.log('Error loading map settings:', error);
        setIsLoadingLocation(false);
      }
    };
    loadMapSettings();
  }, []);

  // Save zoom level when map is interacted with
  const handleZoomChange = async (zoom: number) => {
    try {
      await AsyncStorage.setItem(MAP_ZOOM_KEY, zoom.toString());
      setSavedZoom(zoom);
    } catch (error) {
      console.log('Error saving zoom level:', error);
    }
  };

  // Save camera center position
  const handleCenterChange = async (center: { latitude: number; longitude: number }) => {
    try {
      await AsyncStorage.setItem(MAP_CENTER_KEY, JSON.stringify(center));
      setSavedCenter(center);
    } catch (error) {
      console.log('Error saving center position:', error);
    }
  };

  const handleMapPress = (coordinate: { latitude: number; longitude: number }) => {
    setSelectedLocation(coordinate);
    
    // Fly to the selected location with smooth animation
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [coordinate.longitude, coordinate.latitude],
        zoom: mapRef.current.getZoom(), // Keep current zoom level
      });
      
      // Save current zoom and center when location is selected
      const currentZoom = mapRef.current.getZoom();
      handleZoomChange(currentZoom);
      handleCenterChange(coordinate);
    }
  };

  const handleConfirm = () => {
    onLocationSelect(selectedLocation.latitude, selectedLocation.longitude);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Select Location</ThemedText>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={AppTheme.colors.foreground} />
          </TouchableOpacity>
        </View>
        
        {!isLoadingLocation && (
          <MapComponent
            ref={mapRef}
            style={styles.map}
            onMapPress={handleMapPress}
            initialRegion={{
              latitude: savedCenter.latitude,
              longitude: savedCenter.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            initialZoom={savedZoom}
            destination={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
              title: 'Selected Location',
            }}
            showControls={true}
            disableAutoCenter={true}
            hideCurrentLocation={true}
            onZoomChange={handleZoomChange}
            onCenterChange={handleCenterChange}
          />
        )}
        
        <View style={styles.footer}>
          <ThemedText style={styles.coordinates}>
            Lat: {selectedLocation.latitude.toFixed(6)}, Lng: {selectedLocation.longitude.toFixed(6)}
          </ThemedText>
          <PrimaryButton title="Confirm Location" onPress={handleConfirm} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: AppTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  title: {
    fontSize: AppTheme.fontSize.xl,
    fontWeight: AppTheme.fontWeight.bold,
  },
  map: {
    flex: 1,
  },
  footer: {
    padding: AppTheme.spacing.md,
    gap: AppTheme.spacing.sm,
  },
  coordinates: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
    textAlign: 'center',
  },
});
