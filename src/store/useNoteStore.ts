import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorageEngine } from "../utils/secureStorage";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteSearchResult {
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
      // Keep it pure: always return an array
      const sortNotes = (notesArr: Note[]): Note[] => {
        return [...notesArr].sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      };

      return {
        notes: [],
        searchResults: [],
        isSearchMode: false,
        searchTextLen: 0,

        addNote: (note) =>
          set((state) => {
            const updatedNotes = [...state.notes, note];
            return { notes: sortNotes(updatedNotes) };
          }),

        updateNote: (id, payload) =>
          set((state) => {
            const updatedNotes = state.notes.map((note) =>
              note.id === id
                ? {
                    ...note,
                    title: payload.title,
                    content: payload.content,
                    updatedAt: payload.updatedAt,
                  }
                : note,
            );
            return { notes: sortNotes(updatedNotes) };
          }),

        deleteByID: (id) =>
          set((state) => {
            const updatedNotes = state.notes.filter((note) => note.id !== id);
            return { notes: sortNotes(updatedNotes) };
          }),

        deleteAll: () => set({ notes: [] }),

        clearSearchResults: () => set({ searchResults: [] }),

        resetSearchTextLen: () => set({ searchTextLen: 0 }),
        setIsSearchMode: (value) => set({ isSearchMode: value }),
        updateSearchTextLen: (len: number) => set({ searchTextLen: len }),

        executeSearch: (text) =>
          set((state) => {
            if (!text.trim()) {
              return { searchResults: [] };
            }

            const newSearchResults: NoteSearchResult[] = [];

            state.notes.forEach((note: Note) => {
              let currentIdx = note.title
                .toLowerCase()
                .indexOf(text.toLowerCase());
              const foundIndexes: number[] = [];

              while (currentIdx !== -1) {
                foundIndexes.push(currentIdx);
                currentIdx = note.title
                  .toLowerCase()
                  .indexOf(text.toLowerCase(), currentIdx + 1);
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
      };
    },
    {
      name: "notes",
      storage: createJSONStorage(() => zustandStorageEngine),
      partialize: (state) => ({ notes: state.notes }),
      skipHydration: true,
    },
  ),
);
