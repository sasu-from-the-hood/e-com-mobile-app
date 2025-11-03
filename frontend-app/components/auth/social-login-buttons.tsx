import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AppTheme } from '@/constants/app-theme';

export interface SocialLoginButtonsProps {
  onGooglePress: () => void;
  onFacebookPress: () => void;
}

export function SocialLoginButtons({ onGooglePress, onFacebookPress }: SocialLoginButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={onGooglePress} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.facebookButton]} onPress={onFacebookPress} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Sign in with Facebook</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: AppTheme.spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: AppTheme.spacing.md,
    borderRadius: AppTheme.borderRadius.md,
    ...AppTheme.shadows.small,
  },
  googleButton: {
    backgroundColor: AppTheme.colors.socialGoogle,
  },
  facebookButton: {
    backgroundColor: AppTheme.colors.socialFacebook,
  },
  buttonText: {
    color: AppTheme.colors.primaryForeground,
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
  },
});