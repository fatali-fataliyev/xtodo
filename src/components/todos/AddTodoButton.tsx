import { useSettingsStore } from "@/store/useSettingsStore";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import { Image, Pressable, StyleSheet, TouchableOpacity } from "react-native";

const addTodoImg = require("../../../assets/images/add_neum.png");

type Props = {
  onPress: () => void;
};

export default function AddTodo({ onPress }: Props) {
  const buttonStyle = useSettingsStore((state) => state.addBtnType);

  return buttonStyle === "default" ? (
    <Pressable onPress={onPress} style={styles.buttonWrapper}>
      {({ pressed }) => <AddBtnDefault pressed={pressed} />}
    </Pressable>
  ) : (
    <Pressable style={styles.buttonWrapper}>
      <AddCustomBtn onPress={onPress} />
    </Pressable>
  );
}

function AddBtnDefault({ pressed }: { pressed: boolean }) {
  return (
    <>
      <Image
        source={addTodoImg}
        style={pressed ? styles.imageSizePressed : styles.imageSizeNormal}
      />
    </>
  );
}

function AddCustomBtn({ onPress }: { onPress: () => void }): React.JSX.Element {
  const bgColor = useSettingsStore((state) => state.customAddBtnBg);
  const iconColor = useSettingsStore((state) => state.customAddBtnIconColor);

  return (
    <TouchableOpacity
      style={[styles.customBtn, { backgroundColor: bgColor }]}
      onPress={onPress}
    >
      <FontAwesome6 name="add" size={26} color={iconColor} />
    </TouchableOpacity>
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
  customBtn: {
    width: 60,
    height: 60,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
