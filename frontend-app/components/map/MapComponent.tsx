import React, { useRef, useImperativeHandle, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { MapTypeControls } from './MapTypeControls';

export interface MapRef {
  flyTo: (options: { center: [number, number]; zoom?: number }) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  getCenter: () => { latitude: number; longitude: number };
  getZoom: () => number;
}

interface MapComponentProps {
  style?: any;
  destination?: {
    latitude: number;
    longitude: number;
    title?: string;
  } | null;
  pickupLocation?: {
    latitude: number;
    longitude: number;
    title?: string;
  };
  onMapPress?: (coordinate: { latitude: number; longitude: number }) => void;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  showControls?: boolean;
}

export const MapComponent = React.memo(
  React.forwardRef<MapRef, MapComponentProps>(
    (
      {
        style,
        destination = null,
        pickupLocation,
        onMapPress,
        initialRegion,
        showControls = true,
      },
      ref
    ) => {
      const webViewRef = useRef<WebView>(null);
      const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
      const [location, setLocation] = useState(
        initialRegion
          ? { latitude: initialRegion.latitude, longitude: initialRegion.longitude }
          : { latitude: 9.03, longitude: 38.74 } // Default to Addis Ababa
      );

      useEffect(() => {
        (async () => {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log('Location permission denied');
            return;
          }

          const currentLocation = await Location.getCurrentPositionAsync({});
          setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });
        })();
      }, []);

      useImperativeHandle(ref, () => ({
        flyTo: (options: { center: [number, number]; zoom?: number }) => {
          webViewRef.current?.injectJavaScript(`
            if (window.map) {
              window.map.flyTo({
                center: [${options.center[0]}, ${options.center[1]}],
                zoom: ${options.zoom || 15}
              });
            }
            true;
          `);
        },
        zoomIn: () => {
          webViewRef.current?.injectJavaScript(`
            if (window.map) {
              window.map.zoomIn();
            }
            true;
          `);
        },
        zoomOut: () => {
          webViewRef.current?.injectJavaScript(`
            if (window.map) {
              window.map.zoomOut();
            }
            true;
          `);
        },
        getCenter: () => location,
        getZoom: () => 12,
      }));

      const handleMapTypeChange = (type: 'standard' | 'satellite') => {
        setMapType(type);
        
        if (type === 'satellite') {
          // Switch to 3D view with smooth animation
          webViewRef.current?.injectJavaScript(`
            if (window.map) {
              window.map.easeTo({ 
                pitch: 60, 
                bearing: -20, 
                duration: 1000,
                easing: function(t) { return t * (2 - t); }
              });
            }
            true;
          `);
        } else {
          // Switch to flat view with smooth animation
          webViewRef.current?.injectJavaScript(`
            if (window.map) {
              window.map.easeTo({ 
                pitch: 0, 
                bearing: 0, 
                duration: 1000,
                easing: function(t) { return t * (2 - t); }
              });
            }
            true;
          `);
        }
      };

      const handleLocationPress = () => {
        webViewRef.current?.injectJavaScript(`
          if (window.map) {
            window.map.flyTo({
              center: [${location.longitude}, ${location.latitude}],
              zoom: 15
            });
          }
          true;
        `);
      };

      const handleZoomIn = () => {
        webViewRef.current?.injectJavaScript(`
          if (window.map) {
            window.map.zoomIn();
          }
          true;
        `);
      };

      const handleZoomOut = () => {
        webViewRef.current?.injectJavaScript(`
          if (window.map) {
            window.map.zoomOut();
          }
          true;
        `);
      };

      // Create markers GeoJSON
      const markers = [];
      
      // Add user location marker
      markers.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
        properties: {
          color: '#4285F4',
          size: 12,
          title: 'Your Location',
        },
      });

      // Add destination marker if provided
      if (destination) {
        markers.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [destination.longitude, destination.latitude],
          },
          properties: {
            color: '#EA4335',
            size: 12,
            title: destination.title || 'Destination',
          },
        });
      }

      // Add pickup location marker if provided (green)
      if (pickupLocation) {
        markers.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [pickupLocation.longitude, pickupLocation.latitude],
          },
          properties: {
            color: '#4CAF50',
            size: 14,
            title: pickupLocation.title || 'Pickup Location',
          },
        });
      }

      const markersGeoJSON = {
        type: 'FeatureCollection',
        features: markers,
      };

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset='utf-8'>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel='stylesheet' href='https://unpkg.com/maplibre-gl@5.21.0/dist/maplibre-gl.css' />
          <script src='https://unpkg.com/maplibre-gl@5.21.0/dist/maplibre-gl.js'></script>
          <style>
            body { margin: 0; padding: 0; }
            html, body, #map { height: 100%; }
            .maplibregl-ctrl-bottom-left,
            .maplibregl-ctrl-bottom-right,
            .maplibregl-ctrl-attrib,
            .maplibregl-compact {
              display: none !important;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            window.map = new maplibregl.Map({
              container: 'map',
              style: 'https://tiles.openfreemap.org/styles/liberty',
              center: [${location.longitude}, ${location.latitude}],
              zoom: 15,
              pitch: ${mapType === 'satellite' ? 60 : 0},
              bearing: ${mapType === 'satellite' ? -20 : 0}
            });

            window.map.on('load', () => {
              // Add markers
              const markersData = ${JSON.stringify(markersGeoJSON)};
              
              window.map.addSource('markers', {
                type: 'geojson',
                data: markersData
              });

              window.map.addLayer({
                id: 'markers',
                type: 'circle',
                source: 'markers',
                paint: {
                  'circle-radius': ['get', 'size'],
                  'circle-color': ['get', 'color'],
                  'circle-stroke-width': 2,
                  'circle-stroke-color': '#FFFFFF'
                }
              });
            });

            window.map.on('click', (e) => {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'mapPress',
                  latitude: e.lngLat.lat,
                  longitude: e.lngLat.lng
                }));
              }
            });
          </script>
        </body>
        </html>
      `;

      return (
        <View style={[styles.container, style]}>
          <WebView
            ref={webViewRef}
            source={{ html: htmlContent }}
            style={styles.map}
            pointerEvents="auto"
            scrollEnabled={false}
            onMessage={(event: any) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                if (data.type === 'mapPress' && onMapPress) {
                  onMapPress({
                    latitude: data.latitude,
                    longitude: data.longitude,
                  });
                }
              } catch (e) {
                console.error('Error parsing WebView message:', e);
              }
            }}
          />

          {/* Map Controls */}
          {showControls && (
            <MapTypeControls
              mapType={mapType}
              onMapTypeChange={handleMapTypeChange}
              onLocationPress={handleLocationPress}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
            />
          )}
        </View>
      );
    }
  ),
  (prevProps, nextProps) => {
    const destinationEqual =
      JSON.stringify(prevProps.destination) === JSON.stringify(nextProps.destination);
    const pickupEqual =
      JSON.stringify(prevProps.pickupLocation) === JSON.stringify(nextProps.pickupLocation);
    return destinationEqual && pickupEqual;
  }
);

MapComponent.displayName = 'MapComponent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
});
