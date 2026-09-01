import { Todo } from "@/store/useTodoStore";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const title: string = "Todo reminder";

export async function setupNotificationChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("reminders", {
      name: "Task Reminders",
      importance: Notifications.AndroidImportance.MAX,
      sound: "reminder.wav",
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF0000",
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      audioAttributes: {
        usage: Notifications.AndroidAudioUsage.ALARM,
        contentType: Notifications.AndroidAudioContentType.SONIFICATION,
      },
    });
  }
}

export async function scheduleTaskReminder(
  id: string,
  body: string,
  remindAt: Date,
): Promise<string> {
  if (remindAt.getTime() <= Date.now()) {
    console.warn("Cannot schedule notification in the past.");
    return "";
  }

  await setupNotificationChannel();

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "reminder.wav",
      data: { taskId: id },
      categoryIdentifier: "TASK_REMINDER",
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: remindAt,
      channelId: "reminders",
    },
  });

  return notificationId;
}

export async function cancelTaskReminder(notificationsID: string) {
  if (!notificationsID) return;
  await Notifications.cancelScheduledNotificationAsync(notificationsID);
}

export async function cancelAllReminders(todos: Todo[]) {
  for (let todo of todos) {
    if (todo.notificationID) {
      await cancelTaskReminder(todo.notificationID);
    }
  }
}
