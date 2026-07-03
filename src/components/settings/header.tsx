import { StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SharedValue,
} from "react-native-reanimated";
import ExampleAddCustomBtn from "./exampleAddButton";

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
      {isColorPickerOpen ? (
        <Animated.View
          key="color-picker-btn"
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          style={[styles.centerContainer, styles.absoluteCenter]}
        >
          <ExampleAddCustomBtn bgColor={bgColor} iconColor={iconColor} />
        </Animated.View>
      ) : (
        <Animated.View
          key="settings-text"
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          style={styles.centerContainer}
        >
          <Animated.Text style={styles.headerText}>Settings</Animated.Text>
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
    minHeight: 50,
    position: "relative",
    marginBottom: 20,
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  absoluteCenter: {
    position: "absolute",
  },
  headerText: {
    fontSize: 24,
    color: "#FFF",
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
});
