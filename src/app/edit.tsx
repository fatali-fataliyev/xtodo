import DateTimePicker from "@expo/ui/community/datetime-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react"; // Added useEffect
import { Button, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getStoredBackgroundColor,
  getStoredFontSize,
  getStoredTodos,
  SaveTodos,
} from "../../widget/storage";
import { updateTodoListWidget } from "../../widget/updateTodoWidget";

const todos = getStoredTodos();

function getIdx(id: string): number {
  const idx = todos.findIndex((todo) => todo.id === id);
  return idx;
}

export default function Edit() {
  const { id: todoId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const todos = getStoredTodos();
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const idx = getIdx(todoId);
    if (idx !== -1) {
      setNewName(todos[idx].task);
    }
  }, [todoId]);

  const handleSave = () => {
    if (!todoId) return;

    const idx = getIdx(todoId);

    console.log("FOUND IDX: ", idx);
    if (idx !== -1) {
      todos[idx].task = newName;
    }

    SaveTodos(todos);

    const fontSize = getStoredFontSize();
    const listBg = getStoredBackgroundColor();

    updateTodoListWidget({
      Todos: todos,
      FontSize: fontSize,
      ListBg: listBg,
    });

    if (router.canGoBack()) {
      router.back();
    }
  };

  const [date, setDate] = useState(new Date());
  // 1. Control picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 2. Handle date change & dismiss
  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Hide picker when action completes (OK, Cancel, or backdrop tap)
    setShowDatePicker(false);

    // If user clicked OK / selected a date (selectedDate is defined)
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>DATETIME PICKING:: </Text>
      {/* Button to open the picker */}
      <Button
        title={`Select Date: ${date.toLocaleDateString()}`}
        onPress={() => setShowDatePicker(true)}
      />

      {/* Render picker conditionally */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          onValueChange={handleDateChange}
          mode="time"
        />
      )}

      <Text>---------------------------------------</Text>
      <Text>EDITING ID: {todoId}</Text>
      <TextInput
        value={newName}
        onChangeText={setNewName}
        placeholder="Loading task..."
        placeholderTextColor="#999"
        style={{
          borderWidth: 1,
          width: 200,
          padding: 8,
          marginVertical: 10,
          color: "#000",
          backgroundColor: "#fff",
        }}
      />

      <Button title="SAVE" onPress={handleSave} />
    </SafeAreaView>
  );
}
