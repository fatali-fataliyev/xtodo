import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
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
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

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
    borderBottomWidth: 1,
    borderBottomColor: "#454545",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 50,
    position: "relative",
    marginBottom: 20,
  },
  backBtn: {
    position: "absolute",
    left: 0,
    zIndex: 1,
    width: 50,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
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
