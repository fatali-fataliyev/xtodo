// app/notes.tsx
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function NotesScreen() {
  return (
    <View>
      <Text>Notes Screen</Text>

      {/* Clicking this replaces 'notes' with 'tasks' in the navigation history */}
      <Link href="/tasks" replace>
        Go to Tasks
      </Link>
    </View>
  );
}
