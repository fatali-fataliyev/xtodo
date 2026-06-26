import { useTodoStore } from "@/store/useTodoStore";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAudioPlayer } from "expo-audio";
import React, { useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  Extrapolation,
  FadeIn,
  FadeOutDown,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { getClickSound } from "../constants/clickSounds";
import { Colors, GetColorByLevel } from "../constants/colors";
import { GlowCircle } from "./GlowCircle";

type Props = {
  id: string;
  task: string;
  priority: string;
  isDone: boolean;
  indexes?: number[];
  onEdit?: (id: string) => void;
  onLongPress: (id: string) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  isSelectionMode: boolean;
};

function TodoItem({
  id,
  task,
  priority,
  isDone,
  indexes,
  onEdit,
  onLongPress,
  onSelect,
  isSelected,
  isSelectionMode,
}: Props) {
  // ZUSTAND STATES
  const deleteTodoByID = useTodoStore((state) => state.deleteByID);
  const deleteFromSearchTodos = useTodoStore(
    (state) => state.deleteFromSearchResults,
  );
  const searchTextLen = useTodoStore((state) => state.searchTextLen);
  const isSearchMode = useTodoStore((state) => state.isSearchMode);
  const markTodoDone = useTodoStore((state) => state.markTodoDone);

  // LOCAL STATE FOR ANIMATION
  const [isCompleting, setIsCompleting] = useState(false);

  // FUNCTIONS
  const deleteTodoItem = () => {
    if (isSearchMode) {
      deleteTodoByID(id);
      deleteFromSearchTodos(id);
      return;
    }
    deleteTodoByID(id);
  };

  const handlePress = () => {
    if (isCompleting) return;

    if (!isDone) player.play();

    if (isSelectionMode) {
      onSelect(id);
      return;
    }

    if (!isDone) {
      setIsCompleting(true);
      setTimeout(() => {
        markTodoDone(id);
      }, 300);
    } else {
      markTodoDone(id);
    }
  };

  const player = useAudioPlayer(getClickSound("dwLine1Default"));

  // ANIMATIONS
  const swipeableRef = useRef<SwipeableMethods>(null);

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
        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && { opacity: 0.7 },
          ]}
          onPress={deleteTodoItem}
        >
          <Animated.View style={animatedIconStyles}>
            <FontAwesome6 name="trash" size={20} color="#FFF" />
          </Animated.View>
        </Pressable>
      </View>
    );
  };

  const doneLineStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(isCompleting ? "100%" : "0%", { duration: 300 }),
      left: withTiming(isCompleting ? "0%" : "50%", { duration: 300 }),
      opacity: withTiming(isCompleting ? 1 : 0, { duration: 300 }),
    };
  });

  return (
    <Animated.View entering={FadeIn} exiting={FadeOutDown.duration(500)}>
      <Swipeable
        friction={1}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={renderRightActions}
        containerStyle={styles.swipeableContainer}
        dragOffsetFromRightEdge={30}
        dragOffsetFromLeftEdge={30}
        overshootRight={false}
        ref={swipeableRef}
      >
        <Animated.View
          style={[styles.doneLine, doneLineStyle]}
          pointerEvents="none"
        />

        <Pressable
          disabled={isCompleting}
          style={({ pressed }) => [
            styles.container,
            isSelected && styles.selectedContainer,
            isDone && {
              backgroundColor: "#0D0B0B",
            },
            pressed && { opacity: 0.7 },
          ]}
          onPress={handlePress}
          onLongPress={() => {
            Keyboard.dismiss();
            onSelect(id);
            onLongPress(id);
            swipeableRef.current!.close();
          }}
        >
          <View style={styles.mainAreaContainer}>
            {isSelectionMode ? (
              <Ionicons
                name={isSelected ? "checkbox" : "square-outline"}
                size={21}
                color={Colors.medium}
                style={{ borderRadius: 4 }}
              />
            ) : (
              <Ionicons
                name={isDone || isCompleting ? "checkbox" : "square-outline"}
                size={21}
                color={"#8E8E93"}
                style={{ borderRadius: 4 }}
              />
            )}
            <View style={styles.taskContainer}>
              {isSearchMode ? (
                getHighlightedText(task, indexes, searchTextLen)
              ) : (
                <Text
                  style={[
                    styles.taskText,
                    (isDone || isCompleting) && {
                      textDecorationLine: "line-through",
                    },
                  ]}
                >
                  {task}
                </Text>
              )}

              <GlowCircle
                color={
                  isDone || isCompleting ? "#454545" : GetColorByLevel(priority)
                }
                size="small"
              />
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.editButton,
              pressed && { opacity: 0.5 },
            ]}
            onPress={() => onEdit?.(id)}
          >
            <FontAwesome6 name="edit" size={20} color="#B3B3B3" />
          </Pressable>
        </Pressable>
      </Swipeable>
    </Animated.View>
  );
}

export default React.memo(TodoItem);

const getHighlightedText = (
  task: string,
  indexes: number[] | undefined,
  matchLength: number,
) => {
  if (!indexes || indexes.length === 0 || matchLength === 0) {
    return <Text style={styles.taskText}>{task}</Text>;
  }

  const indexSet = new Set<number>();
  indexes.forEach((startIndex) => {
    for (let i = 0; i < matchLength; i++) {
      indexSet.add(startIndex + i);
    }
  });

  return (
    <Text style={styles.taskText}>
      {task.split("").map((char, i) => (
        <Text
          key={i}
          style={
            indexSet.has(i)
              ? { color: "#FF3B30", fontFamily: "Inter-Regular" }
              : null
          }
        >
          {char}
        </Text>
      ))}
    </Text>
  );
};

const styles = StyleSheet.create({
  swipeableContainer: {
    width: "95%",
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
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
  editButton: {
    justifyContent: "center",
    alignSelf: "center",
    paddingLeft: 15,
    borderLeftColor: "#454545",
    borderLeftWidth: 1,
    height: "100%",
    paddingRight: 15,
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
  taskContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    flexDirection: "row",
  },
  doneLine: {
    backgroundColor: "#454545",
    position: "absolute",
    top: "50%",
    marginTop: -2.5,
    height: 5,
    zIndex: 10,
  },
});
