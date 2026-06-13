import { useState } from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import AddTodoModal from "./AddTodoModal";

const addTodoImg = require("../assets/images/add.png");

export default function AddTodo() {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const handleOnPress = () => {
    setModalVisible(true);
    console.log("implement menu.");
  };

  return (
    <>
      <Pressable onPress={handleOnPress} style={styles.buttonWrapper}>
        {({ pressed }) => (
          <Image
            source={addTodoImg}
            style={pressed ? styles.imageSizePressed : styles.imageSizeNormal}
          />
        )}
      </Pressable>

      <AddTodoModal
        setIsModalVisible={setModalVisible}
        isModalVisible={isModalVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    position: "absolute",
    bottom: 60,
    right: 30,
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
