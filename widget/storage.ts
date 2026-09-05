import { type MMKV, createMMKV } from "react-native-mmkv";
import * as SecureStore from "expo-secure-store";
import { Todo } from "@/store/useTodoStore";
import { updateTodoListWidget } from "./updateTodoWidget";
import { ColorProp } from "react-native-android-widget";

export let mmkvStorage: MMKV | null = null;
export let settingsMMKV: MMKV | null = null;

const TODO_LIST_KEY = "todos";
const SS_AES_KEY = "aes_key"; // SS = Secure Storage

export const TODO_LIST_BG_KEY = "bgColor";
export const TODO_TEXT_FONTSIZE_KEY = "fontSize";
export const HOUR_FORMAT_KEY = "hourFormat";

function initMMKVStorage() {
  if (mmkvStorage) return;

  let key = SecureStore.getItem(SS_AES_KEY);
  if (!key) {
    return;
  }

  mmkvStorage = createMMKV({
    id: "secure-app-storage",
    encryptionKey: key,
  });
}

function initSettingsMMKV() {
  if (settingsMMKV) return;
  settingsMMKV = createMMKV({
    id: "app-settings",
  });
}

export function getStoredTodos(): Todo[] {
  initMMKVStorage();

  if (!mmkvStorage) return [];

  const data = mmkvStorage.getString(TODO_LIST_KEY);

  if (!data) return [];

  try {
    const parsed = JSON.parse(data);

    let todos: Todo[] = [];

    if (parsed && parsed.state && Array.isArray(parsed.state.todos)) {
      todos = parsed.state.todos;
    } else if (Array.isArray(parsed)) {
      todos = parsed;
    } else {
      return [];
    }

    return todos.map((todo) => ({
      ...todo,
      remindAt: todo.remindAt ? new Date(todo.remindAt) : undefined,
    }));
  } catch {
    return [];
  }
}

export function getStoredBackgroundColor(): ColorProp {
  initMMKVStorage();
  if (!mmkvStorage) return "#1F2937";
  const stored = mmkvStorage.getString(TODO_LIST_BG_KEY);
  let parsed: string = "";
  if (stored) {
    parsed = stored.slice(1);
  }

  let result: ColorProp = parsed ? `#${parsed}` : `#1F2937`;
  return result;
}

export function getStoredFontSize(): number {
  initMMKVStorage();
  if (!mmkvStorage) return 10;
  return Number(mmkvStorage.getString(TODO_TEXT_FONTSIZE_KEY)) || 10;
}

export function getStoredHourFormat(): number {
  initSettingsMMKV();
  if (!settingsMMKV) return 24;
  return Number(settingsMMKV?.getString(HOUR_FORMAT_KEY)) || 24;
}

export function SaveTodos(todos: Todo[]) {
  initMMKVStorage();
  const sortedTodos = sortTodos(todos);
  if (!mmkvStorage) return;

  const zustandFormat = {
    state: {
      todos: sortedTodos,
    },
    version: 0,
  };

  mmkvStorage.set(TODO_LIST_KEY, JSON.stringify(zustandFormat));
}

function sortTodos(Todos: Todo[]): Todo[] {
  const priorityWeights: Record<string, number> = {
    high: 1,
    medium: 2,
    low: 3,
  };

  return [...Todos].sort((a, b) => {
    if (a.isDone !== b.isDone) {
      return a.isDone ? 1 : -1;
    }

    const weightA = priorityWeights[a.priority.toLowerCase()] ?? 99;
    const weightB = priorityWeights[b.priority.toLowerCase()] ?? 99;

    return weightA - weightB;
  });
}

export function UpdateWidgetData(latestTodos: Todo[]) {
  const sortedTodos = sortTodos(latestTodos);
  const listBg = getStoredBackgroundColor();
  const fontSize = getStoredFontSize();
  const hourFormat = getStoredHourFormat();

  updateTodoListWidget({
    Todos: sortedTodos,
    ListBg: listBg,
    FontSize: fontSize,
    HourFormat: hourFormat,
  });
}
