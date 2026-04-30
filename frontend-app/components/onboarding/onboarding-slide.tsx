import { View, Text, StyleSheet, Dimensions } from 'react-native';
import type { OnboardingData } from './onboarding-mock-data';

const { width, height } = Dimensions.get('window');
const SCENE_HEIGHT = height * 0.72; // full top coverage

interface OnboardingSlideProps {
  item: OnboardingData;
}

export function OnboardingSlide({ item }: OnboardingSlideProps) {
  const Illustration = item.illustration;

  return (
    <View style={[styles.container, { width }]}>
      {/* Dark scene — fills top of screen */}
      <View style={[styles.scene, { backgroundColor: item.bgColor }]}>
        <View style={[styles.blob, styles.blobTL, { backgroundColor: item.blob1 }]} />
        <View style={[styles.blob, styles.blobBR, { backgroundColor: item.blob2 }]} />
        <View style={styles.svgWrap}>
          <Illustration />
        </View>
      </View>

      {/* White card — subtle curve, overlaps scene */}
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  scene: {
    width,
    height: SCENE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobTL: {
    width: width * 0.7,
    height: width * 0.7,
    top: -width * 0.12,
    left: -width * 0.14,
    opacity: 0.85,
  },
  blobBR: {
    width: width * 0.55,
    height: width * 0.55,
    bottom: -width * 0.08,
    right: -width * 0.08,
    opacity: 0.7,
  },
  svgWrap: {
    zIndex: 2,
  },
  // White card: very subtle curve — borderRadius 6 on top corners only
  card: {
    width,
    backgroundColor: '#fff',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    marginTop: -6,
    paddingHorizontal: 28,
    paddingTop: 22,
    paddingBottom: 8,
    zIndex: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
    lineHeight: 30,
    letterSpacing: -0.3,
    paddingRight: 12,
  },
  description: {
    fontSize: 13.5,
    lineHeight: 22,
    color: '#888',
  },
});
