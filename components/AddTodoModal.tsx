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
import { Colors } from "../assets/js/colors";

type Props = {
  isModalVisible?: boolean;
  setIsModalVisible: (val: boolean) => void;
};

export default function ModalTester({
  isModalVisible,
  setIsModalVisible,
}: Props) {
  const hideModal = () => {
    setIsModalVisible(false);
    resetInputs();
  };

  const handleBackdrop = () => {
    console.log("backdrop pressed");
  };

  const resetInputs = () => {
    setTodoName("");
    setPriorityLevel("high");
    setToggleDropdown(false);
  };

  const addAndClose = () => {
    saveTodo();
    hideModal();
  };

  const addAndAnother = () => {
    saveTodo();
    resetInputs();
  };

  const saveTodo = () => {
    if (todoName === "") {
      alert("Todo name cannot be empty.");
    }

    // save to redux.

    resetInputs();
  };

  const [todoName, setTodoName] = useState("");
  const [inputHeight, setInputHeight] = useState<number>(60);
  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);
  const [priorityLevel, setPriorityLevel] = useState<string>("high");

  const priorityLevels = [
    { level: "high", info: "Urgent (Top & Default)" },
    { level: "medium", info: "Schedule (Middle)" },
    { level: "low", info: "Later (Bottom)" },
  ];

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
    <View style={styles.container}>
      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={hideModal}
        onBackdropPress={handleBackdrop}
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
              onChangeText={(value) => setTodoName(value)}
              multiline={true}
              onSubmitEditing={() => alert("adding todo.")}
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
                  <Text
                    style={{
                      color: getColorByLevel(priorityLevel),
                      fontWeight: "600",
                      paddingTop: 3,
                    }}
                  >
                    {priorityLevel.toUpperCase()}
                  </Text>
                </View>
                <FontAwesome5
                  name={toggleDropdown ? "chevron-up" : "chevron-down"}
                  size={14}
                  color="#fff"
                />
              </TouchableOpacity>

              <Animated.View
                style={[
                  styles.dropdownContainer,
                  { height: menuHeight, opacity: menuOpacity },
                ]}
              >
                {priorityLevels.map((item, idx) => {
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
                              { color: getColorByLevel(item.level) },
                            ]}
                          >
                            {capitalizeFirstLetter(item.level)}{" "}
                          </Text>
                          <Text
                            style={[
                              styles.infoColumn,
                              { color: getColorByLevel(item.level) },
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
              {/*Add & another*/}
              <TouchableOpacity
                onPress={saveTodo}
                style={[styles.saveBtn, { marginBottom: 15 }]}
              >
                <Text style={styles.saveBtnText}>Add & Another</Text>
              </TouchableOpacity>

              {/*add & close*/}
              <TouchableOpacity
                onPress={saveTodo}
                style={[styles.saveBtn, { backgroundColor: "#34C759" }]}
              >
                <Text style={styles.saveBtnText}>Add & Close</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

function getColorByLevel(level: string): string {
  switch (level) {
    case "high":
      return Colors.high;
    case "medium":
      return Colors.medium;
    case "low":
      return Colors.low;
  }
  return "";
}

function capitalizeFirstLetter(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    backgroundColor: "#2C2C2E",
    width: "100%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#303030",
  },
  saveBtnText: {
    fontFamily: "Inter-SemiBold",
    color: "#FFF",
  },
});
