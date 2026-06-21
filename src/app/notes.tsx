import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Footer from "../components/Footer";
import Header from "../components/Header";

export default function NotesScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/*Header*/}
        <View style={styles.header}>
          <Header label="Notes" />
        </View>

        {/*Section*/}
        <View style={styles.section}></View>

        {/*Footer*/}
        <View style={styles.footer}>
          <Footer label="Tasks" href={"/tasks"} iconName="task-alt" />
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
