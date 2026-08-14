import { Colors } from "@/constants/colors";
import { useNoteStore } from "@/store/useNoteStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { parseDate } from "@/utils/dateParser";
import React, { useRef } from "react";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import { EnrichedText } from "react-native-enriched-html";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  Extrapolation,
  FadeIn,
  FadeInLeft,
  FadeOutDown,
  FadeOutLeft,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { textEditorStyles } from "./EditorItemSettings";

import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

type Props = {
  id: string;
  title: string;
  content: string;
  indexes?: number[];
  isSelected: boolean;
  isSelectionMode: boolean;
  setSelectionMode: (val: boolean) => void;
  onPress: (id: string) => void;
  onLongPress: (id: string) => void;
  onSelect: (id: string) => void;
  createdAt: Date;
  updatedAt: Date;
};

const ICON_SIZE = 20;

function NoteItem({
  id,
  title,
  content,
  indexes,
  isSelectionMode,
  isSelected,
  setSelectionMode,
  onPress,
  onLongPress,
  onSelect,
  createdAt,
  updatedAt,
}: Props) {
  // ZUSTAND STATES
  const searchTextLen = useNoteStore((state) => state.searchTextLen);
  const isSearchMode = useNoteStore((state) => state.isSearchMode);
  const setIsSearchMode = useNoteStore((state) => state.setIsSearchMode);
  const deleteByID = useNoteStore((state) => state.deleteByID);
  const hourFormat = useSettingsStore((state) => state.hourFormat);

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
          onPress={() => deleteByID(id)}
        >
          <Animated.View style={animatedIconStyles}>
            <MaterialDesignIcons
              name="delete"
              size={ICON_SIZE}
              color={"#FFF"}
            />
          </Animated.View>
        </Pressable>
      </View>
    );
  };

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
        <Pressable
          style={({ pressed }) => [
            styles.container,
            isSelected && styles.selectedContainer,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => {
            if (isSelectionMode) {
              onSelect(id);
            } else {
              onPress(id);
              setTimeout(() => {
                setIsSearchMode(false);
              }, 100);
            }
          }}
          onLongPress={() => {
            setSelectionMode(true);
            Keyboard.dismiss();
            onLongPress(id);
            onSelect(id);
            swipeableRef.current!.close();
          }}
        >
          <View style={styles.mainAreaContainer}>
            {isSelectionMode && (
              <Animated.View
                entering={FadeInLeft.duration(200)}
                exiting={FadeOutLeft.duration(200)}
                style={{ marginRight: 4 }}
              >
                <MaterialDesignIcons
                  name={
                    isSelected
                      // checkbox-blank-outline
                      ? "checkbox-outline"
                      : "checkbox-blank-outline"
                  }
                  size={ICON_SIZE}
                  color={Colors.medium}
                />
              </Animated.View>
            )}
            <View
              style={[
                styles.noteContainer,
                isSelectionMode && { width: "90%" },
              ]}
            >
              {isSearchMode ? (
                getHighlightedText(title, indexes, searchTextLen)
              ) : (
                <Text style={[styles.noteTitle]} numberOfLines={1}>
                  {title}
                </Text>
              )}

              <EnrichedText
                style={styles.contentText}
                htmlStyle={textEditorStyles}
                numberOfLines={1}
              >
                {content}
              </EnrichedText>

              <View style={styles.infoContainer}>
                <MaterialDesignIcons
                  name={"clock-outline"}
                  size={12}
                  color={"#CCC"}
                />
                <Text allowFontScaling={false} style={styles.createdAtText}>
                  {parseDate(createdAt, hourFormat)}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      </Swipeable>
    </Animated.View>
  );
}

export default React.memo(NoteItem);

const getHighlightedText = (
  task: string,
  indexes: number[] | undefined,
  matchLength: number,
) => {
  if (!indexes || indexes.length === 0 || matchLength === 0) {
    return <Text style={styles.noteTitle}>{task}</Text>;
  }

  const indexSet = new Set<number>();
  indexes.forEach((startIndex) => {
    for (let i = 0; i < matchLength; i++) {
      indexSet.add(startIndex + i);
    }
  });

  return (
    <Text style={styles.noteTitle}>
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
    height: 75,
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
  noteTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#FFF",
    marginLeft: 12,
    marginRight: 8,
    textAlignVertical: "center",
    flexShrink: 1,
  },
  contentText: {
    fontSize: 13,
    color: "#a9a9ac",
    marginLeft: 13,
    marginRight: 8,
    textAlignVertical: "center",
    flexShrink: 1,
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
  noteContainer: {
    width: "95%",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 3,
  },
  createdAtText: {
    color: "#CCC",
    marginLeft: 5,
    fontFamily: "Inter-Regular",
    marginBottom: 1,
    fontSize: 12,
  },
});
