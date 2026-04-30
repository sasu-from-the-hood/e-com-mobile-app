import { HoodieIllustration, DressIllustration, OutfitIllustration } from './onboarding-illustrations';

export interface OnboardingData {
  id: string;
  illustration: React.ComponentType;
  title: string;
  description: string;
  bgColor: string;
  blob1: string;
  blob2: string;
  accent: string;
  titleColor: string;
}

export const onboardingMockData: OnboardingData[] = [
  {
    id: '1',
    illustration: HoodieIllustration,
    title: 'Wear What Moves You',
    description: 'Explore thousands of curated styles — fresh drops, every single day.',
    bgColor: '#13103a',
    blob1: 'rgba(108,92,231,0.45)',
    blob2: 'rgba(83,74,183,0.28)',
    accent: '#534AB7',
    titleColor: '#EAE8FF',
  },
  {
    id: '2',
    illustration: DressIllustration,
    title: 'Deals That Hit Different',
    description: 'Flash sales, exclusive discounts, and member prices on top brands. Save big, look great.',
    bgColor: '#081a12',
    blob1: 'rgba(0,184,148,0.4)',
    blob2: 'rgba(0,210,168,0.22)',
    accent: '#00B894',
    titleColor: '#D4FFF5',
  },
  {
    id: '3',
    illustration: OutfitIllustration,
    title: 'Your Style, Your Rules',
    description: 'Mix, match, and discover outfits made for you. Smart picks based on what you love.',
    bgColor: '#1a0e25',
    blob1: 'rgba(225,112,85,0.4)',
    blob2: 'rgba(192,96,74,0.22)',
    accent: '#E17055',
    titleColor: '#FFE8E2',
  },
];
