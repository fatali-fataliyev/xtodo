import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Href, Link } from "expo-router";
import { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  href: Href;
  iconName: ComponentProps<typeof MaterialIcons>["name"];
};

export default function Footer({ label, href, iconName }: Props) {
  return (
    <Link href={href} replace asChild>
      <View style={styles.container}>
        <MaterialIcons name={iconName} size={24} color="#D9D9D9" />
        <Text style={styles.label}>{label}</Text>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "#fff",
    fontSize: 11,
  },
});
