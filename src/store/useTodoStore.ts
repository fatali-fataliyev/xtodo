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
    (set) => {
      const sortTodos = (todosArr: Todo[]): Todo[] => {
        const priorityWeights: Record<string, number> = {
          high: 1,
          medium: 2,
          low: 3,
        };

        return [...todosArr].sort((a, b) => {
          const weightA = priorityWeights[a.priority.toLowerCase()] ?? 99;
          const weightB = priorityWeights[b.priority.toLowerCase()] ?? 99;

          return weightA - weightB;
        });
      };

      return {
        todos: [],
        searchTodos: [],
        isSearchMode: false,
        searchTextLen: 0,

        addTodo: (newTodo) =>
          set((state) => {
            const updatedTodos = [...state.todos, newTodo];
            return { todos: sortTodos(updatedTodos) };
          }),

        updateTodo: (id, payload) =>
          set((state) => {
            const updatedTodos = state.todos.map((todo) =>
              todo.id === id
                ? {
                    ...todo,
                    task: payload.newTask,
                    priority: payload.newPriority,
                  }
                : todo,
            );
            return { todos: sortTodos(updatedTodos) };
          }),

        deleteByID: (id) =>
          set((state) => {
            const updatedTodos = state.todos.filter((todo) => todo.id !== id);
            return { todos: sortTodos(updatedTodos) };
          }),

        deleteFromSearchTodos: (id) =>
          set((state) => ({
            searchTodos: state.searchTodos.filter((todo) => todo.id !== id),
          })),

        deleteAll: () => set({ todos: [] }),

        clearSearchTodos: () => set({ searchTodos: [] }),
        resetSearchTextLen: () => set({ searchTextLen: 0 }),
        setIsSearchMode: (value) => set({ isSearchMode: value }),
        updateSearchTextLen: (len: number) => set({ searchTextLen: len }),

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
      };
    },
    {
      name: "todos",
      storage: createJSONStorage(() => encryptedStorageEngine),
      partialize: (state) => ({ todos: state.todos }),
    },
  ),
);
