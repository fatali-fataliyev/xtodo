import { ScrollView, StyleSheet } from "react-native";
import TodoItem from "./TodoItem";

export default function TaskContainer() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <TodoItem task="ok" isDone={false} priorityLevel="high" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1A1818",
  },
});
