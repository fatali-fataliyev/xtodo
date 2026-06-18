import { Image, Pressable, StyleSheet } from "react-native";

const addTodoImg = require("../assets/images/add.png");

type Props = {
  onPress: () => void;
};

export default function AddTodo({ onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.buttonWrapper}>
      {({ pressed }) => (
        <Image
          source={addTodoImg}
          style={pressed ? styles.imageSizePressed : styles.imageSizeNormal}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    position: "absolute",
    bottom: 20,
    right: 30,
    zIndex: 9999,
  },
  imageSizeNormal: {
    width: 60,
    height: 60,
  },
  imageSizePressed: {
    width: 58,
    height: 58,
  },
});
