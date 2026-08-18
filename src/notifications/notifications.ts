import { Todo } from "@/store/useTodoStore";
import * as Notifications from "expo-notifications";

const title: string = "Todo reminder";

export async function scheduleTaskReminder(
  id: string,
  body: string,
  remindAt: Date,
): Promise<string> {
  if (remindAt.getTime() <= Date.now()) {
    console.warn("Cannot schedule notification in the past.");
    return "";
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "reminder.wav",
      data: { taskId: id },
      categoryIdentifier: "TASK_REMINDER",
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
