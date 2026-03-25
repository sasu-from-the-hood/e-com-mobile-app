import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Map, Box, Navigation, Plus, Minus } from 'lucide-react-native';
import { AppTheme } from '@/constants/app-theme';

interface MapTypeControlsProps {
  mapType?: 'standard' | 'satellite';
  onMapTypeChange?: (type: 'standard' | 'satellite') => void;
  onLocationPress?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

export const MapTypeControls: React.FC<MapTypeControlsProps> = ({
  mapType = 'standard',
  onMapTypeChange,
  onLocationPress,
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <View style={styles.container}>
      {/* Zoom Controls */}
      {(onZoomIn || onZoomOut) && (
        <View style={[styles.controlGroup, { marginBottom: 12 }]}>
          {onZoomIn && (
            <>
              <TouchableOpacity
                style={[
                  styles.button,
                  { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
                ]}
                onPress={onZoomIn}
              >
                <Plus size={20} color={AppTheme.colors.foreground} />
              </TouchableOpacity>
              {onZoomOut && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: AppTheme.colors.border,
                  }}
                />
              )}
            </>
          )}
          {onZoomOut && (
            <TouchableOpacity
              style={[
                styles.button,
                { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
              ]}
              onPress={onZoomOut}
            >
              <Minus size={20} color={AppTheme.colors.foreground} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Map Type & Location Controls */}
      <View style={styles.controlGroup}>
        {/* Location - Top button */}
        {onLocationPress && (
          <>
            <TouchableOpacity
              style={[
                styles.button,
                { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
              ]}
              onPress={onLocationPress}
            >
              <Navigation
                size={16}
                color={AppTheme.colors.foreground}
                fill={AppTheme.colors.foreground}
              />
            </TouchableOpacity>
            {onMapTypeChange && (
              <View
                style={{
                  height: 1,
                  backgroundColor: AppTheme.colors.border,
                }}
              />
            )}
          </>
        )}

        {/* Map Type Switcher */}
        {onMapTypeChange && (
          <>
            <TouchableOpacity
              style={[
                styles.button,
                !onLocationPress && {
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                },
                mapType === 'standard' && { backgroundColor: AppTheme.colors.primary },
              ]}
              onPress={() => onMapTypeChange('standard')}
            >
              <Map
                size={20}
                color={
                  mapType === 'standard'
                    ? AppTheme.colors.primaryForeground
                    : AppTheme.colors.foreground
                }
              />
            </TouchableOpacity>
            <View
              style={{
                height: 1,
                backgroundColor: AppTheme.colors.border,
              }}
            />
            <TouchableOpacity
              style={[
                styles.button,
                { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                mapType === 'satellite' && { backgroundColor: AppTheme.colors.primary },
              ]}
              onPress={() => onMapTypeChange('satellite')}
            >
              <Box
                size={20}
                color={
                  mapType === 'satellite'
                    ? AppTheme.colors.primaryForeground
                    : AppTheme.colors.foreground
                }
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    top: '60%',
    transform: [{ translateY: -100 }],
  },
  controlGroup: {
    flexDirection: 'column',
    borderRadius: 8,
    backgroundColor: AppTheme.colors.background,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  button: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
