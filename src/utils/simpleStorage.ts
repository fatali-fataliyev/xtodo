import { createMMKV } from "react-native-mmkv";
import { StateStorage } from "zustand/middleware";

const mmkvInstance = createMMKV({
  id: "settings",
});

export const simpleStorage: StateStorage = {
  setItem: (name, value) => {
    return mmkvInstance.set(name, value);
  },
  getItem: (name) => {
    const value = mmkvInstance.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return mmkvInstance.remove(name);
  },
};
