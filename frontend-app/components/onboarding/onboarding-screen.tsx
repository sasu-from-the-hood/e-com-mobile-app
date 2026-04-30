import { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Animated,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { OnboardingSlide } from './onboarding-slide';
import type { OnboardingData } from './onboarding-mock-data';
import { AppTheme } from '@/constants/app-theme';

const { width } = Dimensions.get('window');
const PRIMARY = AppTheme.colors.primary;
const AUTO_SCROLL_INTERVAL = 3500;

export interface OnboardingScreenProps {
  data: OnboardingData[];
  onCreateAccount: () => void;
  onLogin: () => void;
}

export function OnboardingScreen({ data, onCreateAccount, onLogin }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentIndexRef = useRef(0);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      const idx = viewableItems[0].index;
      setCurrentIndex(idx);
      currentIndexRef.current = idx;
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const isLast = currentIndex === data.length - 1;

  const goToNext = () => {
    const next = (currentIndexRef.current + 1) % data.length;
    slidesRef.current?.scrollToIndex({ index: next, animated: true });
  };

  // Auto-scroll
  useEffect(() => {
    timerRef.current = setInterval(goToNext, AUTO_SCROLL_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Reset timer on manual scroll
  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goToNext, AUTO_SCROLL_INTERVAL);
  };

  const handleNext = () => {
    resetTimer();
    if (isLast) {
      onCreateAccount();
    } else {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: data[currentIndex].bgColor }]} edges={['top']}>
      <SafeAreaView style={styles.inner} edges={['bottom']}>
        <StatusBar style="light" />

      <View style={styles.slidesWrap}>
        <FlatList
          data={data}
          renderItem={({ item }) => <OnboardingSlide item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          onScrollBeginDrag={resetTimer}
          ref={slidesRef}
        />

        {/* Dots — bottom-right of slide area */}
        <View style={styles.dotsWrap}>
          {data.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [6, 22, 6],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[styles.dot, { width: dotWidth, opacity, backgroundColor: PRIMARY }]}
              />
            );
          })}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: PRIMARY }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>{isLast ? 'Get Started' : 'Next'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onLogin} style={styles.link} activeOpacity={0.7}>
          <Text style={[styles.linkText, { color: PRIMARY }]}>
            Already Have an Account
          </Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slidesWrap: {
    flex: 1,
  },
  dotsWrap: {
    position: 'absolute',
    bottom: 36,
    right: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  footer: {
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#fff',
    gap: 10,
  },
  btn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  link: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
