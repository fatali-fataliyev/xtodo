import { ScrollView, StyleSheet } from "react-native";
import TodoItem from "./TodoItem";

export default function TaskContainer() {
  const arr = new Array(10).fill(null);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {arr.map((_, idx) => {
        let color = getRandomColor();
        return (
          <TodoItem
            key={idx}
            task={`Task number ${idx + 1}`}
            isDone={true}
            priorityLevel={color}
          />
        );
      })}
    </ScrollView>
  );
}

function getRandomColor(): string {
  const colors = ["high", "medium", "low"];
  return colors[Math.floor(Math.random() * colors.length)];
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1A1818",
  },
});
