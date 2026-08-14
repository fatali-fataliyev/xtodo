import { StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SharedValue,
} from "react-native-reanimated";
import ExampleAddCustomBtn from "./ExampleAddButton";

type Props = {
  isColorPickerOpen: boolean;
  bgColor: SharedValue<string>;
  iconColor: SharedValue<string>;
};

export default function Header({
  isColorPickerOpen,
  bgColor,
  iconColor,
}: Props) {
  return (
    <View style={styles.container}>
      {isColorPickerOpen && (
        <Animated.View
          key="color-picker-btn"
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
        >
          <ExampleAddCustomBtn bgColor={bgColor} iconColor={iconColor} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 35,
    left: 0,
    right: 0,
  },
});
