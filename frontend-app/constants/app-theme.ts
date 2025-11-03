export const AppTheme = {
  colors: {
    primary: '#5B4CCC',
    primaryForeground: '#FFFFFF',
    secondary: '#F5F5F5',
    secondaryForeground: '#000000',
    background: '#FFFFFF',
    foreground: '#000000',
    muted: '#9E9E9E',
    mutedForeground: '#757575',
    accent: '#5B4CCC',
    accentForeground: '#FFFFFF',
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
    border: '#E0E0E0',
    input: '#F5F5F5',
    ring: '#5B4CCC',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
    error: '#EF4444',
    mapPrimary: '#5B4CCC',
    mapSecondary: '#8B7FE8',
    statusPlaced: '#9E9E9E',
    statusProcessing: '#F59E0B',
    statusShipped: '#3B82F6',
    statusDelivered: '#10B981',
    notificationUnread: '#EEF2FF',
    socialGoogle: '#DB4437',
    socialFacebook: '#4267B2'
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const
  }
};