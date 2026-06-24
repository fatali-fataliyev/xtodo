import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type SizeType = keyof typeof sizes;

interface GlowCircleProps {
  color: string;
  size?: SizeType;
}

export const GlowCircle: React.FC<GlowCircleProps> = ({
  color,
  size = "normal",
}) => {
  const glowProgress = useSharedValue(0);

  useEffect(() => {

    glowProgress.value = withRepeat(
      withTiming(1, { duration: 2500 }),
      -1,
      true
    );
  }, []);

  const animatedGlowStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: interpolate(glowProgress.value, [0, 1], [1, 1.4]) },
      ],
      opacity: interpolate(glowProgress.value, [0, 1], [0.3, 0.8]),
    };
  });

  const currentStyles = getStyleBySize(size);

  return (
    <View style={currentStyles.container}>
      <Animated.View
        style={[
          currentStyles.outerCircle,
          { backgroundColor: color },
          animatedGlowStyle,
        ]}
      />
      <View
        style={[
          currentStyles.innerCircle,
          {
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

interface SizedStyle {
  container: Record<string, any>;
  innerCircle: Record<string, any>;
  outerCircle: Record<string, any>;
}


const sizes = {
  small: {
    container: {
      justifyContent: "center",
      alignItems: "center",
      width: 10,
      height: 10,
    },
    innerCircle: {
      width: 10,
      height: 10,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 1,
      elevation: 2,
    },
    outerCircle: {
      position: "absolute",
      width: 11,
      height: 11,
      borderRadius: 10,
    },
  },
  normal: {
    container: {
      justifyContent: "center",
      alignItems: "center",
      width: 15,
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
      width: 16,
      height: 16,
      borderRadius: 10,
    },
  },
  large: {
    container: {
      justifyContent: "center",
      alignItems: "center",
      width: 20,
      height: 20,
    },
    innerCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 1,
      elevation: 2,
    },
    outerCircle: {
      position: "absolute",
      width: 21,
      height: 21,
      borderRadius: 10,
    },
  },
} as const;

function getStyleBySize(size: SizeType): SizedStyle {
  return sizes[size];
}