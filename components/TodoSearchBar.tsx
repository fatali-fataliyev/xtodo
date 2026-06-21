import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function TodoSearchBar() {
  const [searchText, setSearchText] = useState<string>("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setSearchText("");
        inputRef.current?.blur();
      },
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const searchTodo = () => {
    console.log("searching... ", searchText);
  };

  return (
    <View style={styles.searchAndFilterBar}>
      <View style={styles.searchBox}>
        <Fontisto name="search" size={15} color="#5D5D5D" />
        <TextInput
          ref={inputRef}
          onChangeText={(char) => setSearchText(char)}
          placeholder="Search todos"
          placeholderTextColor={"#7A7A7A"}
          style={styles.input}
          onSubmitEditing={searchTodo}
          value={searchText}
          spellCheck={false}
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity
        style={styles.filterBtn}
        activeOpacity={0.8}
        onPress={() => alert("modal")}
      >
        <Ionicons name="filter" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchAndFilterBar: {
    width: "100%",
    height: 45,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#1A1818",
  },
  searchBox: {
    backgroundColor: "#242424",
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 18,
    flexDirection: "row",
    width: "85%",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#242424",
    borderRadius: 20,
    width: "101%",
    paddingHorizontal: 8,
    paddingVertical: 0,
    color: "#FFF",
    fontFamily: "Inter-Bold",
    fontSize: 15,
    height: 40,
  },
  filterBtn: {
    width: "15%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
