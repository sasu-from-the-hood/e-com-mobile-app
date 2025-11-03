import { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Animated,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { OnboardingSlide } from './onboarding-slide';
import { PaginationDots } from './pagination-dots';
import { PrimaryButton } from './primary-button';
import { TextLink } from './text-link';
import type { OnboardingData } from './onboarding-mock-data';

const { width } = Dimensions.get('window');

export interface OnboardingScreenProps {
  data: OnboardingData[];
  onCreateAccount: () => void;
  onLogin: () => void;
}

export function OnboardingScreen({ data, onCreateAccount, onLogin }: OnboardingScreenProps) {
  const [, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <OnboardingSlide
              image={item.image}
              title={item.title}
              description={item.description}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={handleScroll}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <View style={styles.footer}>
        <PaginationDots data={data} scrollX={scrollX} />
        
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Create Account"
            onPress={onCreateAccount}
          />
          <TextLink
            title="Already Have an Account"
            onPress={onLogin}
            style={styles.linkContainer}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  buttonContainer: {
    gap: 16,
  },
  linkContainer: {
    marginTop: 8,
  },
});