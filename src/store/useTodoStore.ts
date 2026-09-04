import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { UpdateWidgetData } from "../../widget/storage";
import {
  cancelAllReminders,
  cancelTaskReminder,
  scheduleTaskReminder,
} from "@/notifications/Notifications";
import { zustandStorageEngine } from "../utils/secureStorage";

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
  markTodoDone: (id: string) => void;
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
        todos: [],
        searchResults: [],
        filteredTodos: [],
        isSearchMode: false,
        isFilterMode: false,
        searchTextLen: 0,

        addTodo: (newTodo) => {
          if (newTodo.remindAt) {
            const alarmId = scheduleTaskReminder(
              newTodo.id,
              newTodo.task,
              newTodo.remindAt,
            );
            newTodo.notificationID = alarmId;
          }

          set((state) => {
            const updatedTodos = [...state.todos, newTodo];
            const sortedTodos = sortTodos(updatedTodos);

            UpdateWidgetData(sortedTodos);

            return {
              todos: sortedTodos,
            };
          });
        },

        markTodoDone: (id) =>
          set((state) => {
            const todo = state.todos.find((item) => item.id === id);

            if (todo?.remindAt) {
              cancelTaskReminder(id);
            }

            const updatedTodos = state.todos.map((item) =>
              item.id === id
                ? {
                    ...item,
                    isDone: !item.isDone,
                    notificationID: undefined,
                  }
                : item,
            );

            const updatedSearchResults = state.searchResults.map((item) =>
              item.id === id
                ? {
                    ...item,
                    isDone: !item.isDone,
                    notificationID: undefined,
                  }
                : item,
            );

            const updatedFilteredTodos = state.filteredTodos.map((item) =>
              item.id === id
                ? {
                    ...item,
                    isDone: !item.isDone,
                    notificationID: undefined,
                  }
                : item,
            );

            const sortedTodos = sortTodos(updatedTodos);
            const sortedSearchResults = sortTodos(updatedSearchResults as Todo[]) as TodoSearchResult[];
            const sortedFilteredTodos = sortTodos(updatedFilteredTodos);

            UpdateWidgetData(sortedTodos);

            return {
              todos: sortedTodos,
              searchResults: sortedSearchResults,
              filteredTodos: sortedFilteredTodos,
            };
          }),

        updateTodo: (id, payload) => {
          const todo = useTodoStore.getState().todos.find((item) => item.id === id);

          if (!todo) {
            return;
          }

          const hasFieldsChanged = payload.newTask !== todo.task || payload.newPriority !== todo.priority;

          const oldRemindAt = todo.remindAt;
          const newRemindAt = payload.newRemindAt;

          const hasDateChanged = oldRemindAt?.getTime() !== newRemindAt?.getTime();
          if (!hasFieldsChanged && !hasDateChanged) {
            return;
          }

          let notificationID = todo.notificationID;

          if (hasDateChanged) {
            let newNotificationID: string | undefined;
            if (newRemindAt) {
              newNotificationID = scheduleTaskReminder(
                id,
                payload.newTask,
                newRemindAt,
              );
            }

            if (oldRemindAt) {
              cancelTaskReminder(id);
            }

            notificationID = newNotificationID;
          }

          if (hasFieldsChanged && !hasDateChanged && oldRemindAt) {
            const newNotificationID = scheduleTaskReminder(
              id,
              payload.newTask,
              oldRemindAt,
            );

            notificationID = newNotificationID;
          }

          set((state) => {
            const updatedTodos = state.todos.map((item) =>
              item.id === id
                ? {
                    ...item,
                    task: payload.newTask,
                    priority: payload.newPriority,
                    remindAt: newRemindAt,
                    notificationID,
                  }
                : item,
            );

            const updatedSearchResults = state.searchResults.map((item) =>
              item.id === id
                ? {
                    ...item,
                    task: payload.newTask,
                    priority: payload.newPriority,
                    remindAt: newRemindAt,
                    notificationID,
                  }
                : item,
            );

            const sortedTodos = sortTodos(updatedTodos);
            const sortedSearchResults = sortTodos(updatedSearchResults as Todo[]) as TodoSearchResult[];

            UpdateWidgetData(sortedTodos);

            return {
              todos: sortedTodos,
              searchResults: sortedSearchResults,
            };
          });
        },

        applyFilters: (filters) =>
          set((state) => {
            let newFilteredTodos: Todo[];

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

            return {
              filteredTodos: newFilteredTodos,
            };
          }),

        deleteByID: (id) =>
          set((state) => {
            const todo = state.todos.find((item) => item.id === id);

            if (todo?.remindAt) {
              cancelTaskReminder(id);
            }

            const updatedTodos = state.todos.filter((item) => item.id !== id);
            const sortedTodos = sortTodos(updatedTodos);

            UpdateWidgetData(sortedTodos);

            return {
              todos: sortedTodos,
            };
          }),

        deleteFromSearchResults: (id) =>
          set((state) => {
            const todo = state.todos.find((item) => item.id === id);

            if (todo?.remindAt) {
              cancelTaskReminder(id);
            }

            return {
              searchResults: state.searchResults.filter(
                (item) => item.id !== id,
              ),
            };
          }),

        deleteAll: () =>
          set((state) => {
            cancelAllReminders(state.todos);

            UpdateWidgetData([]);

            return {
              todos: [],
            };
          }),

        executeSearch: (text) =>
          set((state) => {
            if (!text.trim()) {
              return {
                searchResults: [],
              };
            }

            const newSearchResults: TodoSearchResult[] = [];

            state.todos.forEach((todo) => {
              let currentIdx = todo.task
                .toLowerCase()
                .indexOf(text.toLowerCase());

              const foundIndexes: number[] = [];

              while (currentIdx !== -1) {
                foundIndexes.push(currentIdx);

                currentIdx = todo.task.toLowerCase().indexOf(text.toLowerCase(), currentIdx + 1);
              }

              if (foundIndexes.length > 0) {
                newSearchResults.push({
                  id: todo.id,
                  task: todo.task,
                  priority: todo.priority,
                  isDone: todo.isDone,
                  notificationID: todo.notificationID,
                  remindAt: todo.remindAt,
                  indexes: foundIndexes,
                });
              }
            });

            return {
              searchResults: newSearchResults,
            };
          }),

        clearSearchResults: () => set({ searchResults: [] }),
        clearFilterResults: () => set({ filteredTodos: [] }),

        clearAllDoneTodos: () =>
          set((state) => {
            const completedTodos = state.todos.filter(
              (todo) => todo.isDone === true,
            );

            cancelAllReminders(completedTodos);

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
        updateSearchTextLen: (len) => set({ searchTextLen: len }),
      };
    },
    {
      name: "todos",

      storage: createJSONStorage(() => zustandStorageEngine),

      partialize: (state) => ({
        todos: state.todos,
      }),
      skipHydration: true,
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<TodoState> | undefined;

        const persistedTodos = persisted?.todos ?? [];

        const restoredTodos: Todo[] = persistedTodos.map((todo) => ({
          ...todo,
          remindAt: todo.remindAt
            ? new Date(todo.remindAt as unknown as string)
            : undefined,
        }));
        return {
          ...currentState,
          ...persisted,

          todos: restoredTodos,
        };
      },
    },
  ),
);
