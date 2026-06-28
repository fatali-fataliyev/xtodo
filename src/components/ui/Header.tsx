import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
};

export default function Header({ label }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Link href="/settings" asChild>
        <Pressable style={styles.settingsBtn}>
          <MaterialIcons name="settings" size={24} color="#D9D9D9" />
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  label: {
    fontFamily: "Inter-Black",
    fontSize: 19,
    marginLeft: 14,
    color: "#ffffff",
  },
  settingsBtn: {
    marginRight: 14,
  },
});
