import { EditTodoModal } from "@/components/todos/EditTodoModal";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Edit() {
  const { id: todoId } = useLocalSearchParams<{ id: string }>();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1F2122" }}>
      <EditTodoModal isOpen={isOpen} setIsOpen={setIsOpen} todoIdx={todoId} isWidgetMode={true} />
    </SafeAreaView>
  );
}
