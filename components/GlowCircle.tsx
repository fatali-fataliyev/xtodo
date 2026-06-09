import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface GlowCircleProps {
  color: string;
}

const GlowCircle: React.FC<GlowCircleProps> = ({ color }) => {
  const glowAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startGlow();
  }, []);

  const startGlow = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const scale = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4], // Keeps the ember glow tight and contained
  });

  const opacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8], // Softly breathes between dim (0.3) and bright (0.8)
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.outerCircle,
          {
            backgroundColor: color,
            transform: [{ scale: scale }],
            opacity: opacity,
          },
        ]}
      />
      <View
        style={[
          styles.innerCircle,
          {
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: 15, // Example dimensions - adjust as needed
    height: 15,
  },
  innerCircle: {
    width: 15,
    height: 15,
    borderRadius: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  outerCircle: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 10,
  },
});

export default GlowCircle;
