import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorageEngine } from "../utils/secureStorage";
import { UpdateWidgetData } from "../../widget/storage";
import {
  cancelAllReminders,
  cancelTaskReminder,
  scheduleTaskReminder,
} from "@/utils/notifications";

export interface Todo {
  id: string;
  notificationID?: string;
  task: string;
  priority: string;
  remindAt?: Date;
  isDone: boolean;
}

interface TodoSearchResult {
  id: string;
  notificationID?: string;
  task: string;
  priority: string;
  isDone: boolean;
  remindAt?: Date;
  indexes: number[];
}

export type EditPayload = {
  newTask: string;
  newPriority: string;
  newRemindAt?: Date;
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
  clearAllDoneTodos: () => void;
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
        todos: [] as Todo[],
        searchResults: [] as TodoSearchResult[],
        filteredTodos: [] as Todo[],
        isSearchMode: false,
        isFilterMode: false,
        searchTextLen: 0,

        addTodo: async (newTodo) => {
          let notificationID: string | undefined;
          if (newTodo.remindAt) {
            notificationID =
              (await scheduleTaskReminder(
                newTodo.id,
                newTodo.task,
                newTodo.remindAt,
              )) ?? undefined;
          }

          if (notificationID) {
            newTodo.notificationID = notificationID;
          }

          set((state) => {
            const updatedTodos = [...state.todos, newTodo];
            const sortedTodos = sortTodos(updatedTodos);

            UpdateWidgetData(sortedTodos);
            return { todos: sortedTodos };
          });
        },

        markTodoDone: async (id) =>
          set((state) => {
            const todo = state.todos.find((t) => t.id === id);
            if (todo && todo.notificationID) {
              cancelTaskReminder(todo.notificationID);
            }

            const updatedTodos = state.todos.map((todo) =>
              todo.id === id ? { ...todo, isDone: !todo.isDone } : todo,
            );

            const updatedSearchResults = state.searchResults.map(
              (searchItem) =>
                searchItem.id === id
                  ? { ...searchItem, isDone: !searchItem.isDone }
                  : searchItem,
            );

            const updatedFilteredTodos = state.filteredTodos.map(
              (filteredItem) =>
                filteredItem.id === id
                  ? { ...filteredItem, isDone: !filteredItem.isDone }
                  : filteredItem,
            );

            const sortedTodos = sortTodos(updatedTodos);
            const sortedSearchResults = sortTodos(
              updatedSearchResults as Todo[],
            ) as TodoSearchResult[];
            const sortedFilteredTodos = sortTodos(updatedFilteredTodos);
            UpdateWidgetData(sortedTodos);
            return {
              todos: sortedTodos,
              searchResults: sortedSearchResults,
              filteredTodos: sortedFilteredTodos,
            };
          }),

        updateTodo: async (id, payload) => {
          const todo = useTodoStore.getState().todos.find((t) => t.id === id);
          const hasFieldsChanged =
            payload.newTask !== todo?.task ||
            payload.newPriority !== todo?.priority;
          const hasDateChanged = payload.newRemindAt !== todo?.remindAt;

          if (todo) {
            if (hasFieldsChanged || hasDateChanged) {
              if (!todo?.remindAt && payload.newRemindAt) {
                todo.remindAt = payload.newRemindAt;
                todo.notificationID = await scheduleTaskReminder(
                  id,
                  payload.newTask,
                  payload.newRemindAt,
                );
              } else {
                if (todo && hasDateChanged && todo.notificationID) {
                  await cancelTaskReminder(todo.notificationID);
                  todo.notificationID = undefined;

                  if (payload.newRemindAt) {
                    todo.notificationID =
                      (await scheduleTaskReminder(
                        id,
                        payload.newTask,
                        payload.newRemindAt,
                      )) ?? undefined;
                  }
                }
              }
            }
          }

          set((state) => {
            const updatedTodos = state.todos.map((todo) =>
              todo.id === id
                ? {
                    ...todo,
                    task: payload.newTask,
                    priority: payload.newPriority,
                    remindAt: payload.newRemindAt,
                  }
                : todo,
            );

            const updatedSearchResult = state.searchResults.map((todo) =>
              todo.id === id
                ? {
                    ...todo,
                    task: payload.newTask,
                    priority: payload.newPriority,
                    remindAt: payload.newRemindAt,
                  }
                : todo,
            );

            const sortedSearchResults = sortTodos(
              updatedSearchResult as Todo[],
            ) as TodoSearchResult[];

            const sortedTodos = sortTodos(updatedTodos);
            UpdateWidgetData(sortedTodos);
            return { todos: sortedTodos, searchResults: sortedSearchResults };
          });
        },

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
            const todo = state.todos.find((t) => t.id === id);
            if (todo && todo.notificationID) {
              cancelTaskReminder(todo.notificationID);
            }

            const updatedTodos = state.todos.filter((todo) => todo.id !== id);
            const sortedTodos = sortTodos(updatedTodos);
            UpdateWidgetData(sortedTodos);
            return { todos: sortedTodos };
          }),

        deleteFromSearchResults: (id) =>
          set((state) => {
            const todo = state.todos.find((t) => t.id === id);
            if (todo && todo.notificationID) {
              cancelTaskReminder(todo.notificationID);
            }

            return {
              searchResults: state.searchResults.filter(
                (todo) => todo.id !== id,
              ),
            };
          }),

        deleteAll: () =>
          set((state) => {
            const todos = state.todos;
            cancelAllReminders(todos);
            UpdateWidgetData([]);
            return { todos: [] };
          }),

        clearSearchResults: () => set({ searchResults: [] }),
        clearFilterResults: () => set({ filteredTodos: [] }),
        clearAllDoneTodos: () =>
          set((state) => {
            const updatedTodos = state.todos.filter(
              (todo) => todo.isDone !== true,
            );
            const sortedTodos = sortTodos(updatedTodos);
            UpdateWidgetData(sortedTodos);

            return {
              todos: sortedTodos,
            };
          }),

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
      storage: createJSONStorage(() => zustandStorageEngine),
      partialize: (state) => ({ todos: state.todos }),
      skipHydration: true,
    },
  ),
);
