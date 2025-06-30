import { Dimensions, PixelRatio } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Base dimensions (iPhone 12 Pro - 390x844)
const baseWidth = 390;
const baseHeight = 844;

// Scale factor based on screen width
export const scale = screenWidth / baseWidth;

// Responsive font size
export const responsiveFontSize = (size: number): number => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Responsive width
export const responsiveWidth = (width: number): number => {
  return Math.round(PixelRatio.roundToNearestPixel(width * scale));
};

// Responsive height
export const responsiveHeight = (height: number): number => {
  return Math.round(PixelRatio.roundToNearestPixel(height * scale));
};

// Responsive padding/margin
export const responsiveSize = (size: number): number => {
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

// Screen dimensions
export const screenDimensions = {
  width: screenWidth,
  height: screenHeight,
  scale,
};

// Device type detection
export const isSmallDevice = screenWidth < 375;
export const isMediumDevice = screenWidth >= 375 && screenWidth < 414;
export const isLargeDevice = screenWidth >= 414;

// Responsive spacing
export const spacing = {
  xs: responsiveSize(4),
  sm: responsiveSize(8),
  md: responsiveSize(12),
  lg: responsiveSize(16),
  xl: responsiveSize(20),
  xxl: responsiveSize(24),
  xxxl: responsiveSize(32),
};

// Responsive font sizes
export const fontSizes = {
  xs: responsiveFontSize(12),
  sm: responsiveFontSize(14),
  md: responsiveFontSize(16),
  lg: responsiveFontSize(18),
  xl: responsiveFontSize(20),
  xxl: responsiveFontSize(24),
  xxxl: responsiveFontSize(28),
  huge: responsiveFontSize(32),
};

// Responsive border radius
export const borderRadius = {
  sm: responsiveSize(8),
  md: responsiveSize(12),
  lg: responsiveSize(16),
  xl: responsiveSize(20),
  xxl: responsiveSize(24),
}; 