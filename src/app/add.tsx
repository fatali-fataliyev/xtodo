import { AddTodoModal } from "@/components/todos/AddTodoModal";
import { router } from "expo-router";
import { useEffect } from "react";
import { BackHandler, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Add() {
  const closePage = () => {
    router.back();
    BackHandler.exitApp();
    return null;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      closePage,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <AddTodoModal isOpen={true} setIsOpen={() => null} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191B1C",
    position: "relative",
  },
});
