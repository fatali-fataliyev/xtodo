import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react"; // Added useEffect
import { Button, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getStoredBackgroundColor,
  getStoredFontSize,
  getStoredItemBg,
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
    const itemBg = getStoredItemBg();

    updateTodoListWidget({
      Todos: todos,
      FontSize: fontSize,
      ItemBg: itemBg,
      ListBg: listBg,
    });

    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent:"center", alignItems:"center" }}
    >
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
