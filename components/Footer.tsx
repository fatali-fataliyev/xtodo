import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Href, Link, useRouter } from "expo-router";
import { ComponentProps } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  label: string;
  href: Href;
  iconName: ComponentProps<typeof MaterialIcons>["name"];
};

export default function Footer({ label, href, iconName }: Props) {
  const router = useRouter();

  return (
    <Link href={href} replace asChild onPress={() => router.replace(href)}>
      <TouchableOpacity style={styles.container} activeOpacity={0.7}>
        <MaterialIcons name={iconName} size={24} color="#D9D9D9" />
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </Link>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
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
