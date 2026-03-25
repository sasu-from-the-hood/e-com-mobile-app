import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Device size breakpoints
export const BREAKPOINTS = {
  tiny: 350,
  small: 375,
  medium: 768,
  large: 1024,
};

// Device type checks
export const isSmallDevice = width < BREAKPOINTS.small;
export const isTinyDevice = width < BREAKPOINTS.tiny;
export const isMediumDevice = width >= BREAKPOINTS.small && width < BREAKPOINTS.medium;
export const isLargeDevice = width >= BREAKPOINTS.medium;
export const isTablet = width >= BREAKPOINTS.medium;

// Responsive spacing
export const getResponsiveSpacing = (base: number) => {
  if (isTinyDevice) return base * 0.7;
  if (isSmallDevice) return base * 0.85;
  if (isLargeDevice) return base * 1.2;
  return base;
};

// Responsive font size
export const getResponsiveFontSize = (base: number) => {
  if (isTinyDevice) return base * 0.85;
  if (isSmallDevice) return base * 0.9;
  if (isLargeDevice) return base * 1.1;
  return base;
};

// Responsive padding
export const getResponsivePadding = () => {
  if (isTinyDevice) return 12;
  if (isSmallDevice) return 16;
  if (isLargeDevice) return width * 0.1;
  return 20;
};

// Max content width for large screens
export const getMaxContentWidth = () => {
  if (isLargeDevice) return 600;
  return '100%';
};

// Screen dimensions
export const screenWidth = width;
export const screenHeight = height;
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
