import MaterialIcons from "@react-native-vector-icons/material-icons";
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
        <AnimatedMaterialIcons name="add" size={30} style={animatedIconStyle} />
      </AnimatedTouchableOpacity>
    </View>
  );
}

const AnimatedMaterialIcons = Animated.createAnimatedComponent(MaterialIcons);

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
