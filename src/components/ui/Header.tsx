import { StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
};

export default function Header({ label }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
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
