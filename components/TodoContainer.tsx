import { useCallback, useEffect, useState } from "react";
import { BackHandler, FlatList, StyleSheet, Text, View } from "react-native";
import EditTodoModal from "./EditTodoModal";
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
    { id: 2, task: "task 1", priorityLevel: "high", isDone: false },
    { id: 3, task: "task 1", priorityLevel: "high", isDone: false },
    { id: 4, task: "task 1", priorityLevel: "high", isDone: false },
    { id: 5, task: "task 1", priorityLevel: "high", isDone: false },
    { id: 6, task: "task 1", priorityLevel: "high", isDone: false },
    { id: 7, task: "task 1", priorityLevel: "high", isDone: false },
    { id: 55, task: "task 1", priorityLevel: "high", isDone: false },
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggleSelection = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const cancelSelection = () => {
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  const handleEditPress = (id: number) => {
    setSelectedTodoId(id);
    setIsEditModalOpen(true);
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

  const renderTodoItem = useCallback(
    ({ item }: { item: Todo }) => {
      return (
        <TodoItem
          id={item.id}
          isSelectionMode={isSelectionMode}
          isSelected={selectedIds.has(item.id)}
          onLongPress={() => setIsSelectionMode(true)}
          onSelect={() => toggleSelection(item.id)}
          task={item.task}
          priorityLevel={item.priorityLevel}
          isDone={item.isDone}
          onEdit={() => handleEditPress(item.id)}
        />
      );
    },
    [isSelectionMode, selectedIds],
  );

  return (
    <View style={styles.container}>
      <View>
        {isSelectionMode && <Text style={{ color: "blue" }}>TOGGLE MENU</Text>}
      </View>

      <FlatList
        data={todos}
        style={styles.listStyle}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id.toString()}
        removeClippedSubviews={true}
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
});
