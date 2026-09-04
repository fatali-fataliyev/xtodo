import { GlowProvider } from "@/components/todos/GlowContext";
import { setupNotificationChannel } from "@/notifications/Notifications";
import { useNoteStore } from "@/store/useNoteStore";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { DarkTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import XTodoAlarms from "../../modules/xtodo-alarms/src";
import { useTodoStore } from "../store/useTodoStore";
import { initializeStorage } from "../utils/secureStorage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-SemiBold": Inter_600SemiBold,
  });

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener(
      "change",
      async (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          try {
            await initializeStorage();

            await useTodoStore.persist.rehydrate();

            processPendingCompletions();
          } catch (error) {
            console.error(
              "Failed to rehydrate Todo store after app became active:",
              error,
            );
          }
        }

        appState.current = nextAppState;
      },
    );

    const completionSubscription = XTodoAlarms.addListener(
      "onTaskCompleted",
      ({ taskId }: { taskId: string }) => {
        try {
          const store = useTodoStore.getState();
          const todo = store.todos.find((item) => item.id === taskId);

          if (todo?.isDone) {
            XTodoAlarms.clearPendingCompletion(taskId);
            return;
          }

          if (todo) {
            store.markTodoDone(taskId);
          }

          XTodoAlarms.clearPendingCompletion(taskId);
        } catch (error) {
          console.error("Failed to process task completion event:", error);
        }
      },
    );

    async function prepareApp() {
      try {
        const isStorageReady = await initializeStorage();

        if (isStorageReady) {
          await Promise.all([
            useTodoStore.persist.rehydrate(),
            useNoteStore.persist.rehydrate(),
          ]);

          setupNotificationChannel();
          processPendingCompletions();
        }
      } catch (error) {
        console.error("Failed to initialize storage:", error);
      } finally {
        setAppIsReady(true);
      }
    }

    prepareApp();

    return () => {
      appStateSubscription.remove();
      completionSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && appIsReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError, appIsReady]);

  if ((!fontsLoaded && !fontError) || !appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#000000" }}>
      <ThemeProvider value={DarkTheme}>
        <BottomSheetModalProvider>
          <GlowProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "#000000" },
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="note/[id]"
                options={{ animation: "slide_from_right" }}
              />

              <Stack.Screen
                name="add"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="edit"
                options={{
                  headerShown: false,
                }}
              />
            </Stack>
          </GlowProvider>
        </BottomSheetModalProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function processPendingCompletions() {
  try {
    const taskIds = XTodoAlarms.getPendingCompletions();

    if (taskIds.length === 0) {
      return;
    }

    const store = useTodoStore.getState();

    for (const taskId of taskIds) {
      const todo = store.todos.find((item) => item.id === taskId);

      if (todo && !todo.isDone) {
        store.markTodoDone(taskId);
      }

      XTodoAlarms.clearPendingCompletion(taskId);
    }
  } catch (error) {
    console.error("Failed to process pending completions:", error);
  }
}
