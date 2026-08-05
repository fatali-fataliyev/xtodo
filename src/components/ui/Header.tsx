import { StyleSheet, View } from "react-native";

export default function Header() {
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    height: 5,
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
