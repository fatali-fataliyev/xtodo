import { GetColorByLevel } from "@/constants/colors";
import CapitalizeFirstLetter from "@/constants/firstLetterCapitalizer";
import { PriorityLevels } from "@/constants/priorityLevels";
import { useSettingsStore } from "@/store/useSettingsStore";
import { EditPayload, useTodoStore } from "@/store/useTodoStore";
import { resolveDate } from "@/utils/dateParser";
import DateTimePicker, {
  DateTimePickerChangeEvent,
} from "@expo/ui/community/datetime-picker";
import {
  AntDesign,
  Feather,
  Fontisto,
  Foundation,
  MaterialIcons,
} from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AppState,
  BackHandler,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "../../../widget/TodoWidget";
import SaveChangesModal from "../ui/SaveChangesModal";
import { remindAtParseDate } from "./RemindAtDateParser";
import { checkNotificationAccess } from "./requestNotificationAccess";

type Props = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  todoIdx: string;
};

export const EditTodoModal = ({ isOpen, setIsOpen, todoIdx }: Props) => {
  // ZUSTAND
  const todo = useTodoStore((state) =>
    state.todos.find((t) => t.id === todoIdx),
  );
  const updateTodo = useTodoStore((state) => state.updateTodo);
  const hourFormat = useSettingsStore((state) => state.hourFormat);

  // LOCAL STATES
  const [newTodoName, setNewTodoName] = useState<string>("");
  const [newPriorityLevel, setNewPriorityLevel] = useState<string>("high");
  const [isListShow, setIsListShow] = useState<boolean>(false);
  const [isSaveChangesModalShow, setIsSaveChangesModalShow] =
    useState<boolean>(false);
  const [isDateSelection, setIsDateSelection] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [isKeyboardCollapsed, setIsKeyboardCollapsed] =
    useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const hasChanged =
    newTodoName.trim() !== (todo?.task ?? "") ||
    newPriorityLevel !== (todo?.priority ?? "high") ||
    selectedDate?.getTime() !== resolveDate(todo?.remindAt)?.getTime();

  const isSaveBtnDisabled = !newTodoName.trim() || !hasChanged;
  const todayDate = new Date();

  const appStateRef = useRef(AppState.currentState);
  const sheetRef = useRef<any>(null);
  const inputRef = useRef<any>(null);

  const resetInputs = () => {
    setNewTodoName("");
    setNewPriorityLevel("high");
    setIsListShow(false);
    setSelectedDate(null);
  };

  const saveChanges = () => {
    if (isSaveBtnDisabled) return;

    let payload: EditPayload;

    if (selectedDate) {
      payload = {
        newTask: newTodoName.trim(),
        newPriority: newPriorityLevel.trim(),
        newRemindAt: selectedDate,
      };
    } else {
      payload = {
        newTask: newTodoName.trim(),
        newPriority: newPriorityLevel.trim(),
      };
    }
    updateTodo(todoIdx, payload);

    opacity.value = withTiming(1, { duration: 300 });

    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 300 });

      setTimeout(() => {
        forceCloseModal();
      }, 300);
    }, 1000);
  };

  const selectPrority = (priority: string) => {
    setNewPriorityLevel(priority);
    setIsListShow(false);
  };

  const handleDateChange = (event: DateTimePickerChangeEvent, date?: Date) => {
    setShowDatePicker(false);

    if (date) {
      const newDate = resolveDate(selectedDate) ?? new Date();
      newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());

      const now = new Date();
      if (newDate < now) {
        setSelectedDate(now)
      } else {
        setSelectedDate(newDate);
      }
    }
  };

  const handleTimeChange = (event: DateTimePickerChangeEvent, date?: Date) => {
    setShowTimePicker(false);

    if (date) {
      const newDate = resolveDate(selectedDate) ?? new Date();
      newDate.setHours(date.getHours(), date.getMinutes(), 0, 0);

      const now = new Date();
      if (newDate < now) {
        setSelectedDate(now);
      } else {
        setSelectedDate(newDate);
      }
    }
  };

  const handleDismiss = () => {
    setShowTimePicker(false);
    setShowDatePicker(false);
  };

  const handleSheetChanges = useCallback((index: number) => {
    if (index >= 0) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 50);
      });
    } else {
      inputRef.current?.blur();
    }
  }, []);

  const openReminderToolbar = async () => {
    await checkNotificationAccess();
    if (selectedDate) {
      setIsDateSelection(true);
      return;
    }
    setSelectedDate(new Date());
    setIsDateSelection(true);
    setShowTimePicker(true);
  };

  // MODAL CLOSING
  const forceCloseModal = useCallback(() => {
    inputRef.current?.blur();
    sheetRef.current?.close();
    setIsSaveChangesModalShow(false);
    setTimeout(() => {
      setIsOpen(false);
      setIsListShow(false);
      setIsDateSelection(false);
      setSelectedDate(null);
      resetInputs();
    }, 150);
  }, [setIsOpen]);

  const closeModal = useCallback(() => {
    if (hasChanged) {
      setIsSaveChangesModalShow(true);
      return;
    }

    forceCloseModal();
  }, [hasChanged, forceCloseModal]);

  useEffect(() => {
    if (isOpen && todo) {
      setNewTodoName(todo.task ?? "");
      setNewPriorityLevel(todo.priority ?? "high");
      setSelectedDate(resolveDate(todo?.remindAt) ?? null);
    }
  }, [isOpen, todo]);

  useEffect(() => {
    const hideListener = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardCollapsed(true);
      if (
        appStateRef.current === "active" &&
        isOpen &&
        !showDatePicker &&
        !showTimePicker
      ) {
        if (appStateRef.current === "active" && !hasChanged) {
          closeModal();
        }
      }
    });

    const showListener = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardCollapsed(false);
    });

    return () => {
      hideListener.remove();
      showListener.remove();
    };
  }, [isOpen, closeModal, showDatePicker, showTimePicker, hasChanged]);

  useEffect(() => {
    const onBackPress = () => {
      if (!isOpen) {
        return false;
      }

      if (showDatePicker || showTimePicker) {
        setShowDatePicker(false);
        setShowTimePicker(false);
        return true;
      }

      if (isListShow) {
        setIsListShow(false);
        return true;
      }

      if (isDateSelection) {
        setIsDateSelection(false);
        return true;
      }

      closeModal();
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );

    return () => subscription.remove();
  }, [
    isOpen,
    showDatePicker,
    showTimePicker,
    isListShow,
    isDateSelection,
    closeModal,
  ]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      appStateRef.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  const handleBackdropPress = useCallback(() => {
    if (hasChanged) {
      setIsSaveChangesModalShow(true);
      return;
    } else {
      forceCloseModal();
    }
  }, [hasChanged, forceCloseModal]);

  // Styling & Animations
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        onPress={handleBackdropPress}
        pressBehavior="collapse"
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [handleBackdropPress],
  );

  const opacity = useSharedValue(0);

  const animatedBadgeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <BottomSheet
      ref={sheetRef}
      index={isOpen ? 0 : -1}
      enableDynamicSizing={true}
      backdropComponent={renderBackdrop}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backgroundStyle={styles.sheetBackground}
      handleStyle={styles.sheetBackground}
      handleIndicatorStyle={{ backgroundColor: "#CCC" }}
    >
      <BottomSheetView
        style={[styles.container, isKeyboardCollapsed && { paddingBottom: 60 }]}
      >
        {/* Success badge */}
        <Animated.View style={[styles.successBadge, animatedBadgeStyle]}>
          <Feather name="check-circle" size={24} color={Colors.low} />
        </Animated.View>

        {/* TOP CENTER REMINDER MODAL */}
        {isDateSelection && (
          <View style={styles.reminderContainer}>
            {/* Date button */}
            <TouchableOpacity
              style={[styles.reminderItem, { marginBottom: 10 }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Fontisto name="date" size={15} color="#FFF" />
              <Text style={styles.reminderItemText}>
                {remindAtParseDate(selectedDate, hourFormat, true)}
              </Text>
            </TouchableOpacity>

            {/* Time button */}
            <TouchableOpacity
              style={styles.reminderItem}
              onPress={() => setShowTimePicker(true)}
            >
              <Fontisto name="clock" size={15} color="#FFF" />
              <Text style={styles.reminderItemText}>
                {remindAtParseDate(selectedDate, hourFormat, false)}
              </Text>
            </TouchableOpacity>

            <View style={styles.reminderActionButtonContainer}>
              <TouchableOpacity
                style={[styles.reminderActionButton, { width: "49%" }]}
                onPress={() => {
                  setSelectedDate(null);
                  setIsDateSelection(false);
                  setShowDatePicker(false);
                  setShowTimePicker(false);
                }}
              >
                <MaterialIcons name="delete" size={18} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.reminderActionButton,
                  {
                    width: "49.5%",
                    backgroundColor: "#28a745",
                    marginLeft: "1%",
                  },
                ]}
                onPress={() => setIsDateSelection(false)}
              >
                <MaterialIcons name="done" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <BottomSheetTextInput
          ref={inputRef}
          value={newTodoName}
          onChangeText={setNewTodoName}
          multiline={true}
          placeholderTextColor={"#c2c2c2"}
          style={[styles.input, { padding: 15 }]}
          spellCheck={false}
          autoCorrect={false}
        />

        <View style={styles.saveAreaContainer}>
          {/* PRIORITY SELECTION WRAPPER */}
          <View style={{ position: "relative" }}>
            {/* Priority Button */}
            <TouchableOpacity
              style={styles.toolBarItem}
              onPress={() => setIsListShow((prev) => !prev)}
            >
              <Foundation
                name="target"
                size={21}
                color={GetColorByLevel(newPriorityLevel)}
              />
              <Text style={styles.toolBarText}>Priority</Text>
            </TouchableOpacity>

            {isListShow && (
              <View style={styles.prorityList}>
                {PriorityLevels.map((item) => {
                  const isSelected = item.level === newPriorityLevel;
                  const isMedium = item.level === "medium";
                  return (
                    <TouchableOpacity
                      style={[
                        styles.prorityListItem,
                        isMedium && { marginVertical: 6 },
                      ]}
                      key={item.level}
                      onPress={() => selectPrority(item.level)}
                    >
                      <Foundation
                        name="target"
                        size={21}
                        color={GetColorByLevel(item.level)}
                      />
                      <Text
                        style={[
                          styles.priorityListText,
                          isSelected && { textDecorationLine: "underline" },
                        ]}
                      >
                        {CapitalizeFirstLetter(item.level)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* REMINDER BUTTON */}
          <TouchableOpacity
            style={styles.toolBarItem}
            onPress={openReminderToolbar}
            disabled={isDateSelection}
          >
            <MaterialIcons name="access-alarm" size={19} color="#FFF" />
            <Text style={styles.toolBarText}>Reminder</Text>

            {/* Time Picker */}
            {showTimePicker && (
              <DateTimePicker
                value={selectedDate ? selectedDate : new Date()}
                mode="time"
                display="default"
                onValueChange={handleTimeChange}
                onDismiss={handleDismiss}
              />
            )}

            {/* Date Picker */}
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate ? selectedDate : new Date()}
                mode="date"
                display="default"
                minimumDate={todayDate}
                onValueChange={handleDateChange}
                onDismiss={handleDismiss}
              />
            )}
          </TouchableOpacity>

          {/* SAVE BUTTON */}
          <TouchableOpacity
            onPress={saveChanges}
            disabled={isSaveBtnDisabled}
            style={[
              styles.saveBtn,
              isSaveBtnDisabled && styles.saveBtnDisabled,
            ]}
          >
            <AntDesign
              name="check-circle"
              size={22}
              color={isSaveBtnDisabled ? "gray" : "#FFF"}
            />
          </TouchableOpacity>
        </View>
      </BottomSheetView>
      {isSaveChangesModalShow && (
        <SaveChangesModal
          body="Any changes made will be lost."
          title="Discard changes?"
          isVisible={isSaveChangesModalShow}
          onDiscard={forceCloseModal}
          onCancel={() => setIsSaveChangesModalShow(false)}
        />
      )}
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
    paddingBottom: 15,
    backgroundColor: "#242424",
    position: "relative",
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
  saveBtn: {
    backgroundColor: Colors.high,
    width: 55,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    borderRadius: 25,
  },
  saveBtnDisabled: {
    backgroundColor: "#101010",
  },
  toolBarItem: {
    backgroundColor: "#1F2937",
    flexDirection: "row",
    padding: 8,
    borderRadius: 8,
    position: "relative",
  },
  toolBarText: {
    color: "#FFFFFF",
    fontFamily: "Inter-Regular",
    marginLeft: 6,
    fontSize: 14,
  },
  prorityList: {
    backgroundColor: "#001111",
    position: "absolute",
    top: -20,
    zIndex: 999,
    padding: 5,
    borderRadius: 5,
  },
  prorityListItem: {
    backgroundColor: "#152226",
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    borderRadius: 3,
  },
  priorityListText: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#FFF",
    marginLeft: 5,
  },
  saveAreaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
  },
  successBadge: {
    position: "absolute",
    top: 15,
    right: 30,
    zIndex: 999,
  },
  reminderContainer: {
    backgroundColor: "#001111",
    position: "absolute",
    top: 10,
    left: 20,
    right: 20,
    alignSelf: "center",
    zIndex: 999,
    padding: 10,
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  reminderItem: {
    backgroundColor: "#312424",
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    borderRadius: 3,
  },
  reminderItemText: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#FFF",
    marginLeft: 5,
  },
  reminderActionButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  reminderActionButton: {
    padding: 8,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },
});