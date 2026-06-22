import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { encryptAES256, decryptAES256, generateAESKey } from "./crypto";

export const saveAESKey = async () => {
  let key = generateAESKey();
  await SecureStore.setItemAsync("aes_key", key);
  return key;
};

export const getAESKey = async (): Promise<string | null> => {
  let key = await SecureStore.getItemAsync("aes_key");
  console.log("AES KEY: ", key);

  if (!key) {
    return new Promise((resolve) => {
      Alert.alert(
        "Data Encryption Error",
        "We couldn't verify your secure security key. To continue using the app, we need to reset your key. This will prevent you from reading old todos, this is caused becuase somehow modified or deleted sensetive key from your secure local storage",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => resolve(null),
          },
          {
            text: "Reset & Start Fresh",
            style: "destructive",
            onPress: async () => {
              await AsyncStorage.clear();
              await SecureStore.deleteItemAsync("aes_key");
              await SecureStore.deleteItemAsync("is_first_launch");
              const newKey = await saveAESKey();
              resolve(newKey);
            },
          },
        ],
        { cancelable: false },
      );
    });
  }

  return key;
};

export const encryptedStorageEngine = {
  getItem: async (name: string) => {
    const encryptedValue = await AsyncStorage.getItem(name);
    if (!encryptedValue) return null;

    const key = await getAESKey();
    if (!key) return null;

    try {
      return decryptAES256(encryptedValue, key);
    } catch (e) {
      return null;
    }
  },

  setItem: async (name: string, value: string) => {
    const key = await getAESKey();
    if (!key) return;

    try {
      const encryptedValue = encryptAES256(value, key);
      await AsyncStorage.setItem(name, encryptedValue);
    } catch (err) {
      alert(`failed to encrypt/save data: ${err}`);
    }
  },

  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name);
  },
};
