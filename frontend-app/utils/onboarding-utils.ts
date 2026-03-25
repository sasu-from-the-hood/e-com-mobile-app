import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_SHOWN_KEY = 'onboarding_shown';

/**
 * Reset the onboarding flag so it shows again on next app launch
 * Useful for testing or when user wants to see onboarding again
 */
export async function resetOnboarding(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ONBOARDING_SHOWN_KEY);
    console.log('[OnboardingUtils] Onboarding flag reset');
  } catch (error) {
    console.error('[OnboardingUtils] Failed to reset onboarding:', error);
  }
}

/**
 * Check if onboarding has been shown before
 */
export async function hasOnboardingBeenShown(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_SHOWN_KEY);
    return value === 'true';
  } catch (error) {
    console.error('[OnboardingUtils] Failed to check onboarding status:', error);
    return false;
  }
}

/**
 * Mark onboarding as shown
 */
export async function markOnboardingAsShown(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_SHOWN_KEY, 'true');
    console.log('[OnboardingUtils] Onboarding marked as shown');
  } catch (error) {
    console.error('[OnboardingUtils] Failed to mark onboarding as shown:', error);
  }
}
