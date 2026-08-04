// app/_layout.tsx
import { GlowProvider } from "@/components/todos/GlowContext";
import { useNoteStore } from "@/store/useNoteStore";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  KeyboardController,
  KeyboardProvider,
} from "react-native-keyboard-controller";
import { useTodoStore } from "../store/useTodoStore";
import { initializeStorage } from "../utils/secureStorage";

KeyboardController.preload();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const appState = useRef(AppState.currentState);
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
    "Inter-Black": Inter_900Black,
  });

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          useTodoStore.persist.rehydrate();
        }
        appState.current = nextAppState;
      },
    );

    const notificationSubscription =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          const actionId = response.actionIdentifier;
          const taskId = response.notification.request.content.data?.taskId;

          const notificationId = response.notification.request.identifier;

          if (!taskId) return;

          if (actionId === "ACTION_COMPLETE") {
            if (typeof notificationId === "string") {
              await Notifications.dismissNotificationAsync(notificationId);
            }
            if (typeof taskId === "string") {
              useTodoStore.getState().markTodoDone(taskId);
            }
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
        }
      } catch (error) {
        console.warn(`Initialization error: ${error}`);
      } finally {
        setAppIsReady(true);
      }
    }

    prepareApp();

    return () => {
      subscription.remove();
      notificationSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, appIsReady]);

  if ((!fontsLoaded && !fontError) || !appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#000000" }}>
      <KeyboardProvider>
        <BottomSheetModalProvider>
          <GlowProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="note/[id]"
                options={{ animation: "slide_from_right" }}
              />

              {/* Routes for deep linking from Widget*/}
              <Stack.Screen name="add" options={{ headerShown: false }} />
              <Stack.Screen name="edit" options={{ headerShown: false }} />
            </Stack>
          </GlowProvider>
        </BottomSheetModalProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
