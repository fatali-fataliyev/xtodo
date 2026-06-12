import { GetColorByLevel } from "@/assets/js/colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GlowCircle } from "./GlowCircle";

type Props = {
  task: string;
  priorityLevel: string;
  isDone: false;
};

export default function TodoItem({ task, priorityLevel, isDone }: Props) {
  const editTodo = () => {
    console.log("editing todo..");
  };

  const markTodoDone = () => {
    console.log("this todo is done.");
  };

  return (
    <TouchableOpacity style={styles.container} onPress={markTodoDone}>
      <View style={styles.mainAreaContainer}>
        <Fontisto
          name={isDone ? "checkbox-active" : "checkbox-passive"}
          size={20}
          color="#636363"
          style={{ borderRadius: 4 }}
        />
        <Text style={styles.taskText}>{task}</Text>
        <View style={styles.glowCircleContainer}>
          <GlowCircle color={GetColorByLevel(priorityLevel)} size="small" />
        </View>
      </View>
      <TouchableOpacity style={styles.editButton} onPress={editTodo}>
        <FontAwesome6 name="edit" size={20} color="#B3B3B3" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    height: 80,
    borderRadius: 10,
    backgroundColor: "#242424",
    marginVertical: 10,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  mainAreaContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  taskText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#FFF",
    marginLeft: 12,
    marginRight: 8,
    textAlignVertical: "center",
    flexShrink: 1,
  },
  glowCircleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    borderLeftColor: "#454545",
    borderLeftWidth: 1,
    height: "100%",
  },
});
