import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Href, Link } from "expo-router";
import { ComponentProps } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  label: string;
  href: Href;
  iconName: ComponentProps<typeof MaterialIcons>["name"];
};

export default function Footer({ label, href, iconName }: Props) {
  return (
    <Link href={href} asChild>
      <TouchableOpacity style={styles.container}>
        <MaterialIcons
          name={iconName}
          size={24}
          color="#D9D9D9"
          onPress={() => console.log("href")}
        />
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
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
