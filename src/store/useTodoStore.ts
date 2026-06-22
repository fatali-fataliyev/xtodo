import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { encryptedStorageEngine } from "../utils/secureStorage";

interface Todo {
  id: string;
  task: string;
  priority: string;
  isDone: boolean;
}

type EditPayload = {
  newTask: string;
  newPriority: string;
};

interface TodoState {
  todos: Todo[];
  addTodo: (todo: Todo) => void;
  updateTodo: (id: string, payload: EditPayload) => void;
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

      updateTodo: (id, payload) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  task: payload.newTask,
                  priority: payload.newPriority,
                }
              : todo,
          ),
        })),

      deleteByID: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),

      deleteAll: () => set({ todos: [] }),
    }),
    {
      name: "todos",
      storage: createJSONStorage(() => encryptedStorageEngine),
    },
  ),
);
