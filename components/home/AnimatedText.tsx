import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window'); // Get screen width for animation

interface AnimatedTextProps {
  message: string; // Now takes a single message string
  style?: any; // Style for the container View
  textStyle?: any; // Style for the Animated.Text
  speed?: number; // Speed of the scroll (pixels per millisecond, e.g., 0.03 for slower)
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ message, style, textStyle, speed = 0.03 }) => {
  const translateX = useRef(new Animated.Value(screenWidth)).current; // Start off-screen right
  const [textWidth, setTextWidth] = useState(0);
  const animationRef = useRef(null); // Ref to hold the animation instance

  useEffect(() => {
    if (!message || textWidth === 0) {
      // Don't start animation if no message or text width not measured yet
      return;
    }

    // Stop any previous animation before starting a new one
    if (animationRef.current) {
      animationRef.current.stop();
    }

    const startScrolling = () => {
      translateX.setValue(screenWidth); // Reset position to off-screen right

      // Animate from right edge of screen to completely off-screen left
      animationRef.current = Animated.timing(translateX, {
        toValue: -textWidth, // Move past the left edge by the text's width
        duration: (screenWidth + textWidth) / speed, // Duration based on total distance and speed
        useNativeDriver: true,
        easing: (t) => t, // Linear easing for constant speed
      });

      // Loop the animation infinitely
      Animated.loop(animationRef.current).start();
    };

    startScrolling(); // Start the animation

    // Cleanup function: stop animation when component unmounts or dependencies change
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      translateX.stopAnimation(); // Ensure the animated value stops updating
    };
  }, [message, textWidth, screenWidth, speed]); // Re-run effect if message or textWidth changes

  // Measure the width of the text content once it's rendered
  const onTextLayout = (event) => {
    // Only update if the width is different to prevent unnecessary re-renders/animation restarts
    if (textWidth !== event.nativeEvent.layout.width) {
      setTextWidth(event.nativeEvent.layout.width);
    }
  };

  if (!message) {
    return null; // Don't render if no message is provided
  }

  return (
    <View style={[styles.container, style]}>
      {/* The Animated.Text needs to be positioned absolutely within the overflow: hidden container */}
      <Animated.Text
        onLayout={onTextLayout} // Attach onLayout to measure text width
        style={[
          styles.text,
          textStyle,
          {
            transform: [{ translateX: translateX }],
            // Set a large enough width to prevent text wrapping,
            // this will be overridden by onLayout if textWidth is greater
            width: textWidth > 0 ? textWidth : 'auto',
          },
        ]}
      >
        {message}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden', // Crucial: hides content that moves outside the container
    height: 50, // Fixed height to prevent collapse before text measurement
    justifyContent: 'center', // Center text vertically within the container
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    position: 'static', // Allows translation outside normal flow
    paddingHorizontal: 5, // Small padding for text content
    flexShrink: 0, // Prevent text from shrinking and forcing wrap
  }
});

export default AnimatedText;