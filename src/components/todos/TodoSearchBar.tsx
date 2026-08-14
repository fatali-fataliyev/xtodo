import { useTodoStore } from "@/store/useTodoStore";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import TodoFilterModal from "./TodoFilterModal";

export default function TodoSearchBar() {
  // ZUSTAND STATES
  const executeSearch = useTodoStore((state) => state.executeSearch);
  const isSearchMode = useTodoStore((state) => state.isSearchMode);
  const setIsSearchMode = useTodoStore((state) => state.setIsSearchMode);
  const setIsFilterMode = useTodoStore((state) => state.setIsFilterMode);
  const clearFilterResults = useTodoStore((state) => state.clearFilterResults);

  const updateSearchTextLen = useTodoStore(
    (state) => state.updateSearchTextLen,
  );

  // LOCAL STATES
  const [searchText, setSearchText] = useState<string>("");
  const inputRef = useRef<TextInput>(null);
  const [hasAnyFilter, setHasAnyFilter] = useState<boolean>(false);
  const [isFilterModalVisible, setIsFilterModalVisible] =
    useState<boolean>(false);

  // REANIMATED SHARED VALUE
  const animValue = useSharedValue(0);
  const showClearButton = isSearchMode && searchText.length > 0;

  useEffect(() => {
    animValue.value = withTiming(showClearButton ? 1 : 0, { duration: 100 });
  }, [showClearButton]);

  useEffect(() => {
    if (!isSearchMode) {
      setSearchText("");
      executeSearch("");
      inputRef.current?.blur();
      Keyboard.dismiss();
    }
  }, [isSearchMode]);

  useEffect(() => {
    const hideListener = Keyboard.addListener("keyboardDidHide", () => {
      inputRef.current?.blur();
    });
    return () => {
      hideListener.remove();
    };
  }, []);

  const handleTextChange = (text: string) => {
    setSearchText(text);
    updateSearchTextLen(text.length);
    executeSearch(text);

    if (text.length >= 1) {
      setIsSearchMode(true);
    }
  };

  const handleOnSubmit = () => {
    Keyboard.dismiss();
  };

  const handleClearSearch = () => {
    setSearchText("");
    updateSearchTextLen(0);
    executeSearch("");
  };

  const handleFiltering = () => {
    if (hasAnyFilter) {
      setIsFilterMode(false);
      clearFilterResults();
      setHasAnyFilter(false);
    } else {
      setIsFilterModalVisible(true);
    }
  };

  // REANIMATED ANIMATED STYLE
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: animValue.value,
      transform: [
        {
          scale: interpolate(
            animValue.value,
            [0, 1],
            [0.7, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.searchAndFilterBar}>
      <TodoFilterModal
        isVisible={isFilterModalVisible}
        setHasAnyFilter={setHasAnyFilter}
        onClose={() => setIsFilterModalVisible(false)}
      />

      <View style={styles.searchBox}>
        <MaterialIcons name={"search"} size={20} color={"#5D5D5D"} />
        <TextInput
          ref={inputRef}
          onChangeText={handleTextChange}
          placeholder="Search todos"
          placeholderTextColor={"#7A7A7A"}
          style={styles.input}
          onSubmitEditing={handleOnSubmit}
          value={searchText}
          spellCheck={false}
          autoCorrect={false}
          autoCapitalize="none"
        />

        <Animated.View
          style={[styles.clearButtonContainer, animatedStyles]}
          pointerEvents={showClearButton ? "auto" : "none"}
        >
          <TouchableOpacity
            onPress={handleClearSearch}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialDesignIcons
              name="close-circle-outline"
              size={18}
              color={"#7A7A7A"}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <TouchableOpacity style={styles.filterBtn} onPress={handleFiltering}>
        <MaterialIcons
          name={hasAnyFilter ? "filter-list-off" : "filter-list"}
          size={28}
          color={"#FFF"}
        />
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
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 0,
    color: "#FFF",
    fontFamily: "Inter-Regular",
    fontSize: 15,
    height: 40,
  },
  clearButtonContainer: {
    marginLeft: 4,
  },
  clearButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  filterBtn: {
    width: "15%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
