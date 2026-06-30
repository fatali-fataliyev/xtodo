import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

type Props = {
  bgColor: SharedValue<string>;
  iconColor: SharedValue<string>;
};

export default function ExampleAddCustomBtn({ bgColor, iconColor }: Props) {
  const animatedBtnStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: bgColor.value,
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      color: iconColor.value,
    };
  });

  return (
    <View style={styles.buttonWrapper}>
      <AnimatedTouchableOpacity style={[styles.customBtn, animatedBtnStyle]}>
        <AnimatedFontAwesome6 name="add" size={26} style={animatedIconStyle} />
      </AnimatedTouchableOpacity>
    </View>
  );
}

const AnimatedFontAwesome6 = Animated.createAnimatedComponent(FontAwesome6);

const styles = StyleSheet.create({
  buttonWrapper: {
    zIndex: 99999,
  },
  customBtn: {
    width: 60,
    height: 60,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
