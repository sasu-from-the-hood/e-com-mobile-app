export interface OnboardingData {
  id: string;
  image: any;
  title: string;
  description: string;
}

export const onboardingMockData: OnboardingData[] = [
  {
    id: '1',
    image: require('@/assets/images/onboarding-slide-1.jpg'),
    title: 'Various Collections Of The Latest Products',
    description: 'Urna amet, suspendisse ullamcorper ac elit diam facilisis cursus vestibulum.',
  },
  {
    id: '2',
    image: require('@/assets/images/onboarding-slide-2.jpg'),
    title: 'Discover Amazing Deals',
    description: 'Browse through our curated selection of premium products at unbeatable prices.',
  },
  {
    id: '3',
    image: require('@/assets/images/onboarding-slide-3.jpg'),
    title: 'Shop With Confidence',
    description: 'Secure checkout and fast delivery to your doorstep. Start shopping today!',
  },
];