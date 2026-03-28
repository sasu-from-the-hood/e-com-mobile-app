import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Search, ShoppingCart, Package, HelpCircle, Home } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface HelpScreen {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
}

const helpData: HelpScreen[] = [
  {
    id: 1,
    title: 'Browse Products',
    description: 'Swipe through categories and discover amazing products',
    icon: Home,
    color: '#007AFF',
  },
  {
    id: 2,
    title: 'Search & Filter',
    description: 'Find exactly what you need with powerful search',
    icon: Search,
    color: '#34C759',
  },
  {
    id: 3,
    title: 'Add to Cart',
    description: 'Tap the cart icon to add items you love',
    icon: ShoppingCart,
    color: '#FF9500',
  },
  {
    id: 4,
    title: 'Track Orders',
    description: 'Monitor your orders in real-time from your profile',
    icon: Package,
    color: '#FF3B30',
  },
  {
    id: 5,
    title: 'Get Help',
    description: 'Need assistance? Visit Help & Support anytime',
    icon: HelpCircle,
    color: '#5856D6',
  },
];

interface HelpTutorialProps {
  visible: boolean;
  onClose: () => void;
}

export default function HelpTutorial({ visible, onClose }: HelpTutorialProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null);

  // Reset when modal opens
  useEffect(() => {
    if (visible) {
      setCurrentIndex(0);
      fadeAnim.setValue(1);
    }
  }, [visible]);

  // Auto-advance timer
  useEffect(() => {
    if (!visible) return;

    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
    }

    // Auto-advance every 4 seconds if not on last slide
    if (currentIndex < helpData.length - 1) {
      autoAdvanceTimer.current = setTimeout(() => {
        handleNext();
      }, 4000);
    }

    return () => {
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
      }
    };
  }, [visible, currentIndex]);

  const handleNext = () => {
    if (currentIndex < helpData.length - 1) {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(prev => prev + 1);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    try {
      setCurrentIndex(0);
      onClose();
    } catch (error) {
      console.error('Error closing help tutorial:', error);
    }
  };

  const handleDotPress = (index: number) => {
    // Stop auto-advance when user manually navigates
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
    }

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex(index);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  if (!visible) return null;

  const currentScreen = helpData[currentIndex];
  const IconComponent = currentScreen.icon;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Skip Button */}
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          {/* Content */}
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            {/* Icon */}
            <View style={[styles.iconContainer, { backgroundColor: currentScreen.color + '20' }]}>
              <IconComponent size={120} color={currentScreen.color} strokeWidth={1.5} />
            </View>

            {/* Title and Description */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{currentScreen.title}</Text>
              <Text style={styles.description}>{currentScreen.description}</Text>
            </View>
          </Animated.View>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {helpData.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleDotPress(index)}
                style={[
                  styles.dot,
                  index === currentIndex && styles.activeDot,
                ]}
              />
            ))}
          </View>

          {/* Next Button */}
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextText}>
              {currentIndex === helpData.length - 1 ? 'Got It!' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Function to check if help tutorial should be shown
export async function shouldShowHelpTutorial(): Promise<boolean> {
  return false; // Not used anymore - help is always accessible via icon
}

// Function to reset help tutorial (for testing)
export async function resetHelpTutorial(): Promise<void> {
  // Not needed anymore
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: 10,
    marginBottom: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007AFF',
    width: 24,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
