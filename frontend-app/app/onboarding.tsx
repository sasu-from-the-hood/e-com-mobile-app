import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { onboardingMockData } from '@/components/onboarding/onboarding-mock-data';

const ONBOARDING_SHOWN_KEY = 'onboarding_shown';

export default function OnboardingRoute() {
  const router = useRouter();

  // Mark onboarding as shown when component mounts
  useEffect(() => {
    const markOnboardingAsShown = async () => {
      try {
        await AsyncStorage.setItem(ONBOARDING_SHOWN_KEY, 'true');
        console.log('[Onboarding] Marked as shown');
      } catch (error) {
        console.error('[Onboarding] Failed to mark as shown:', error);
      }
    };

    markOnboardingAsShown();
  }, []);

  const handleCreateAccount = () => {
    router.push('/auth/signup');
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <OnboardingScreen
      data={onboardingMockData}
      onCreateAccount={handleCreateAccount}
      onLogin={handleLogin}
    />
  );
}