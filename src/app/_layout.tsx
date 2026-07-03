// app/_layout.tsx
import { useNoteStore } from "@/store/useNoteStore";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTodoStore } from "../store/useTodoStore";
import { initializeStorage } from "../utils/secureStorage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
    "Inter-Black": Inter_900Black,
  });

  useEffect(() => {
    async function prepareApp() {
      try {
        const isStorageReady = await initializeStorage();
        if (isStorageReady) {
          await useTodoStore.persist.rehydrate();
          await useNoteStore.persist.rehydrate();
        }
      } catch (error) {
        console.warn(`Initialization error: ${error}`);
      } finally {
        setAppIsReady(true);
      }
    }
    prepareApp();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, appIsReady]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />

        <Stack.Screen
          name="note/[id]"
          options={{
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
