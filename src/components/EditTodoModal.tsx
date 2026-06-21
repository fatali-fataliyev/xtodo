import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { GetColorByLevel } from "../assets/js/colors";
import { PriorityLevels } from "../assets/js/priorityLevels";
import { GlowCircle } from "./GlowCircle";

type Props = {
  isModalVisible?: boolean;
  setIsModalVisible: (val: boolean) => void;
  todoIdx: number;
  onSaveTodo: (name: string, priority: string) => void;
};

export default function EditTodoModal({
  isModalVisible,
  setIsModalVisible,
  todoIdx,
  onSaveTodo,
}: Props) {
  const hideModal = () => {
    setIsModalVisible(false);
    resetInputs();
  };

  const resetInputs = () => {
    setTodoName("");
    setPriorityLevel("high");
    setToggleDropdown(false);
  };

  const saveTodo = () => {
    console.log("Saving edited todo");
    onSaveTodo(todoName, priorityLevel);
    hideModal();
  };

  const [todoName, setTodoName] = useState("");
  const [inputHeight, setInputHeight] = useState<number>(60);
  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);
  const [priorityLevel, setPriorityLevel] = useState<string>("high");
  const isSaveBtnDisabled = todoName.trim() === "";

  // Animations
  const dropdownAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(dropdownAnim, {
      toValue: toggleDropdown ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [toggleDropdown]);
  const menuHeight = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 160],
  });
  const menuOpacity = dropdownAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <Modal
      isVisible={isModalVisible}
      onBackButtonPress={hideModal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      swipeDirection={["down"]}
      onSwipeComplete={hideModal}
      avoidKeyboard={true}
      hasBackdrop={true}
      backdropTransitionOutTiming={0}
      backdropTransitionInTiming={0}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <View style={styles.swipeAreaContainer}>
          <View style={styles.swipeHandle} />
          <Pressable onPress={hideModal} style={styles.closeButton}>
            <FontAwesome5 name="window-close" size={24} color="#ccc" />
          </Pressable>
        </View>

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps={"handled"}
        >
          {/* Input part */}
          <TextInput
            value={todoName}
            autoFocus={true}
            placeholderTextColor={"#c2c2c2"}
            placeholder="Todo name"
            onChangeText={setTodoName}
            multiline={true}
            onContentSizeChange={(e) => {
              setInputHeight(e.nativeEvent.contentSize.height);
            }}
            style={[styles.input, { height: Math.max(60, inputHeight) }]}
            spellCheck={false}
            autoCorrect={false}
          />

          {/* Select part */}
          <View style={styles.selectMenuWrapper}>
            <TouchableOpacity
              style={styles.selectMenuToggler}
              onPress={() => setToggleDropdown(!toggleDropdown)}
            >
              <View style={styles.prioritySelectContainer}>
                <Text style={styles.priorityText}>Priority: </Text>
                <View style={styles.glowAndLevelTextContainer}>
                  <View>
                    <Text
                      style={{
                        color: GetColorByLevel(priorityLevel),
                        fontWeight: "600",
                        paddingTop: 3,
                      }}
                    >
                      {priorityLevel.toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ paddingTop: 3.5, paddingLeft: 5 }}>
                    <GlowCircle
                      color={GetColorByLevel(priorityLevel)}
                      size="small"
                    />
                  </View>
                </View>
              </View>
              <View>
                <FontAwesome
                  name={toggleDropdown ? "chevron-up" : "chevron-down"}
                  size={14}
                  color="#fff"
                  style={{ pointerEvents: "none" }}
                />
              </View>
            </TouchableOpacity>

            <Animated.View
              style={[
                styles.dropdownContainer,
                { height: menuHeight, opacity: menuOpacity },
              ]}
            >
              {PriorityLevels.map((item, idx) => {
                const isSelected = item.level === priorityLevel;

                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setPriorityLevel(item.level);
                      setToggleDropdown(false);
                    }}
                  >
                    <View style={styles.textContainer}>
                      <View style={styles.rowContent}>
                        <Text
                          style={[
                            styles.levelColumn,
                            isSelected && styles.selectedText,
                            { color: GetColorByLevel(item.level) },
                          ]}
                        >
                          {capitalizeFirstLetter(item.level)}{" "}
                        </Text>
                        <Text
                          style={[
                            styles.infoColumn,
                            { color: GetColorByLevel(item.level) },
                          ]}
                        >
                          {item.info}
                        </Text>
                      </View>

                      {isSelected && (
                        <FontAwesome
                          name="check-circle"
                          size={20}
                          color="#0088CC"
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </Animated.View>
          </View>

          {/* Save Part */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={saveTodo}
              style={[
                styles.saveBtn,
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
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

function capitalizeFirstLetter(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const styles = StyleSheet.create({
  prioritySelectContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priorityText: {
    color: "#FFF",
    fontSize: 16,
  },
  selectMenuWrapper: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    overflow: "hidden",
  },
  selectMenuToggler: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 15,
    backgroundColor: "#2a2a2a",
  },
  dropdownContainer: {
    width: "100%",
    backgroundColor: "#222222",
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemText: {
    color: "#aaa",
    fontSize: 15,
  },
  selectedText: {
    fontWeight: "600",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#242424",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    maxHeight: "80%",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  buttonContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  swipeAreaContainer: {
    width: "100%",
    alignItems: "center",
    position: "relative",
    justifyContent: "center",
    paddingVertical: 10,
    marginBottom: 5,
  },
  swipeHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#444",
    borderRadius: 3,
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  rowContent: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  levelColumn: {
    width: 90,
    fontSize: 15,
  },
  infoColumn: {
    color: "#888",
    fontSize: 14,
    flex: 1,
  },
  saveBtn: {
    backgroundColor: "#4F46E5",
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
  glowAndLevelTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
