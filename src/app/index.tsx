// app/index.tsx
import { useSettingsStore } from "@/store/useSettingsStore";
import NotesScreen from "./notes";
import TodosScreen from "./todos";

export default function Index() {
  const rootPage = useSettingsStore((state) => state.rootPage);

  return rootPage === "todos" ? <TodosScreen /> : <NotesScreen />;
}
