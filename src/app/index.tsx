// app/index.tsx
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useTodoStore } from "../store/useTodoStore";
import { initializeStorage } from "../utils/secureStorage";
import TasksScreen from "./tasks";

import Constants from "expo-constants";

const appVersion = Constants.expoConfig?.version;
console.log("Current App Version:", appVersion);

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function setupApp() {
      try {
        const isStorageReady = await initializeStorage();

        if (isStorageReady) {
          await useTodoStore.persist.rehydrate();
        } 
      } catch (error) {
        alert(`Initialization error: ${error}`);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    setupApp();
  }, []);

  if (!isReady) {
    return null;
  }

  return <TasksScreen />;
}
