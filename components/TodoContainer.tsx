import { Colors } from "@/assets/js/colors";
import Fontisto from "@expo/vector-icons/Fontisto";
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
import EditTodoModal from "./EditTodoModal";
import TodoFilterer from "./TodoFilterer";
import TodoItem from "./TodoItem";

type Todo = {
  id: number;
  task: string;
  priorityLevel: string;
  isDone: boolean;
};

export default function TaskContainer() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, task: "task 1", priorityLevel: "high", isDone: false },
    { id: 2, task: "task 2", priorityLevel: "high", isDone: false },
    { id: 3, task: "task 3", priorityLevel: "medium", isDone: true },
    { id: 4, task: "task 4", priorityLevel: "medium", isDone: false },
    { id: 5, task: "task 5", priorityLevel: "medium", isDone: false },
    { id: 6, task: "task 6", priorityLevel: "medium", isDone: false },
    { id: 7, task: "task 7", priorityLevel: "low", isDone: false },
    { id: 8, task: "task 8", priorityLevel: "low", isDone: false },
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const isSelectAll = todos.length > 0 && selectedIds.size === todos.length;

  const toggleSelection = useCallback((id: number) => {
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

  const handleEditPressCall = useCallback((id: number) => {
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
      setSelectedIds(new Set(allIds));
    }
  };

  const deleteAllTodos = () => {
    console.log("deleting: ", selectedIds.size, "selected todos.");
    closeToggleMenu();
  };

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
    paddingVertical: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 15],
    }),
    marginTop: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 10],
    }),
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
          priorityLevel={item.priorityLevel}
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
    if (isSelectionMode) return null;

    return (
      <Animated.View style={{ opacity: searchBarOpacity }}>
        <TodoFilterer />
      </Animated.View>
    );
  }, [isSelectionMode, searchBarOpacity]);

  return (
    <View style={styles.container} onTouchStart={() => Keyboard.dismiss()}>
      {isSelectionMode && (
        <TouchableOpacity
          style={styles.deleteBtn}
          activeOpacity={0.95}
          onPress={deleteAllTodos}
        >
          <Fontisto name="trash" size={24} color={Colors.high} />
        </TouchableOpacity>
      )}

      <Animated.View style={[styles.toggleMenu, animatedStyle]}>
        <TouchableOpacity style={styles.selectAllBtn} onPress={handleSelectAll}>
          <Fontisto
            name={isSelectAll ? "checkbox-active" : "checkbox-passive"}
            size={24}
            color="#FFF"
            style={{ borderRadius: 4 }}
          />
        </TouchableOpacity>
        <Text style={styles.counterText}>
          {selectedIds.size > 0
            ? `${selectedIds.size} ${selectedIds.size === 1 ? "todo" : "todos"} selected`
            : ""}{" "}
        </Text>
        <TouchableOpacity
          style={styles.cancelToggleMenuBtn}
          onPress={closeToggleMenu}
        >
          <Fontisto name="close-a" size={24} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.FlatList
        data={todos}
        style={styles.listStyle}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id.toString()}
        removeClippedSubviews={true}
        extraData={selectedIds}
        ListHeaderComponent={renderListHeader}
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
          todoIdx={selectedTodoId ?? 0}
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
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "95%",
    alignSelf: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    overflow: "hidden",
    paddingHorizontal: 15,
    borderBottomWidth: 0.4,
    borderBottomColor: "#ccc",
  },
  selectAllBtn: {
    width: "20%",
  },
  cancelToggleMenuBtn: {
    paddingLeft: 30,
  },
  deleteBtn: {
    backgroundColor: "#FFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 99999,
    bottom: 20,
    right: 30,
  },
  counterText: {
    color: "white",
    fontFamily: "Inter-Bold",
    fontSize: 16,
  },
});
