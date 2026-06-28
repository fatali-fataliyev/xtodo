import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Footer from "../components/Footer";
import Header from "../components/Header";
import TaskContainer from "../components/TodoContainer";
import { GlowProvider } from "@/components/GlowContext";

export default function TodosScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <GlowProvider>
      <View style={styles.container}>
        {/*Header*/}
        <View style={styles.header}>
          <Header label="Todos" />
        </View>

        {/*Section*/}
        <View style={styles.section}>
          <TaskContainer />
        </View>

        {/*Footer*/}
        <View style={styles.footer}>
          <Footer label="Notes" href={"/notes"} iconName="notes" />
        </View>
        </View>
      </GlowProvider>
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
    height: 60,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d9d9d9",
    backgroundColor: "#000000",
  },
  section: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "stretch",
  },
  footer: {
    height: 60,
    borderTopWidth: 0.3,
    borderTopColor: "#d9d9d9",
    backgroundColor: "#000000",
  },
});
