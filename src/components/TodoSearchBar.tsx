import { useTodoStore } from "@/store/useTodoStore";
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
import TodoFilterModal from "./TodoFilterModal";

export default function TodoSearchBar() {
  // ZUSTAND STATES
  const filterSearchTodos = useTodoStore((state) => state.filterSearchTodos);
  const isSearchMode = useTodoStore((state) => state.isSearchMode);
  const setIsSearchMode = useTodoStore((state) => state.setIsSearchMode);
  const updateSearchTextLen = useTodoStore(
    (state) => state.updateSearchTextLen,
  );
  // LOCAL STATES
  const [searchText, setSearchText] = useState<string>("");
  const inputRef = useRef<TextInput>(null);
  const [isFilterModalVisible, setIsFilterModalVisible] =
    useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(true);

  useEffect(() => {
    if (!isSearchMode) {
      setSearchText("");
      filterSearchTodos("");
      inputRef.current?.blur();
      Keyboard.dismiss();
    }
  }, [isSearchMode]);

  const handleTextChange = (text: string) => {
    setSearchText(text);
    updateSearchTextLen(text.length);
    filterSearchTodos(text);
  };

  const handleOnSubmit = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={styles.searchAndFilterBar}>
      <TodoFilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
      />
      <View style={styles.searchBox}>
        <Fontisto name="search" size={15} color="#5D5D5D" />
        <TextInput
          ref={inputRef}
          onChangeText={handleTextChange}
          onFocus={() => setIsSearchMode(true)}
          placeholder="Search todos"
          placeholderTextColor={"#7A7A7A"}
          style={styles.input}
          onSubmitEditing={handleOnSubmit}
          value={searchText}
          spellCheck={false}
          autoCorrect={false}
          autoCapitalize="none"
          editable={isEditable}
        />
      </View>

      <TouchableOpacity
        style={styles.filterBtn}
        activeOpacity={0.8}
        onPress={() => setIsFilterModalVisible(true)}
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
