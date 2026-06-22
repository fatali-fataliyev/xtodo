import { useTodoStore } from "@/store/useTodoStore";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  Keyboard,
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
  const todos = useTodoStore((state) => state.todos);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const isSelectAll = todos.length > 0 && selectedIds.size === todos.length;

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
      if (isSelectionMode) {
        cancelSelection();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, [isSelectionMode]);

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
      const allIds = todos.map((todo) => todo.id);
      // setSelectedIds(new Set(allIds));
    }
  };

  const deleteAllTodos = () => {
    console.log("deleting: ", selectedIds.size, "selected todos.");
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

  const scrollY = useRef(new Animated.Value(0)).current;

  const searchBarOpacity = scrollY.interpolate({
    inputRange: [0, 35],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const renderTodoItem = useCallback(
    ({ item }: { item: Todo }) => {
      return (
        <TodoItem
          id={item.id}
          isSelectionMode={isSelectionMode}
          isSelected={selectedIds.has(item.id)}
          onLongPress={handleLongPress}
          onSelect={toggleSelection}
          task={item.task}
          priority={item.priority}
          isDone={item.isDone}
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

  const renderListHeader = useCallback(() => {
    const headerOpacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

    return (
      <Animated.View style={{ opacity: searchBarOpacity }}>
        <Animated.View
          style={{ opacity: headerOpacity }}
          pointerEvents={isSelectionMode ? "none" : "auto"}
        >
          <TodoSearchBar />
        </Animated.View>
      </Animated.View>
    );
  }, [searchBarOpacity, animatedValue, isSelectionMode]);

  return (
    <View style={styles.container} onTouchStart={() => Keyboard.dismiss()}>
      {isSelectionMode ? (
        ""
      ) : (
        <AddTodo onPress={() => showAddTodoModalCb(true)} />
      )}

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
          onPress={deleteAllTodos}
        >
          <Fontisto name="trash" size={20} color="#FF4D4D" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.toggleMenu, animatedStyle]}>
        <Text style={styles.counterText}>
          {selectedIds.size > 0
            ? `${selectedIds.size} ${selectedIds.size === 1 ? "todo" : "todos"} selected`
            : ""}
        </Text>
      </Animated.View>

      <Animated.FlatList
        data={todos}
        style={styles.listStyle}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id.toString()}
        removeClippedSubviews={true}
        extraData={selectedIds}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={
          <Text
            style={{ color: "#c1c1c1", alignSelf: "center", marginTop: 50 }}
          >
            Nothing here yet. Add a todo
          </Text>
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

      {isEditModalOpen && (
        <EditTodoModal
          isModalVisible={isEditModalOpen}
          setIsModalVisible={setIsEditModalOpen}
          todoIdx={selectedTodoId ?? ""}
          onSaveTodo={() => null}
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
});
