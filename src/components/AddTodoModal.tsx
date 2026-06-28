import { GetColorByLevel } from "@/constants/colors";
import { PriorityLevels } from "@/constants/priorityLevels";
import { useTodoStore } from "@/store/useTodoStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
  TouchableOpacity,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";
import * as Crypto from "expo-crypto";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { GlowCircle } from "./GlowCircle";

type Props = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
};

// ANIMATED PRIORITY SELECT BUTTON COMPONENT
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const PriorityButton = ({ item, isSelected, onPress, isMedium }: any) => {
  const color = GetColorByLevel(item.level);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, { duration: 250 });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ["rgba(42, 42, 42, 0)", "rgba(42, 42, 42, 1)"],
    );

    return {
      backgroundColor,
      transform: [
        { scale: withTiming(isSelected ? 1.03 : 1, { duration: 200 }) },
      ],
    };
  });

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[styles.priorityBtn, { borderColor: color }, animatedStyle]}
    >
      <View style={styles.btnContent}>
        <Text style={[styles.priorityBtnText, { color }]}>
          {item.level.toUpperCase()}
        </Text>
        <View style={[styles.glowContainer, isMedium && { right: 3.5 }]}>
          {isSelected && <GlowCircle size="small" color={color} />}
        </View>
      </View>
    </AnimatedPressable>
  );
};

// MAIN COMPONENT
export const AddTodoModal = ({ isOpen, setIsOpen }: Props) => {
  // ZUSTAND
  const saveTodo = useTodoStore((state) => state.addTodo);

  // LOCAL STATES & REFS
  const [todoName, setTodoName] = useState("");
  const [priorityLevel, setPriorityLevel] = useState<string>("high");
  const isSaveBtnDisabled = todoName.trim() === "";

  const sheetRef = useRef<any>(null);
  const inputRef = useRef<any>(null);

  // FUNCTIONS
  const addTodo = () => {
    saveTodo({
      id: Crypto.randomUUID(),
      task: todoName,
      isDone: false,
      priority: priorityLevel,
    });
  };

  const closeModal = () => {
    Keyboard.dismiss();
    sheetRef.current?.close();
    setIsOpen(false);
    resetInputs();
  };

  const resetInputs = () => {
    setTodoName("");
    setPriorityLevel("high");
  };

  const addAndClose = () => {
    addTodo();
    closeModal();
  };

  const addAndAnother = () => {
    addTodo();
    resetInputs();
  };

  useEffect(() => {
    if (isOpen) {
      const backAction = () => {
        closeModal();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction,
      );

      return () => {
        backHandler.remove();
      };
    }
  }, [isOpen]);

  const handleSheetChange = useCallback((index: number) => {
    if (index >= 0) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    stiffness: 500,
  });

  return (
    <BottomSheet
      ref={sheetRef}
      index={isOpen ? 0 : -1}
      onChange={handleSheetChange}
      animationConfigs={animationConfigs}
      backdropComponent={renderBackdrop}
      onClose={closeModal}
      enablePanDownToClose={true}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backgroundStyle={styles.sheetBackground}
      handleStyle={styles.sheetBackground}
      handleIndicatorStyle={{ backgroundColor: "#CCC" }}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
            <MaterialIcons name="close" size={24} color="#CCC" />
          </TouchableOpacity>
        </View>

        {/* Input */}
        <BottomSheetTextInput
          ref={inputRef}
          value={todoName}
          onChangeText={setTodoName}
          multiline={true}
          placeholderTextColor={"#c2c2c2"}
          placeholder="Todo name"
          style={[styles.input, { padding: 15 }]}
          spellCheck={false}
          autoCorrect={false}
          autoFocus={false}
        />

        {/* Priority Selector Fieldset */}
        <View style={styles.fieldset}>
          <Text style={styles.fieldsetLabel}>Priority</Text>
          <View style={styles.priorityBtnsContainer}>
            {PriorityLevels.map((item) => (
              <PriorityButton
                key={item.level}
                item={item}
                isSelected={item.level === priorityLevel}
                onPress={() => setPriorityLevel(item.level)}
                isMedium={item.level === "medium"}
              />
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={addAndAnother}
            disabled={isSaveBtnDisabled}
            style={[
              styles.saveBtn,
              { marginBottom: 15 },
              isSaveBtnDisabled && styles.saveBtnDisabled,
            ]}
          >
            <Text
              style={[
                styles.saveBtnText,
                isSaveBtnDisabled && styles.saveBtnTextDisabled,
              ]}
            >
              Add & Another
            </Text>
          </TouchableOpacity>

          {/* Add & Close */}
          <TouchableOpacity
            onPress={addAndClose}
            style={[
              styles.saveBtn,
              { backgroundColor: "#34C759" },
              isSaveBtnDisabled && styles.saveBtnDisabled,
            ]}
            disabled={isSaveBtnDisabled}
          >
            <Text
              style={[
                styles.saveBtnText,
                isSaveBtnDisabled && styles.saveBtnTextDisabled,
              ]}
            >
              Add & Close
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#242424",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#242424",
  },
  header: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 10,
    marginTop: 5,
  },
  closeBtn: {
    padding: 5,
  },
  input: {
    fontFamily: "Inter-Regular",
    width: "100%",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  fieldset: {
    marginTop: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  fieldsetLabel: {
    position: "absolute",
    top: -10,
    left: 12,
    backgroundColor: "#242424",
    paddingHorizontal: 4,
    color: "#FFF",
    fontSize: 13,
  },
  priorityBtnsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  priorityBtn: {
    flex: 1,
    borderWidth: 1.5,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
  },
  priorityBtnText: {
    fontFamily: "Inter-Bold",
    fontSize: 13,
    textAlign: "center",
  },
  glowContainer: {
    position: "absolute",
    right: 14,
    width: 12,
    height: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "column",
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: "#2C2C2E",
    width: "100%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#303030",
  },
  saveBtnDisabled: {
    backgroundColor: "#101010",
    pointerEvents: "none",
  },
  saveBtnTextDisabled: {
    fontFamily: "Inter-Regular",
    color: "#a0a0a0",
  },
  saveBtnText: {
    fontFamily: "Inter-SemiBold",
    color: "#FFF",
  },
});
