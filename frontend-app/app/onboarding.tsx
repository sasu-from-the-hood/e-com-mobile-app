import { useRouter } from 'expo-router';
import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { onboardingMockData } from '@/components/onboarding/onboarding-mock-data';

export default function OnboardingRoute() {
  const router = useRouter();

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