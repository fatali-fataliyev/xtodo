import { useTodoStore } from "@/store/useTodoStore";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddTodo from "./AddTodoButton";
import EditTodoModal from "./EditTodoModal";
import TodoItem from "./TodoItem";
import TodoSearchBar from "./TodoSearchBar";

interface Todo {
  id: string;
  task: string;
  priority: string;
  isDone: boolean;
}

type Props = {
  showAddTodoModalCb: (val: boolean) => void;
};

export default function TodoContainer({ showAddTodoModalCb }: Props) {
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
  const activeTodos = isSearchMode && searchTextLen > 0 ? searchResults : todos;
  const isSelectAll =
    activeTodos.length > 0 && selectedIds.size === activeTodos.length;

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
    setIsSelectionMode(!isSelectionMode);
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
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isSelectionMode ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isSelectionMode, animatedValue]);

  const animatedStyle = {
    opacity: animatedValue,
    height: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 55],
    }),
    marginTop: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 6],
    }),
  };

  const selectionAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(selectionAnim, {
      toValue: isSelectionMode ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isSelectionMode, selectionAnim]);

  const floatingButtonsStyles = {
    opacity: selectionAnim,
    transform: [
      {
        scale: selectionAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.85, 1],
        }),
      },
    ],
  };

  const searchAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(searchAnim, {
      toValue: isSearchMode ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isSearchMode, searchAnim]);

  const searchFloatingBtnStyles = {
    opacity: searchAnim,
    transform: [
      {
        scale: searchAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.85, 1],
        }),
      },
    ],
  };

  const scrollY = useRef(new Animated.Value(0)).current;

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

  return (
    <View style={styles.container}>
      {/*FlatList*/}
      <Animated.FlatList
        data={
          isFilterMode
            ? filterResults
            : isSearchMode && searchTextLen > 0
              ? searchResults
              : todos
        }
        style={styles.listStyle}
        renderItem={renderTodoItem}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : index.toString()
        }
        removeClippedSubviews={true}
        extraData={selectedIds}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <Animated.View
            style={{
              opacity: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            }}
            pointerEvents={isSelectionMode ? "none" : "auto"}
          >
            <TodoSearchBar />
          </Animated.View>
        }
        ListEmptyComponent={
          isSearchMode ? (
            <Text
              style={{ color: "#c1c1c1", alignSelf: "center", marginTop: 50 }}
            >
              No results found. Try searching for something else.
            </Text>
          ) : (
            <Text
              style={{ color: "#c1c1c1", alignSelf: "center", marginTop: 50 }}
            >
              Your list is empty. Tap the button to add a task!
            </Text>
          )
        }
        contentContainerStyle={{
          paddingBottom: 40,
          paddingTop: 5,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      />

      {/*Add Todo Button*/}
      {isSelectionMode ? (
        ""
      ) : (
        <AddTodo onPress={() => showAddTodoModalCb(true)} />
      )}

      {/*Selection FLoating Buttons*/}
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

      {/* Close Search Mode Floating Button */}
      {isSelectionMode ? (
        ""
      ) : (
        <Animated.View
          style={[styles.closeSearchFloatingContainer, searchFloatingBtnStyles]}
          pointerEvents={isSearchMode ? "auto" : "none"}
        >
          <TouchableOpacity
            style={styles.closeSearchActionBtn}
            activeOpacity={0.8}
            onPress={() => {
              setIsSearchMode(false);
              resetSearchTextLen();
              clearSearchTodos();
            }}
          >
            <MaterialIcons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/*Selected Todo Counter*/}
      <Animated.View style={[styles.toggleMenu, animatedStyle]}>
        <Text style={styles.counterText}>
          {selectedIds.size > 0
            ? `${selectedIds.size} ${selectedIds.size === 1 ? "todo" : "todos"} selected`
            : ""}
        </Text>
      </Animated.View>

      {/*Todo edit modal*/}
      {isEditModalOpen && (
        <EditTodoModal
          isModalVisible={isEditModalOpen}
          setIsModalVisible={setIsEditModalOpen}
          todoIdx={selectedTodoId ?? ""}
        />
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
    height: "100%",
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
});
