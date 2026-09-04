import { create } from "zustand";
import {createJSONStorage,persist} from "zustand/middleware";
import { zustandStorageEngine } from "../utils/secureStorage";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NoteSearchResult {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  indexes: number[];
}

type EditPayload = {
  title: string;
  content: string;
  updatedAt: Date;
};

interface NoteState {
  notes: Note[];
  searchResults: NoteSearchResult[];
  isSearchMode: boolean;
  searchTextLen: number;
  addNote: (note: Note) => void;
  updateSearchTextLen: (len: number) => void;
  updateNote: (id: string, payload: EditPayload) => void;
  deleteByID: (id: string) => void;
  deleteAll: () => void;
  setIsSearchMode: (value: boolean) => void;
  executeSearch: (text: string) => void;
  clearSearchResults: () => void;
  resetSearchTextLen: () => void;
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set) => {
      const sortNotes = (notesArr: Note[]): Note[] => {
        return [...notesArr].sort((a, b) => {
          return (b.createdAt.getTime() - a.createdAt.getTime());
        });
      };

      return {
        notes: [],
        searchResults: [],
        isSearchMode: false,
        searchTextLen: 0,

        addNote: (note) =>
          set((state) => {
            const updatedNotes = [
              ...state.notes,
              note,
            ];

            return {
              notes: sortNotes(updatedNotes),
            };
          }),

        updateNote: (id, payload) =>
          set((state) => {
            const updatedNotes =
              state.notes.map((note) =>
                note.id === id
                  ? {
                      ...note,
                      title: payload.title,
                      content: payload.content,
                      updatedAt: payload.updatedAt,
                    }
                  : note,
              );

            return {
              notes: sortNotes(updatedNotes),
            };
          }),


        deleteByID: (id) =>
          set((state) => {
            const updatedNotes =
              state.notes.filter(
                (note) => note.id !== id,
              );

            return {
              notes: sortNotes(updatedNotes),
            };
          }),

        deleteAll: () =>
          set({
            notes: [],
          }),

        executeSearch: (text) =>
          set((state) => {
            if (!text.trim()) {
              return {
                searchResults: [],
              };
            }

            const newSearchResults: NoteSearchResult[] =
              [];

            state.notes.forEach((note) => {
              let currentIdx =
                note.title
                  .toLowerCase()
                  .indexOf(text.toLowerCase());

              const foundIndexes: number[] = [];

              while (currentIdx !== -1) {
                foundIndexes.push(currentIdx);

                currentIdx =
                  note.title
                    .toLowerCase()
                    .indexOf(
                      text.toLowerCase(),
                      currentIdx + 1,
                    );
              }

              if (foundIndexes.length > 0) {
                newSearchResults.push({
                  id: note.id,
                  title: note.title,
                  content: note.content,
                  createdAt: note.createdAt,
                  updatedAt: note.updatedAt,
                  indexes: foundIndexes,
                });
              }
            });

            return {
              searchResults: newSearchResults,
            };
          }),

        clearSearchResults: () => set({searchResults: []}),

        resetSearchTextLen: () => set({ searchTextLen: 0, }),

        setIsSearchMode: (value) =>set({isSearchMode: value}),

        updateSearchTextLen: (len) => set({searchTextLen: len}),
      };
    },
    {
      name: "notes",

      storage: createJSONStorage(
        () => zustandStorageEngine,
      ),

      partialize: (state) => ({
        notes: state.notes,
      }),

      skipHydration: true,

      merge: (persistedState, currentState) => {
        const persisted = persistedState as | Partial<NoteState>| undefined;

        const persistedNotes = persisted?.notes ?? [];

        const restoredNotes: Note[] =
          persistedNotes.map((note) => ({
            ...note,

            createdAt: new Date(
              note.createdAt as unknown as string,
            ),

            updatedAt: new Date(
              note.updatedAt as unknown as string,
            ),
          }));

        return {
          ...currentState,
          ...persisted,

          notes: restoredNotes,
        };
      },
    },
  ),
);
