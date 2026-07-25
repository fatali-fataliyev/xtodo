import {
  BackHandler,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import AddButton from "@/components/ui/AddButton";
import { useNoteStore } from "@/store/useNoteStore";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Text } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import NoteItem from "./NoteItem";
import NoteSearchBar from "./SearchBar";

export default function NotesContainer() {
  // ZUSTAND STORES
  const notes = useNoteStore((store) => store.notes);
  const searchResults = useNoteStore((store) => store.searchResults);
  const deleteByID = useNoteStore((store) => store.deleteByID);
  const deleteAll = useNoteStore((store) => store.deleteAll);
  const setIsSearchMode = useNoteStore((store) => store.setIsSearchMode);
  const searchTextLen = useNoteStore((store) => store.searchTextLen);
  const isSearchMode = useNoteStore((store) => store.isSearchMode);
  const resetSearchTextLen = useNoteStore((store) => store.resetSearchTextLen);
  const clearSearchResults = useNoteStore((store) => store.clearSearchResults);

  // LOCAL STATES
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const isAddButtonHidden = isSelectionMode === true;
  const isSelectAll = notes.length > 0 && selectedIds.size === notes.length;

  console.log("IS SELECTION MODE? :", isSelectionMode);

  // FUNCTIONS
  const router = useRouter();

  const handleNotePress = (id: string) => {
    router.push(`/note/${id}`);
  };

  const handleCreateNew = () => {
    router.push("/note/new");
  };

  const handleLongPress = () => {
    setIsSelectionMode(true);
  };

  const handleOnSelect = (id: string) => {
    setSelectedIds((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const deleteSelectedTodos = () => {
    if (!isSearchMode && selectedIds.size === notes.length) {
      deleteAll();
      setIsSearchMode(false);
      closeSelectionMenu();
      return;
    }

    for (let id of selectedIds) {
      deleteByID(id);
    }

    if (isSearchMode) {
      setIsSearchMode(false);
      resetSearchTextLen();
      clearSearchResults();
    }

    closeSelectionMenu();
  };

  const closeSelectionMenu = () => {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  };

  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedIds(new Set());
    } else {
      const allIds = notes.map((note) => note.id);
      setSelectedIds(new Set(allIds));
    }
  };

  const displayData = useMemo(() => {
    if (isSearchMode && searchTextLen > 0) {
      return searchResults;
    }

    return notes;
  }, [isSearchMode, searchTextLen, searchResults, notes]);

  // ANIMATIONS

  const selectCounter = useSharedValue(0);
  const addBtnAnim = useSharedValue(0);
  const counterBox = useSharedValue(0);
  const closeSearchBtn = useSharedValue(0);

  const headerSearchStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      selectCounter.value,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const counterBoxAnim = useAnimatedStyle(() => ({
    opacity: counterBox.value,
    height: interpolate(counterBox.value, [0, 1], [0, 55], Extrapolation.CLAMP),
    marginTop: interpolate(
      counterBox.value,
      [0, 1],
      [0, 6],
      Extrapolation.CLAMP,
    ),
  }));

  const floatingButtonsStyles = useAnimatedStyle(() => ({
    opacity: selectCounter.value,
    transform: [
      {
        scale: interpolate(
          selectCounter.value,
          [0, 1],
          [0.85, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const closeSearchButton = useAnimatedStyle(() => ({
    opacity: closeSearchBtn.value,
    transform: [
      {
        scale: interpolate(
          closeSearchBtn.value,
          [0, 1],
          [0.85, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const addBtnAnimatedStyle = useAnimatedStyle(() => ({
    opacity: addBtnAnim.value,
    transform: [
      {
        scale: interpolate(
          addBtnAnim.value,
          [0, 1],
          [0.85, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  useEffect(() => {
    const backAction = () => {
      // Exit selection mode if enabled - Prioritized.
      if (isSelectionMode) {
        closeSelectionMenu();
        return true;
      }
      // Exit search mode if enabled
      if (isSearchMode) {
        Keyboard.dismiss();
        setIsSearchMode(false);
        resetSearchTextLen();
        clearSearchResults();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, [isSelectionMode, isSearchMode, setIsSearchMode]);

  useEffect(() => {
    selectCounter.value = withTiming(isSelectionMode ? 1 : 0, {
      duration: 250,
    });

    counterBox.value = withTiming(isSelectionMode ? 1 : 0, {
      duration: 250,
    });

    addBtnAnim.value = withTiming(isSelectionMode ? 0 : 1, {
      duration: 250,
    });
  }, [isSelectionMode]);

  useEffect(() => {
    closeSearchBtn.value = withTiming(isSearchMode ? 1 : 0, {
      duration: 250,
    });
  }, [isSearchMode]);

  const EmptyState = ({ isSearchMode }: { isSearchMode: boolean }) => (
    <View style={styles.listEmptyComponent}>
      {isSearchMode ? (
        <>
          <Ionicons name="telescope" size={20} color="#c1c1c1" />
          <Text style={styles.emptyText}>No notes found</Text>
        </>
      ) : (
        <>
          <MaterialCommunityIcons
            name="note-multiple-outline"
            size={20}
            color="#c1c1c1"
          />
          <Text style={styles.emptyText}>No notes here yet</Text>
        </>
      )}
    </View>
  );

  const renderNoteItem = useCallback(
    ({ item }: { item: any }) => {
      return (
        <NoteItem
          id={item.id}
          title={item.title}
          content={item.content}
          indexes={item.indexes}
          isSelectionMode={isSelectionMode}
          isSelected={selectedIds.has(item.id)}
          onPress={handleNotePress}
          setSelectionMode={setIsSelectionMode}
          onLongPress={handleLongPress}
          onSelect={handleOnSelect}
          createdAt={item.createdAt}
          updatedAt={item.updatedAt}
        />
      );
    },
    [isSelectionMode, selectedIds, handleLongPress],
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={displayData}
        style={[styles.listStyle, { flex: 1 }]}
        renderItem={renderNoteItem}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        itemLayoutAnimation={LinearTransition}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : index.toString()
        }
        extraData={selectedIds}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <Animated.View
            style={headerSearchStyle}
            pointerEvents={isSelectionMode ? "none" : "auto"}
          >
            <NoteSearchBar />
          </Animated.View>
        }
        ListEmptyComponent={<EmptyState isSearchMode={isSearchMode} />}
        contentContainerStyle={{
          paddingBottom: 40,
          paddingTop: 5,
        }}
      />

      {/*Selection buttons*/}

      <Animated.View
        style={[styles.floatingActionContainer, floatingButtonsStyles]}
        pointerEvents={isSelectionMode ? "auto" : "none"}
      >
        <TouchableOpacity
          style={styles.selectionCancelBtn}
          activeOpacity={0.8}
          onPress={closeSelectionMenu}
        >
          <Fontisto name="close-a" size={18} color="#E0E0E0" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.selectionCheckAllBtn}
          activeOpacity={0.8}
          onPress={handleSelectAll}
        >
          <MaterialIcons
            name={isSelectAll ? "blur-off" : "done-all"}
            size={22}
            color="#FFF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.selectionDelBtn}
          activeOpacity={0.8}
          onPress={deleteSelectedTodos}
        >
          <Fontisto name="trash" size={20} color="#FF4D4D" />
        </TouchableOpacity>
      </Animated.View>

      {/* Floating Close search button*/}

      <Animated.View
        style={[styles.closeSearchFloatingContainer, closeSearchButton]}
        pointerEvents={isSearchMode ? "auto" : "none"}
      >
        <TouchableOpacity
          style={styles.closeSearchActionBtn}
          onPress={() => {
            Keyboard.dismiss();
            setIsSearchMode(false);
            resetSearchTextLen();
            clearSearchResults();
          }}
        >
          <MaterialIcons name="search-off" size={24} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>

      {/*Selected notes counter*/}
      <Animated.View style={[styles.toggleMenu, counterBoxAnim]}>
        <Text style={styles.counterText}>
          {selectedIds.size === 0
            ? "Select a note"
            : `${selectedIds.size} ${selectedIds.size === 1 ? "note" : "notes"} selected`}
        </Text>
      </Animated.View>

      {/*ADD NOTE BUTTON*/}

      <Animated.View
        style={addBtnAnimatedStyle}
        pointerEvents={isAddButtonHidden ? "none" : "auto"}
      >
        <AddButton onPress={handleCreateNew} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1818",
    justifyContent: "center",
  },
  header: {
    height: 60,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d9d9d9",
    backgroundColor: "#000000",
  },
  footer: {
    height: 60,
    borderTopWidth: 0.3,
    borderTopColor: "#d9d9d9",
    backgroundColor: "#000000",
  },
  noteItem: {
    backgroundColor: "blue",
    padding: 15,
    marginVertical: 10,
  },
  noteTitle: {
    color: "#CCC",
  },
  listStyle: {
    width: "100%",
  },
  listEmptyComponent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 50,
  },
  emptyText: {
    color: "#c1c1c1",
    marginLeft: 8,
  },
  floatingActionContainer: {
    position: "absolute",
    bottom: 30,
    right: 25,
    zIndex: 99999,
    alignItems: "center",
    gap: 15,
  },
  selectionCheckAllBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  selectionCancelBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  selectionDelBtn: {
    backgroundColor: "#2C1A1A",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#5A2020",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  toggleMenu: {
    position: "absolute",
    top: -5,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: 50,
    alignSelf: "center",
    borderRadius: 30,
  },
  counterText: {
    color: "white",
    fontFamily: "Inter-Bold",
    fontSize: 16,
    textAlign: "center",
  },
  closeSearchFloatingContainer: {
    position: "absolute",
    top: "50%",
    right: 25,
    zIndex: 99999,
  },
  closeSearchActionBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});
