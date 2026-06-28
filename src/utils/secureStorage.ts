import { Alert } from "react-native";
import { Configuration, createMMKV, MMKV } from "react-native-mmkv";
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";

const generateAES128Key = (): string => {
  const bytes = Crypto.getRandomBytes(16);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export let mmkvInstance: MMKV | null = null;

export const initializeStorage = async (): Promise<boolean> => {
  if (mmkvInstance) return true;

  let isFirstLaunch = await SecureStore.getItemAsync("hasLaunchedBefore");

  if (!isFirstLaunch) {
    const newKey = generateAES128Key();
    await SecureStore.setItemAsync("aes_key", newKey);
    await SecureStore.setItemAsync("hasLaunchedBefore", "true");
  }

  let key = await SecureStore.getItemAsync("aes_key");

  if (!key) {
    return new Promise((resolve) => {
      Alert.alert(
        "Data Encryption Error",
        "We couldn't verify your secure security key. To continue using the app, we need to reset your key. This will prevent you from reading old todos.",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => resolve(false),
          },
          {
            text: "Reset & Start Fresh",
            style: "destructive",
            onPress: async () => {
              if (mmkvInstance) {
                mmkvInstance.clearAll();
              }
              await SecureStore.deleteItemAsync("aes_key");
              await SecureStore.deleteItemAsync("hasLaunchedBefore");

              const newKey = generateAES128Key();
              await SecureStore.setItemAsync("aes_key", newKey);
              await SecureStore.setItemAsync("hasLaunchedBefore", "true");

              const config: Configuration = {
                id: "secure-todo-storage",
                encryptionKey: newKey,
              };

              mmkvInstance = createMMKV(config);
              resolve(true);
            },
          },
        ],
        { cancelable: false },
      );
    });
  }

  const config: Configuration = {
    id: "secure-todo-storage",
    encryptionKey: key,
  };
  mmkvInstance = createMMKV(config);

  return true;
};

export const zustandStorageEngine = {
  getItem: (name: string): string | null => {
    if (!mmkvInstance) return null;
    return mmkvInstance.getString(name) ?? null;
  },

  setItem: (name: string, value: string): void => {
    if (!mmkvInstance) return;
    mmkvInstance.set(name, value);
  },

  removeItem: (name: string): void => {
    if (!mmkvInstance) return;
    mmkvInstance.remove(name);
  },
};
