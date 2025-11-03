import { View, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export interface OnboardingSlideProps {
  image: any;
  title: string;
  description: string;
}

export function OnboardingSlide({ image, title, description }: OnboardingSlideProps) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={image}
        style={styles.imageContainer}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0.8)', '#FFFFFF']}
          locations={[0, 0.4, 0.7, 1]}
          style={styles.gradient}
        />
      </ImageBackground>
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {title}
        </Text>
        <Text style={styles.description}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    width: width,
    height: width,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#F5F5F5',
  },

  gradient: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
    color: '#000000',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    color: '#757575',
  },
});