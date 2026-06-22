import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { encryptedStorageEngine } from "../utils/secureStorage";

interface Todo {
  id: string;
  task: string;
  priority: string;
  isDone: boolean;
}

interface TodoState {
  todos: Todo[];
  addTodo: (todo: Todo) => void;
  deleteByID: (id: string) => void;
  deleteAll: () => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      addTodo: (newTodo) =>
        set((state) => ({
          todos: [...state.todos, newTodo],
        })),
      deleteAll: () => set({ todos: [] }),
      deleteByID: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
    }),
    {
      name: "todos",
      storage: createJSONStorage(() => encryptedStorageEngine),
    },
  ),
);
