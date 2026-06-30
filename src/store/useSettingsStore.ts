import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { simpleStorage } from "../utils/simpleStorage";

interface SettingsState {
  rootPage: string;
  addBtnType: string;
  customAddBtnBg: string;
  customAddBtnIconColor: string;
  doneTodoTextStyle:
    | "none"
    | "line-through"
    | "underline"
    | "underline line-through";
  todoClickSound: string;
  updateRootPage: (page: string) => void;
  updateAddBtnType: (type: string) => void;
  updateDoneTextStyle: (style: SettingsState["doneTodoTextStyle"]) => void;
  updateTodoClickSound: (soundName: string) => void;
  updateCustomAddBtnBg: (style: string) => void;
  updateCustomAddBtnIconColor: (style: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      rootPage: "todos",
      addBtnType: "default",
      doneTodoTextStyle: "underline",
      todoClickSound: "dwLine1Default",
      customAddBtnBg: "#000000",
      customAddBtnIconColor: "#FFFFFF",

      updateRootPage: (page) => set(() => ({ rootPage: page })),

      updateAddBtnType: (type) => set(() => ({ addBtnType: type })),

      updateDoneTextStyle: (style) => set(() => ({ doneTodoTextStyle: style })),

      updateCustomAddBtnBg: (style) => set(() => ({ customAddBtnBg: style })),

      updateCustomAddBtnIconColor: (style) =>
        set(() => ({ customAddBtnIconColor: style })),

      updateTodoClickSound: (soundName) =>
        set(() => ({ todoClickSound: soundName })),
    }),
    {
      name: "app-settings",
      storage: createJSONStorage(() => simpleStorage),
    },
  ),
);
