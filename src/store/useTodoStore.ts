import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { encryptedStorageEngine } from "../utils/secureStorage";

interface Todo {
  id: string;
  task: string;
  priority: string;
  isDone: boolean;
}

export interface TodoSearchResult {
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
  searchResults: TodoSearchResult[];
  filteredTodos: Todo[];
  isSearchMode: boolean;
  isFilterMode: boolean;
  searchTextLen: number;
  addTodo: (todo: Todo) => void;
  markTodoDone: (idx: string) => void;
  updateSearchTextLen: (len: number) => void;
  updateTodo: (id: string, payload: EditPayload) => void;
  deleteByID: (id: string) => void;
  deleteFromSearchResults: (id: string) => void;
  deleteAll: () => void;
  setIsSearchMode: (value: boolean) => void;
  setIsFilterMode: (value: boolean) => void;
  executeSearch: (text: string) => void;
  applyFilters: (filters: string[]) => void;
  clearSearchResults: () => void;
  clearFilterResults: () => void;
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
        searchResults: [],
        filteredTodos: [],
        isSearchMode: false,
        isFilterMode: false,
        searchTextLen: 0,

        addTodo: (newTodo) =>
          set((state) => {
            const updatedTodos = [...state.todos, newTodo];
            return { todos: sortTodos(updatedTodos) };
          }),
        markTodoDone: (id) =>
          set((state) => {
            const updatedTodos = state.todos.map((todo) =>
              todo.id === id
                ? {
                    ...todo,
                    isDone: !todo.isDone,
                  }
                : todo,
            );
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

        applyFilters: (filters) =>
          set((state) => {
            let newFilteredTodos;

            if (filters.includes("completed")) {
              newFilteredTodos = state.todos.filter(
                (todo) =>
                  filters.includes(todo.priority) || todo.isDone === true,
              );
            } else {
              newFilteredTodos = state.todos.filter((todo) =>
                filters.includes(todo.priority),
              );
            }

            return { filteredTodos: newFilteredTodos };
          }),

        deleteByID: (id) =>
          set((state) => {
            const updatedTodos = state.todos.filter((todo) => todo.id !== id);
            return { todos: sortTodos(updatedTodos) };
          }),

        deleteFromSearchResults: (id) =>
          set((state) => ({
            searchResults: state.searchResults.filter((todo) => todo.id !== id),
          })),

        deleteAll: () => set({ todos: [] }),

        clearSearchResults: () => set({ searchResults: [] }),
        clearFilterResults: () => set({ filteredTodos: [] }),
        resetSearchTextLen: () => set({ searchTextLen: 0 }),
        setIsSearchMode: (value) => set({ isSearchMode: value }),
        setIsFilterMode: (value) => set({ isFilterMode: value }),
        updateSearchTextLen: (len: number) => set({ searchTextLen: len }),

        executeSearch: (text) =>
          set((state) => {
            if (!text.trim()) {
              return { searchResults: [] };
            }

            const newSearchResults: TodoSearchResult[] = [];

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
                newSearchResults.push({
                  id: todo.id,
                  task: todo.task,
                  priority: todo.priority,
                  isDone: todo.isDone,
                  indexes: foundIndexes,
                });
              }
            });

            return {
              searchResults: newSearchResults,
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
