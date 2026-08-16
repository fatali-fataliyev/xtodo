import { AddTodoModal } from "@/components/todos/AddTodoModal";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Add() {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1F2122" }}>
      <AddTodoModal isOpen={isOpen} setIsOpen={setIsOpen} isWidgetMode={true} />
    </SafeAreaView>
  );
}
