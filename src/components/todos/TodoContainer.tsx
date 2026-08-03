import { getClickSound } from "@/constants/clickSounds";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useTodoStore } from "@/store/useTodoStore";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAudioPlayer } from "expo-audio";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BackHandler,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import AddTodo from "../ui/AddButton";
import { AddTodoModal } from "./AddTodoModal";
import { EditTodoModal } from "./EditTodoModal";
import TodoItem from "./TodoItem";
import TodoSearchBar from "./TodoSearchBar";

export default function TodoContainer() {
  // ZUSTAND STATES
  const todos = useTodoStore((state) => state.todos);
  const searchResults = useTodoStore((state) => state.searchResults);
  const filterResults = useTodoStore((state) => state.filteredTodos);
  const isSearchMode = useTodoStore((state) => state.isSearchMode);
  const setIsSearchMode = useTodoStore((state) => state.setIsSearchMode);
  const isFilterMode = useTodoStore((state) => state.isFilterMode);
  const searchTextLen = useTodoStore((state) => state.searchTextLen);
  const resetSearchTextLen = useTodoStore((state) => state.resetSearchTextLen);
  const deleteTodoByID = useTodoStore((state) => state.deleteByID);
  const deleteAllTodo = useTodoStore((state) => state.deleteAll);
  const clearSearchTodos = useTodoStore((state) => state.clearSearchResults);
  const clearAllDoneTodos = useTodoStore((state) => state.clearAllDoneTodos);
  const clickSound = useSettingsStore((state) => state.todoClickSound);

  // LOCAL STATES
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [editTodoID, setEditTodoID] = useState<string | null>(null);
  const [bulkDeleteTodoIDs, setBulkDeleteTodoIDs] = useState<Set<string>>(
    new Set(),
  );

  const shouldAddButtonHide =
    isSelectionMode || isEditModalOpen || isAddModalOpen;

  const clickSoundSrc = useMemo(() => getClickSound(clickSound), [clickSound]);
  const clickPlayer = useAudioPlayer(clickSoundSrc);

  const handlePlaySound = useCallback(() => {
    clickPlayer.seekTo(0);
    clickPlayer.play();
  }, [clickPlayer]);

  const undoneTodos = useMemo(() => {
    if (isSearchMode && searchTextLen > 0) {
      return searchResults;
    }
    if (isFilterMode) {
      return filterResults;
    }
    return todos.filter((todo) => todo.isDone !== true);
  }, [
    isSearchMode,
    searchTextLen,
    searchResults,
    isFilterMode,
    filterResults,
    todos,
  ]);

  const toggleTodoIDSelection = useCallback((id: string) => {
    setBulkDeleteTodoIDs((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);

  const doneTodos = useMemo(() => {
    return todos.filter((todo) => todo.isDone === true);
  }, [todos]);

  const cancelSelection = () => {
    setBulkDeleteTodoIDs(new Set());
    setIsSelectionMode(false);
  };

  const allVisibleTodos = useMemo(() => {
    if (isSearchMode && searchTextLen > 0) return searchResults;
    if (isFilterMode) return filterResults;
    return [...undoneTodos, ...doneTodos];
  }, [
    isSearchMode,
    searchTextLen,
    searchResults,
    isFilterMode,
    filterResults,
    undoneTodos,
    doneTodos,
  ]);

  const isDeleteAll =
    allVisibleTodos.length > 0 &&
    bulkDeleteTodoIDs.size === allVisibleTodos.length;

  useEffect(() => {
    const backAction = () => {
      if (isSelectionMode) {
        cancelSelection();
        return true;
      }
      if (isSearchMode) {
        Keyboard.dismiss();
        setIsSearchMode(false);
        resetSearchTextLen();
        clearSearchTodos();
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
    if (doneTodos.length === 0) {
      listExpansion.value = 0;
      arrowRotation.value = 0;
    }
  }, [doneTodos.length]);

  const handleLongPress = useCallback(() => {
    setIsSelectionMode(true);
  }, []);

  const openEditModalCB = useCallback((id: string) => {
    setEditTodoID(id);
    setIsEditModalOpen(true);
  }, []);

  const closeToggleMenu = () => {
    setBulkDeleteTodoIDs(new Set());
    setIsSelectionMode(false);
    setEditTodoID(null);
  };

  const handleSelectAll = () => {
    if (isDeleteAll) {
      setBulkDeleteTodoIDs(new Set());
    } else {
      const allIds = allVisibleTodos.map((todo) => todo.id);
      setBulkDeleteTodoIDs(new Set(allIds));
    }
  };

  const handleClearAllDoneTodos = () => {
    listExpansion.value = withTiming(0, { duration: 200 });
    arrowRotation.value = withTiming(0, { duration: 200 });

    clearAllDoneTodos();
  };

  const deleteSelectedTodos = () => {
    if (!isSearchMode && bulkDeleteTodoIDs.size === todos.length) {
      deleteAllTodo();
      setIsSearchMode(false);
      closeToggleMenu();
      return;
    }

    for (let id of bulkDeleteTodoIDs) {
      deleteTodoByID(id);
    }

    if (isSearchMode) {
      setIsSearchMode(false);
      resetSearchTextLen();
      clearSearchTodos();
    }
    closeToggleMenu();
  };

  const doneHeaderOpacity = useSharedValue(1);
  const arrowRotation = useSharedValue(0);
  const listExpansion = useSharedValue(0);
  const hasDone = doneTodos.length > 0;

  const arrowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${arrowRotation.value}deg` }],
  }));

  const doneListAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      listExpansion.value,
      [0, 1],
      [0, 250],
      Extrapolation.CLAMP,
    ),
    opacity: listExpansion.value,
    overflow: "hidden",
  }));

  const doneListHeaderAnimatedStyle = useAnimatedStyle(() => ({
    opacity: doneHeaderOpacity.value,
  }));

  const toggleDoneTodos = () => {
    const nextState = listExpansion.value === 0;
    arrowRotation.value = withTiming(nextState ? 180 : 0, { duration: 300 });
    listExpansion.value = withTiming(nextState ? 1 : 0, { duration: 300 });
  };

  const renderTodoItem = useCallback(
    ({ item }: { item: any }) => (
      <TodoItem
        id={item.id}
        task={item.task}
        remindAt={item.remindAt}
        priority={item.priority}
        isDone={item.isDone}
        indexes={item.indexes}
        isSelectionMode={isSelectionMode}
        isSelected={bulkDeleteTodoIDs.has(item.id)}
        onLongPress={handleLongPress}
        onSelect={toggleTodoIDSelection}
        onEdit={openEditModalCB}
        onClickPlaySound={handlePlaySound}
      />
    ),
    [
      isSelectionMode,
      bulkDeleteTodoIDs,
      handleLongPress,
      toggleTodoIDSelection,
      openEditModalCB,
      handlePlaySound,
    ],
  );

  const EmptyState = ({ isSearchMode }: { isSearchMode: boolean }) => (
    <View style={styles.listEmptyComponent}>
      {isSearchMode ? (
        <>
          <Ionicons name="telescope" size={20} color="#c1c1c1" />
          <Text style={styles.emptyText}>No todos found</Text>
        </>
      ) : (
        <>
          <MaterialCommunityIcons
            name="clipboard-check-multiple-outline"
            size={20}
            color="#c1c1c1"
          />
          <Text style={styles.emptyText}>No todos here yet</Text>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={undoneTodos}
        style={[styles.listStyle, { flex: 1 }]}
        renderItem={renderTodoItem}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        itemLayoutAnimation={LinearTransition}
        keyExtractor={(item) => item.id}
        extraData={bulkDeleteTodoIDs}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          !isSelectionMode ? (
            <TodoSearchBar />
          ) : (
            <Animated.View style={styles.selectCounter} pointerEvents="auto">
              <Text style={styles.counterText}>
                {bulkDeleteTodoIDs.size === 0
                  ? "Select a todo"
                  : `${bulkDeleteTodoIDs.size} ${bulkDeleteTodoIDs.size === 1 ? "todo" : "todos"} selected`}
              </Text>
            </Animated.View>
          )
        }
        ListEmptyComponent={<EmptyState isSearchMode={isSearchMode} />}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 5 }}
      />

      {hasDone && (
        <>
          <Animated.View style={doneListHeaderAnimatedStyle}>
            <TouchableOpacity
              style={styles.completedTodosContainer}
              onPress={toggleDoneTodos}
              activeOpacity={0.7}
            >
              <View style={styles.divider} />
              <View style={styles.completedTodosToggleMenu}>
                <View style={styles.doneTodosTextContainer}>
                  <Text style={styles.completedTodosText}>
                    Done ({doneTodos.length})
                  </Text>
                  <Animated.View style={arrowAnimatedStyle}>
                    <AntDesign name="arrow-down" size={14} color="#454545" />
                  </Animated.View>
                </View>
              </View>
              <View style={styles.divider} />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={doneListAnimatedStyle}>
            <Animated.FlatList
              data={doneTodos}
              style={styles.listStyle}
              renderItem={renderTodoItem}
              initialNumToRender={15}
              maxToRenderPerBatch={10}
              ListHeaderComponent={
                <Animated.View
                  pointerEvents={doneTodos.length === 0 ? "none" : "auto"}
                >
                  <TouchableOpacity
                    style={styles.clearDoneTodosBtn}
                    activeOpacity={0.8}
                    onPress={handleClearAllDoneTodos}
                  >
                    <Fontisto name="trash" size={16} color="#FF4D4D" />
                  </TouchableOpacity>
                </Animated.View>
              }
              windowSize={5}
              removeClippedSubviews={true}
              itemLayoutAnimation={LinearTransition}
              keyExtractor={(item) => item.id}
              extraData={bulkDeleteTodoIDs}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 40, paddingTop: 5 }}
            />
          </Animated.View>
        </>
      )}

      {/* Floating Action Elements */}
      {isSelectionMode && (
        <Animated.View
          style={styles.floatingActionContainer}
          pointerEvents="auto"
        >
          <TouchableOpacity
            style={styles.selectionCancelBtn}
            activeOpacity={0.8}
            onPress={closeToggleMenu}
          >
            <Fontisto name="close-a" size={18} color="#E0E0E0" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.selectionCheckAllBtn}
            activeOpacity={0.8}
            onPress={handleSelectAll}
          >
            <MaterialIcons
              name={isDeleteAll ? "blur-off" : "done-all"}
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
              clearSearchTodos();
            }}
          >
            <MaterialIcons name="search-off" size={24} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Floating Add Button*/}
      {!shouldAddButtonHide && (
        <Animated.View pointerEvents="auto">
          <AddTodo onPress={() => setIsAddModalOpen(true)} />
        </Animated.View>
      )}

      {/* EDIT MODAL */}
      <EditTodoModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        todoIdx={editTodoID ?? ""}
      />

      <AddTodoModal isOpen={isAddModalOpen} setIsOpen={setIsAddModalOpen} />
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
  floatingActionContainer: {
    position: "absolute",
    bottom: 30,
    right: 25,
    zIndex: 99999,
    alignItems: "center",
    gap: 15,
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
  completedTodosContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  divider: {
    backgroundColor: "#454545",
    flex: 1,
    height: 1,
  },
  completedTodosToggleMenu: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  completedTodosText: {
    color: "#CCC",
    fontFamily: "Inter-Bold",
    marginRight: 5,
    fontSize: 14,
  },
  clearDoneTodosBtn: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0, 0.4)",
    width: 50,
    alignSelf: "flex-end",
    marginRight: 10,
  },
  doneTodosTextContainer: {
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
});
