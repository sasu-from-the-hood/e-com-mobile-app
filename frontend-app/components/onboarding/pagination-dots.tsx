import { View, StyleSheet, Animated } from 'react-native';

export interface PaginationDotsProps {
  data: any[];
  scrollX: Animated.Value;
  dotSize?: number;
  activeDotColor?: string;
  inactiveDotColor?: string;
}

export function PaginationDots({
  data,
  scrollX,
  dotSize = 8,
  activeDotColor = '#5B4CCC',
  inactiveDotColor = '#E0E0E0',
}: PaginationDotsProps) {
  return (
    <View style={styles.container}>
      {data.map((_, index) => {
        const inputRange = [(index - 1) * 375, index * 375, (index + 1) * 375];
        
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [dotSize, dotSize * 2, dotSize],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: dotWidth,
                height: dotSize,
                backgroundColor: activeDotColor,
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 24,
  },
  dot: {
    borderRadius: 4,
  },
});