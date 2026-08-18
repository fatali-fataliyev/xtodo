// app/(tabs)/_layout.tsx
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { Tabs } from "expo-router";
import { BottomTabBarButtonProps } from "expo-router/build/react-navigation/bottom-tabs";
import { Pressable } from "react-native";
import { Colors } from "../../../widget/TodoWidget";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        lazy: false,
        sceneStyle: { backgroundColor: "#000000" },

        tabBarStyle: {
          backgroundColor: "#000000",
          borderTopColor: "#000000",
        },
        tabBarActiveTintColor: Colors.medium,
        tabBarInactiveTintColor: "#8E8E93",
        animation: "shift",
        tabBarButton: ({ ref, style, ...props }: BottomTabBarButtonProps) => (
          <Pressable
            {...props}
            android_ripple={null}
            style={({ pressed }) => [
              style as any,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="notes"
        options={{
          title: "Notes",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="description" color={color} size={size} />
          ),
        }}
      />

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
