import NoteEditorScreen from "@/components/notes/NoteEditor";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NoteHandlerScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <NoteEditorScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
