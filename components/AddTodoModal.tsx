import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { Colors } from "../assets/js/colors";

// TODO
// 2. Add glows to Selects with its color, also color themself
// 3. Make Add button and Add & New
// 4. Complete and tie to redux

type Props = {
  isModalVisible?: boolean;
  setIsModalVisible: (val: boolean) => void;
};

export default function ModalTester({
  isModalVisible,
  setIsModalVisible,
}: Props) {
  const hideModal = () => {
    setTodoName("");
    setIsModalVisible(false);
  };

  const handleBackdrop = () => {
    console.log("backdrop pressed");
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

  const logVals = () => {
    console.log("name::", todoName);
    console.log("level::", priorityLevel);
  };

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
    outputRange: [0, 150],
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
          {/*Header part*/}
          <View style={styles.swipeAreaContainer}>
            <View style={styles.swipeHandle} />
            <Pressable onPress={hideModal} style={styles.closeButton}>
              <FontAwesome5 name="window-close" size={24} color="#ccc" />
            </Pressable>
          </View>

          {/*Input part*/}
          <TextInput
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

          {/*Select part*/}
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
                    paddingTop: 1,
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
                      setToggleDropdown(!toggleDropdown);
                    }}
                  >
                    <View style={styles.textContainer}>
                      <Text
                        style={[
                          styles.itemText,
                          isSelected && styles.selectedText,
                        ]}
                      >
                        {item.info}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </Animated.View>
          </View>

          {/*Save Part*/}
          <Button title="Save & Log" onPress={logVals} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  prioritySelectContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "baseline",
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
    paddingVertical: 12,
    paddingHorizontal: 15,
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
  },
  textContainer: {
    alignSelf: "flex-start",
  },
  itemText: {
    color: "#aaa",
    fontSize: 15,
  },
  selectedText: {
    color: "#3b82f6",
    fontWeight: "600",
  },
  animatedUnderline: {
    height: 2,
    backgroundColor: "#3b82f6",
    marginTop: 2,
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
    paddingBottom: 40,
    paddingTop: 10,
  },
  swipeAreaContainer: {
    width: "100%",
    alignItems: "center",
    position: "relative",
    justifyContent: "center",
    paddingVertical: 10,
    marginBottom: 15,
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
});
