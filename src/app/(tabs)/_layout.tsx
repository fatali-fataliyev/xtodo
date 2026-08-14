// app/(tabs)/_layout.tsx
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { Tabs } from "expo-router";
import { Colors } from "../../../widget/TodoWidget";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        lazy: false,
        tabBarStyle: {
          backgroundColor: "#000000",
          borderTopColor: "#000000",
        },
        tabBarActiveTintColor: Colors.medium,
        tabBarInactiveTintColor: "#8E8E93",
        animation: "shift",
      }}
    >
      {/* 1. Notes Tab */}
      <Tabs.Screen
        name="notes"
        options={{
          title: "Notes",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="description" color={color} size={size} />
          ),
        }}
      />

      {/* 2. Todos Tab */}
      <Tabs.Screen
        name="todos"
        options={{
          title: "Todos",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="check-circle-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      {/* 3. Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
