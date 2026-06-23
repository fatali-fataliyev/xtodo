import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { encryptedStorageEngine } from "../utils/secureStorage";

interface Todo {
  id: string;
  task: string;
  priority: string;
  isDone: boolean;
}

export interface SearchTodo {
  id: string;
  task: string;
  priority: string;
  isDone: boolean;
  indexes: number[];
}

type EditPayload = {
  newTask: string;
  newPriority: string;
};

interface TodoState {
  todos: Todo[];
  searchTodos: SearchTodo[];
  isSearchMode: boolean;
  searchTextLen: number;
  addTodo: (todo: Todo) => void;
  updateSearchTextLen: (len: number) => void;
  updateTodo: (id: string, payload: EditPayload) => void;
  deleteByID: (id: string) => void;
  deleteFromSearchTodos: (id: string) => void;
  deleteAll: () => void;
  setIsSearchMode: (value: boolean) => void;
  filterSearchTodos: (text: string) => void;
  clearSearchTodos: () => void;
  resetSearchTextLen: () => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      searchTodos: [],
      isSearchMode: false,
      searchTextLen: 0,
      addTodo: (newTodo) =>
        set((state) => ({
          todos: [...state.todos, newTodo],
        })),

      updateSearchTextLen: (len: number) => set({ searchTextLen: len }),

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

      deleteFromSearchTodos: (id) =>
        set((state) => ({
          searchTodos: state.searchTodos.filter((todo) => todo.id !== id),
        })),

      deleteAll: () => set({ todos: [] }),

      clearSearchTodos: () => set({ searchTodos: [] }),
      resetSearchTextLen: () => set({ searchTextLen: 0 }),
      setIsSearchMode: (value) => set({ isSearchMode: value }),

      filterSearchTodos: (text) =>
        set((state) => {
          if (!text.trim()) {
            return { searchTodos: [] };
          }

          const searchResults: SearchTodo[] = [];

          state.todos.forEach((todo: Todo) => {
            let currentIdx = todo.task
              .toLowerCase()
              .indexOf(text.toLowerCase());
            const foundIndexes: number[] = [];

            while (currentIdx !== -1) {
              foundIndexes.push(currentIdx);
              currentIdx = todo.task
                .toLowerCase()
                .indexOf(text.toLowerCase(), currentIdx + 1);
            }

            if (foundIndexes.length > 0) {
              searchResults.push({
                id: todo.id,
                task: todo.task,
                priority: todo.priority,
                isDone: todo.isDone,
                indexes: foundIndexes,
              });
            }
          });

          return {
            searchTodos: searchResults,
          };
        }),
    }),

    {
      name: "todos",
      storage: createJSONStorage(() => encryptedStorageEngine),
      partialize: (state) => ({ todos: state.todos }),
    },
  ),
);
