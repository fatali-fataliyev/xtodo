import { StyleSheet, View } from "react-native";
import NotesContainer from "@/components/notes/NoteContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/ui/Header";

export default function NotesScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
        <Header label="Notes" />
      </SafeAreaView>

      {/* Section */}
      <View style={styles.section}>
        <NotesContainer />
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
