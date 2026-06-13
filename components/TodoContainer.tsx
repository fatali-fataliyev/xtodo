import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import EditTodoModal from "./EditTodoModal";
import TodoItem from "./TodoItem";

export default function TaskContainer() {
  const [todos, setTodos] = useState([
    { task: "task 1", priorityLevel: "high", isDone: false },
    { task: "task 2", priorityLevel: "high", isDone: false },
    { task: "task 3", priorityLevel: "medium", isDone: false },
    { task: "task 4", priorityLevel: "medium", isDone: false },
    { task: "task 5 ", priorityLevel: "medium", isDone: false },
    { task: "task 6 ", priorityLevel: "low", isDone: false },
    { task: "task 7", priorityLevel: "low", isDone: false },
  ]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTodoIdx, setSelectedTodoIdx] = useState<number | null>(null);

  const handleEditPress = (index: number) => {
    setSelectedTodoIdx(index);
    setIsEditModalOpen(true);
  };
  const handleSaveTodo = (name: string, priority: string) => {
    if (selectedTodoIdx !== null) {
      console.log("Updating item at index:", selectedTodoIdx, name, priority);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={todos}
        style={styles.listStyle}
        renderItem={({ item, index }) => (
          <TodoItem
            task={item.task}
            priorityLevel={item.priorityLevel}
            isDone={item.isDone}
            onEdit={() => handleEditPress(index)}
          />
        )}
      />

      <EditTodoModal
        isModalVisible={isEditModalOpen}
        setIsModalVisible={setIsEditModalOpen}
        todoIdx={selectedTodoIdx ?? 0}
        onSaveTodo={handleSaveTodo}
      />
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
