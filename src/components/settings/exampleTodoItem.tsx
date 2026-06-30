import { useSettingsStore } from "@/store/useSettingsStore";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { FadeIn, FadeOutDown } from "react-native-reanimated";
import { GlowCircle } from "../todos/GlowCircle";

type Props = {
  task: string;
  isDone: boolean;
};

export default function ExampleTodoItem({ task, isDone }: Props) {
  // ZUSTAND STATES
  const doneTextStyle = useSettingsStore((state) => state.doneTodoTextStyle);

  return (
    <Animated.View entering={FadeIn} exiting={FadeOutDown.duration(500)}>
      <Swipeable
        friction={1}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        containerStyle={styles.swipeableContainer}
        overshootRight={false}
      >
        <Pressable
          style={({ pressed }) => [
            styles.container,
            isDone && {
              backgroundColor: "#0D0B0B",
            },
            pressed && { opacity: 0.7 },
          ]}
        >
          <View style={styles.mainAreaContainer}>
            <Ionicons
              name={"checkbox"}
              size={21}
              color={"#8E8E93"}
              style={{ borderRadius: 4 }}
            />
            <Text
              style={[styles.taskText, { textDecorationLine: doneTextStyle }]}
            >
              {task}
            </Text>

            <View style={styles.taskContainer}>
              <GlowCircle color={"#454545"} size="small" />
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.editButton,
              pressed && { opacity: 0.5 },
            ]}
          >
            <FontAwesome6 name="edit" size={20} color="#B3B3B3" />
          </Pressable>
        </Pressable>
      </Swipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  swipeableContainer: {
    width: "100%",
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  container: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
  },
  mainAreaContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  taskText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#FFF",
    marginLeft: 12,
    textAlignVertical: "center",
    flex: 1,
  },
  editButton: {
    justifyContent: "center",
    alignSelf: "center",
    paddingLeft: 10,
    borderLeftColor: "#454545",
    borderLeftWidth: 1,
    marginLeft: 15,
    height: "100%",
    paddingRight: 10,
  },
  taskContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
