import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddTodo from "../../components/AddTodoBtn";
// import AddTodoModal from "../../components/AddTodoModal";
import WrapperComponent from "../../components/AddTodoModal";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

export default function TasksScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header label="Tasks" />
        </View>

        <View style={styles.section}>
          {/*<WrapperComponent />*/}
          <AddTodo />
        </View>

        <View style={styles.footer}>
          <Footer label="Notes" href={"/notes"} iconName="notes" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
  },
  header: {
    flex: 0.06,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d9d9d9",
  },
  section: {
    flex: 0.88,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 0.06,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 0.3,
    borderTopColor: "#d9d9d9",
  },
});
