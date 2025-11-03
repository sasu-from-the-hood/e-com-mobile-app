import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/onboarding/primary-button';
import { AppTheme } from '@/constants/app-theme';
import { X } from 'lucide-react-native';

interface MapPickerProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (latitude: number, longitude: number) => void;
  initialLatitude?: number;
  initialLongitude?: number;
}

export function MapPicker({ 
  visible, 
  onClose, 
  onLocationSelect, 
  initialLatitude = 9.0320, 
  initialLongitude = 38.7469 
}: MapPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: initialLatitude,
    longitude: initialLongitude,
  });

  const initialRegion: Region = {
    latitude: initialLatitude,
    longitude: initialLongitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleConfirm = () => {
    onLocationSelect(selectedLocation.latitude, selectedLocation.longitude);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Select Location</ThemedText>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={AppTheme.colors.foreground} />
          </TouchableOpacity>
        </View>
        
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          onPress={handleMapPress}
        >
          <Marker coordinate={selectedLocation} />
        </MapView>
        
        <View style={styles.footer}>
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
  },
});