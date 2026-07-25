import { useState } from "react";
import {
  Button,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getStoredTodos, SaveTodo } from "../../widget/storage";

type PriorityType = "high" | "medium" | "low";

export default function Add() {
  const [name, setName] = useState<string>("");
  const [priority, setPriority] = useState<PriorityType>("medium");

  const todos = getStoredTodos();

  const handleSave = () => {
    if (!name.trim()) return;

    SaveTodo({
      id: Date.now().toString(),
      task: name,
      priority: priority,
      isDone: false,
    });

    setName("");
    setPriority("medium");
    Keyboard.dismiss();
  };

  const priorityOptions: PriorityType[] = ["low", "medium", "high"];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
        <Text style={{ color: "#000", fontWeight: "bold" }}>TODOS:</Text>
        {todos.map((todo) => (
          <View
            key={todo.id}
            style={{
              width: 120,
              borderWidth: 1,
              borderColor: "red",
              marginVertical: 3,
              justifyContent: "center",
              alignItems: "center",
              padding: 4,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
            }}
          >
            <Text
              style={{
                textDecorationLine: todo.isDone ? "line-through" : "none",
              }}
            >
              {todo.task} ({todo.priority})
            </Text>
          </View>
        ))}

        <TextInput
          placeholder="Todo name"
          onChangeText={setName}
          style={{
            borderColor: "#000",
            borderWidth: 2,
            marginBottom: 15,
            width: "50%",
            padding: 8,
            backgroundColor: "#fff",
          }}
          value={name}
        />

        <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Priority:</Text>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 25,
            width: "70%",
            justifyContent: "space-between",
          }}
        >
          {priorityOptions.map((option) => {
            const isSelected = priority === option;
            return (
              <TouchableOpacity
                key={option}
                onPress={() => setPriority(option)}
                style={{
                  flex: 1,
                  marginHorizontal: 4,
                  paddingVertical: 10,
                  borderWidth: 1,
                  borderColor: "#000",
                  borderRadius: 6,
                  alignItems: "center",
                  backgroundColor: isSelected ? "#000" : "#fff",
                }}
              >
                <Text
                  style={{
                    textTransform: "capitalize",
                    fontWeight: isSelected ? "bold" : "normal",
                    color: isSelected ? "#fff" : "#000",
                  }}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button title="SAVE" onPress={handleSave} />
      </View>
    </SafeAreaView>
  );
}
