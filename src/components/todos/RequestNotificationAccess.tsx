import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function checkNotificationAccess() {
  const permission = await Notifications.getPermissionsAsync();
  if (permission.granted) return;
  await requestNotificationAccess();
}

async function requestNotificationAccess() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("reminders", {
      name: "Task Reminders",
      importance: Notifications.AndroidImportance.MAX,
      sound: "reminder",
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      lightColor: "#FF231F7C",
      enableVibrate: true,
      showBadge: true,
    });
  }

  await Notifications.setNotificationCategoryAsync("TASK_REMINDER", [
    {
      identifier: "ACTION_COMPLETE",
      buttonTitle: "Mark as Done",
      options: {
        opensAppToForeground: false,
      },
    },
  ]);

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("failed to get notification permission!");
    return false;
  }

  return true;
}
