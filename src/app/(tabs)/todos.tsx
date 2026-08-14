import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TodoContainer from "../../components/todos/TodoContainer";
import Header from "../../components/ui/Header";

export default function TodosScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
        <Header />
      </SafeAreaView>

      {/* Section */}
      <View style={styles.section}>
        <TodoContainer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  headerSafeArea: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#d9d9d9",
    backgroundColor: "#000000",
  },
  section: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "stretch",
  },
});
