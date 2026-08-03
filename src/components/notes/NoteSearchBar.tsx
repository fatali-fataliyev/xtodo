import { useNoteStore } from "@/store/useNoteStore";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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

export default function NoteSearchBar() {
  // ZUSTAND STATES
  const executeSearch = useNoteStore((state) => state.executeSearch);
  const isSearchMode = useNoteStore((state) => state.isSearchMode);
  const setIsSearchMode = useNoteStore((state) => state.setIsSearchMode);
  const updateSearchTextLen = useNoteStore(
    (state) => state.updateSearchTextLen,
  );

  // LOCAL STATES
  const [searchText, setSearchText] = useState<string>("");
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const inputRef = useRef<TextInput>(null);

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

  if (!isInputFocused) {
    inputRef.current?.blur();
  }

  useEffect(() => {
    const hideListener = Keyboard.addListener("keyboardDidHide", () => {
      setIsInputFocused(false);
    });
    return () => {
      hideListener.remove();
    };
  }, [isInputFocused]);

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
    <View style={styles.searchBar}>
      <View style={styles.searchBox}>
        <Fontisto name="search" size={15} color="#5D5D5D" />
        <TextInput
          ref={inputRef}
          onChangeText={handleTextChange}
          placeholder="Search notes"
          placeholderTextColor={"#7A7A7A"}
          style={styles.input}
          onSubmitEditing={handleOnSubmit}
          value={searchText}
          spellCheck={false}
          autoCorrect={false}
          autoCapitalize="none"
          onTouchStart={() => setIsInputFocused(true)}
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
            <MaterialIcons name="cancel" size={18} color="#7A7A7A" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
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
    width: "100%",
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
});
