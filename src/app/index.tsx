// app/index.tsx

import { getAESKey, saveAESKey } from "@/utils/secureStorage";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { BackHandler } from "react-native";
import TasksScreen from "./tasks";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initializeApp() {
      try {
        const hasLaunchedBefore =
          await SecureStore.getItemAsync("is_first_launch");

        if (hasLaunchedBefore !== null) {
          console.log("NOT FIRST LAUNCH!");
          const key = await getAESKey();

          if (!key) {
            BackHandler.exitApp();
            console.warn(
              "App initialized but key validation failed/cancelled.",
            );
          }
        } else {
          console.warn("First launch...");
          await SecureStore.setItemAsync("is_first_launch", "false");
          await saveAESKey();
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    initializeApp();
  }, []);

  if (!isReady) {
    return null;
  }

  return <TasksScreen />;
}
