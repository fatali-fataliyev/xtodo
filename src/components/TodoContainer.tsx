import { useTodoStore } from "@/store/useTodoStore";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import getQuote from "../constants/getQuote";
import AddTodo from "./AddTodoButton";
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

  // LOCAL STATES
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isTestModalShow, setIsTestModalShow] = useState<boolean>(false);

  const isAddButtonHidden =
    isSelectionMode || isEditModalOpen || isTestModalShow;

  const activeTodos = useMemo(() => {
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

  const isSelectAll =
    activeTodos.length > 0 && selectedIds.size === activeTodos.length;
  const [quote, setQuote] = useState<string>(getQuote().quote);

  console.log(quote);

  // STATE HOOKS
  const toggleSelection = useCallback((id: string) => {
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

  const displayData = useMemo(() => {
    if (isFilterMode) {
      return filterResults;
    }
    if (isSearchMode && searchTextLen > 0) {
      return searchResults;
    }

    return todos.filter((todo) => todo.isDone !== true);
  }, [
    isFilterMode,
    filterResults,
    isSearchMode,
    searchTextLen,
    searchResults,
    todos,
  ]);

  const displayDoneData = useMemo(() => {
    return todos.filter((todo) => todo.isDone === true);
  }, [
    isFilterMode,
    filterResults,
    isSearchMode,
    searchTextLen,
    searchResults,
    todos,
  ]);

  const cancelSelection = () => {
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  useEffect(() => {
    const backAction = () => {
      // Exit selection mode if enabled - Prioritized.
      if (isSelectionMode) {
        cancelSelection();
        return true;
      }
      // Exit search mode if enabled
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

  const handleLongPress = useCallback(() => {
    setIsSelectionMode(true);
  }, []);

  const handleEditPressCall = useCallback((id: string) => {
    setSelectedTodoId(id);
    setIsEditModalOpen(true);
  }, []);

  const closeToggleMenu = () => {
    setSelectedIds(new Set());
    setIsSelectionMode(false);
    setSelectedTodoId(null);
  };

  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedIds(new Set());
    } else {
      const allIds = activeTodos.map((todo) => todo.id);
      setSelectedIds(new Set(allIds));
    }
  };

  const deleteSelectedTodos = () => {
    if (!isSearchMode && selectedIds.size === todos.length) {
      deleteAllTodo();
      setIsSearchMode(false);
      closeToggleMenu();
      return;
    }

    for (let id of selectedIds) {
      deleteTodoByID(id);
    }

    if (isSearchMode) {
      setIsSearchMode(false);
      resetSearchTextLen();
      clearSearchTodos();
    }

    closeToggleMenu();
  };

  // ANIMATIONS
  const animatedValue = useSharedValue(0);
  const selectionAnim = useSharedValue(0);
  const searchAnim = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const arrowRotation = useSharedValue(0);
  const listExpansion = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(isSelectionMode ? 1 : 0, {
      duration: 200,
    });
    selectionAnim.value = withTiming(isSelectionMode ? 1 : 0, {
      duration: 250,
    });
  }, [isSelectionMode]);

  useEffect(() => {
    searchAnim.value = withTiming(isSearchMode ? 1 : 0, { duration: 250 });
  }, [isSearchMode]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animatedValue.value,
    height: interpolate(
      animatedValue.value,
      [0, 1],
      [0, 55],
      Extrapolation.CLAMP,
    ),
    marginTop: interpolate(
      animatedValue.value,
      [0, 1],
      [0, 6],
      Extrapolation.CLAMP,
    ),
  }));

  const floatingButtonsStyles = useAnimatedStyle(() => ({
    opacity: selectionAnim.value,
    transform: [
      {
        scale: interpolate(
          selectionAnim.value,
          [0, 1],
          [0.85, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const addBtnAnim = useSharedValue(1);

  useEffect(() => {
    addBtnAnim.value = withTiming(isAddButtonHidden ? 0 : 1, {
      duration: 250,
    });
  }, [isAddButtonHidden]);

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

  const headerSearchStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedValue.value,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const arrowAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `-${arrowRotation.value}deg` }],
    };
  });

  const doneListAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        listExpansion.value,
        [0, 1],
        [0, 250],
        Extrapolation.CLAMP,
      ),
      opacity: listExpansion.value,
      overflow: "hidden",
    };
  });

  const toggleDoneTodos = () => {
    const nextState = listExpansion.value === 0;
    arrowRotation.value = withTiming(nextState ? 180 : 0, { duration: 800 });
    listExpansion.value = withTiming(nextState ? 1 : 0, { duration: 300 });

    if (displayDoneData.length === 0 && nextState) {
      setQuote(getQuote().quote);
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const renderTodoItem = useCallback(
    ({ item }: { item: any }) => {
      return (
        <TodoItem
          id={item.id}
          task={item.task}
          priority={item.priority}
          isDone={item.isDone}
          indexes={item.indexes}
          isSelectionMode={isSelectionMode}
          isSelected={selectedIds.has(item.id)}
          onLongPress={handleLongPress}
          onSelect={toggleSelection}
          onEdit={handleEditPressCall}
        />
      );
    },
    [
      isSelectionMode,
      selectedIds,
      handleLongPress,
      toggleSelection,
      handleEditPressCall,
    ],
  );

  const EmptyState = ({ isSearchMode }: { isSearchMode: boolean }) => (
    <View style={styles.listEmptyComponent}>
      {isSearchMode ? (
        <>
          <Ionicons name="telescope" size={25} color="#c1c1c1" />
          <Text style={styles.emptyText}>No todos found</Text>
        </>
      ) : (
        <>
          <MaterialCommunityIcons
            name="clipboard-check-multiple-outline"
            size={25}
            color="#c1c1c1"
          />
          <Text style={styles.emptyText}>No todos here yet</Text>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Main FlatList */}
      <Animated.FlatList
        data={displayData}
        style={[styles.listStyle, { flex: 1 }]}
        renderItem={renderTodoItem}
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
            <TodoSearchBar />
          </Animated.View>
        }
        ListEmptyComponent={<EmptyState isSearchMode={isSearchMode} />}
        contentContainerStyle={{
          paddingBottom: 40,
          paddingTop: 5,
        }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />

      {/* Done Todos Toggle Menu */}
      <TouchableOpacity
        style={styles.completedTodosContainer}
        onPress={toggleDoneTodos}
      >
        <View style={styles.divider} />
        <View style={styles.completedTodosToggleMenu}>
          <Text style={styles.completedTodosText}>
            Completed {displayDoneData.length}
          </Text>

          <Animated.View style={arrowAnimatedStyle}>
            <AntDesign name="arrow-down" size={18} color="#454545" />
          </Animated.View>
        </View>
        <View style={styles.divider} />
      </TouchableOpacity>

      {/* Done Todos Flatlist */}
      <Animated.View style={doneListAnimatedStyle}>
        <Animated.FlatList
          data={displayDoneData}
          style={styles.listStyle}
          renderItem={renderTodoItem}
          itemLayoutAnimation={LinearTransition}
          keyExtractor={(item, index) =>
            item?.id ? item.id.toString() : index.toString()
          }
          extraData={selectedIds}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={<Text style={styles.quoteText}>{quote}</Text>}
          contentContainerStyle={{
            paddingBottom: 40,
            paddingTop: 5,
          }}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        />
      </Animated.View>

      {/* Selection Floating Buttons */}
      <Animated.View
        style={[styles.floatingActionContainer, floatingButtonsStyles]}
        pointerEvents={isSelectionMode ? "auto" : "none"}
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

      {/* Selected Todo Counter */}
      <Animated.View style={[styles.toggleMenu, animatedStyle]}>
        <Text style={styles.counterText}>
          {`${selectedIds.size} ${selectedIds.size === 1 ? "todo" : "todos"} selected`}
        </Text>
      </Animated.View>

      {/*Add todo button*/}
      <Animated.View
        style={addBtnAnimatedStyle}
        pointerEvents={isAddButtonHidden ? "none" : "auto"}
      >
        <AddTodo onPress={() => setIsTestModalShow(true)} />
      </Animated.View>

      {/* Todo edit BOTTOM sheet */}
      <EditTodoModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        todoIdx={selectedTodoId ?? ""}
      />

      {/* Add Todo botom sheet*/}
      <AddTodoModal isOpen={isTestModalShow} setIsOpen={setIsTestModalShow} />
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
  quoteText: {
    color: "#c1c1c1",
    textAlign: "center",
    fontFamily: "Inter-Regular",
  },
  completedTodosContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  divider: {
    backgroundColor: "#454545",
    height: 2,
    width: "33%",
  },
  completedTodosToggleMenu: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginLeft: 10,
  },
  completedTodosText: {
    color: "#CCC",
    fontFamily: "Inter-Bold",
    marginRight: 5,
  },
});
