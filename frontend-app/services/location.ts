import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
}

export const getCurrentLocation = async (): Promise<LocationData | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    const address = reverseGeocode[0];
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      city: address?.city || '',
      state: address?.region || '',
      country: address?.country || 'Ethiopia',
    };
  } catch (error) {
    console.error('Location error:', error);
    return null;
  }
};