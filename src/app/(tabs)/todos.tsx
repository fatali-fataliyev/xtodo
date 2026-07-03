import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlowProvider } from "../../components/todos/GlowContext";
import TaskContainer from "../../components/todos/TodoContainer";
import Header from "../../components/ui/Header";

export default function TodosScreen() {
  return (
    <GlowProvider>
      <View style={styles.container}>
        {/* Header */}
        <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
          <Header label="Todos" />
        </SafeAreaView>

        {/* Section */}
        <View style={styles.section}>
          <TaskContainer />
        </View>
      </View>
    </GlowProvider>
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
