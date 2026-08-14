import { StyleSheet, View } from "react-native";
import SettingsContainer from "@/components/settings/SettingsContainer";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      {/* Section */}
      <View style={styles.section}>
        <SettingsContainer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    height: 60,
    paddingTop: 20,
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
