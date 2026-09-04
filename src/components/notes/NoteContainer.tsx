import {
  BackHandler,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AddButton from "@/components/ui/AddButton";
import { useNoteStore } from "@/store/useNoteStore";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import Animated, { LinearTransition } from "react-native-reanimated";
import NoteItem from "./NoteItem";
import NoteSearchBar from "./NoteSearchBar";

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

  const shouldAddButtonHide = isSelectionMode;
  const isSelectAll = notes.length > 0 && selectedIds.size === notes.length;

  // FUNCTIONS
  const router = useRouter();

  const handleNotePress = (id: string) => {
    router.push(`/note/${id}`);
  };

  const handleCreateNew = () => {
    router.push("/note/new");
  };

  const handleLongPress = useCallback(() => {
    setIsSelectionMode(true);
  }, []);

  const handleOnSelect = useCallback((id: string) => {
    setSelectedIds((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);

  const closeSelectionMenu = () => {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  };

  const deleteSelectedNotes = () => {
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

  const EmptyState = ({ isSearchMode }: { isSearchMode: boolean }) => (
    <View style={styles.listEmptyComponent}>
      {isSearchMode ? (
        <>
          <MaterialDesignIcons
            name="file-search-outline"
            color={"#C1C1C1"}
            size={20}
          />

          <Text style={styles.emptyText}>No notes found</Text>
        </>
      ) : (
        <>
          <MaterialDesignIcons
            name="note-multiple-outline"
            color={"#C1C1C1"}
            size={20}
          />
          <Text style={styles.emptyText}>No notes here yet</Text>
        </>
      )}
    </View>
  );

  const renderNoteItem = useCallback(
    ({ item }: { item: any }) => (
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
    ),
    [isSelectionMode, selectedIds, handleLongPress, handleOnSelect],
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={displayData}
        showsVerticalScrollIndicator={false}
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
          !isSelectionMode ? (
            <NoteSearchBar />
          ) : (
            <Animated.View style={styles.selectCounter} pointerEvents="auto">
              <Text style={styles.counterText}>
                {selectedIds.size === 0
                  ? "Select a note"
                  : `${selectedIds.size} ${selectedIds.size === 1 ? "note" : "notes"} selected`}
              </Text>
            </Animated.View>
          )
        }
        ListEmptyComponent={<EmptyState isSearchMode={isSearchMode} />}
        contentContainerStyle={{
          paddingBottom: 40,
          paddingTop: 5,
        }}
      />

      {/* Floating Action Elements */}
      {isSelectionMode && (
        <Animated.View
          style={styles.floatingActionContainer}
          pointerEvents="auto"
        >
          <TouchableOpacity
            style={styles.selectionCancelBtn}
            activeOpacity={0.8}
            onPress={closeSelectionMenu}
          >
            <MaterialIcons name="close" color={"#E0E0E0"} size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectionCheckAllBtn}
            activeOpacity={0.8}
            onPress={handleSelectAll}
          >
            <MaterialIcons
              name={isSelectAll ? "remove-done" : "done-all"}
              color={"#FFF"}
              size={20}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectionDelBtn}
            activeOpacity={0.8}
            onPress={deleteSelectedNotes}
          >
            <MaterialIcons name={"delete"} color={"#FF4D4D"} size={20} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Floating Close Search Button */}
      {isSearchMode && (
        <Animated.View
          style={styles.closeSearchFloatingContainer}
          pointerEvents="auto"
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
            <MaterialIcons name={"search-off"} color={"#FFF"} size={20} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Floating Add Button */}
      {!shouldAddButtonHide && (
        <Animated.View pointerEvents="auto">
          <AddButton onPress={handleCreateNew} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1818",
  },
  listStyle: {
    width: "100%",
  },
  selectCounter: {
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: 45,
    alignSelf: "center",
    borderRadius: 30,
    overflow: "hidden",
  },
  counterText: {
    color: "white",
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    textAlign: "center",
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
