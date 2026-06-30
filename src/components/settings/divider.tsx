import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

type DividerProps = {
  text?: string;
  color?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
};

export default function Divider({
  text,
  color = "#202C33",
  textColor = "#999",
  style,
}: DividerProps) {
  if (text) {
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.line, { backgroundColor: color }]} />
        <Text style={[styles.text, { color: textColor }]}>{text}</Text>
        <View style={[styles.line, { backgroundColor: color }]} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.line,
        { backgroundColor: color, marginVertical: 16 },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
});
