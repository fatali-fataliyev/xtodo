import { Colors, GetColorByLevel } from "@/assets/js/colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { GlowCircle } from "./GlowCircle";

type Props = {
  id: number;
  task: string;
  priorityLevel: string;
  isDone: boolean;
  onDelete?: () => void;
  onEdit?: (id: number) => void;
  onLongPress: (id: number) => void;
  onSelect: (id: number) => void;
  isSelected: boolean;
  isSelectionMode: boolean;
};

function TodoItem({
  id,
  task,
  priorityLevel,
  isDone,
  onDelete,
  onEdit,
  onLongPress,
  onSelect,
  isSelected,
  isSelectionMode,
}: Props) {
  const markTodoDone = () => {
    console.log("this todo is done.");
  };

  const renderRightActions = (
    _progress: SharedValue<number>,
    dragX: SharedValue<number>,
  ) => {
    const animatedIconStyles = useAnimatedStyle(() => {
      const scale = interpolate(
        dragX.value,
        [-80, 0],
        [1, 0.5],
        Extrapolation.CLAMP,
      );

      const opacity = interpolate(
        dragX.value,
        [-60, 0],
        [1, 0],
        Extrapolation.CLAMP,
      );

      return {
        transform: [{ scale }],
        opacity,
      };
    });
    return (
      <View style={styles.deleteButtonContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          activeOpacity={0.7}
        >
          <Animated.View style={animatedIconStyles}>
            <FontAwesome6 name="trash" size={20} color="#FFF" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ReanimatedSwipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={renderRightActions}
      containerStyle={styles.swipeableContainer}
      dragOffsetFromRightEdge={30}
      dragOffsetFromLeftEdge={30}
    >
      <TouchableOpacity
        style={[styles.container, isSelected && styles.selectedContainer]}
        onPress={isSelectionMode ? () => onSelect(id) : markTodoDone}
        onLongPress={() => {
          onSelect(id);
          console.log("long pressed on this id todo: ", id, "name: ", task);
          onLongPress(id);
        }}
        activeOpacity={0.5}
      >
        <View style={styles.mainAreaContainer}>
          {isSelectionMode ? (
            <Fontisto
              name={isSelected ? "checkbox-active" : "checkbox-passive"}
              size={20}
              color={Colors.medium}
              style={{ borderRadius: 4 }}
            />
          ) : (
            <Fontisto
              name={isDone ? "checkbox-active" : "checkbox-passive"}
              size={20}
              color="#8E8E93"
              style={{ borderRadius: 4 }}
            />
          )}
          <Text style={styles.taskText}>{task}</Text>
          <View style={styles.glowCircleContainer}>
            <GlowCircle color={GetColorByLevel(priorityLevel)} size="small" />
          </View>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit?.(id)}
        >
          <FontAwesome6 name="edit" size={20} color="#B3B3B3" />
        </TouchableOpacity>
      </TouchableOpacity>
    </ReanimatedSwipeable>
  );
}

export default React.memo(TodoItem);

const styles = StyleSheet.create({
  swipeableContainer: {
    width: "95%",
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  container: {
    width: "100%",
    height: 80,
    backgroundColor: "#242424",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 18,
  },
  selectedContainer: {
    backgroundColor: "#111",
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
    marginRight: 8,
    textAlignVertical: "center",
    flexShrink: 1,
  },
  glowCircleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    borderLeftColor: "#454545",
    borderLeftWidth: 1,
    height: "100%",
    paddingRight: 18,
  },
  deleteButtonContainer: {
    height: "100%",
    width: 80,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
