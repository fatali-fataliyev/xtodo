// app/(tabs)/_layout.tsx
import { Colors } from "@/constants/colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000000",
          borderTopColor: "#1A1A1A",
        },
        tabBarActiveTintColor: Colors.medium,
        tabBarInactiveTintColor: "#8E8E93",
      }}
    >
      {/* 1. Notes Tab */}
      <Tabs.Screen
        name="notes"
        options={{
          title: "Notes",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="description" size={size} color={color} />
          ),
        }}
      />

      {/* 2. Todos Tab */}
      <Tabs.Screen
        name="todos"
        options={{
          title: "Todos",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="check-box" size={size} color={color} />
          ),
        }}
      />

      {/* 3. Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-sharp" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
