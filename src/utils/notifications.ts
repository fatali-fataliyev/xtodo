import * as Notifications from "expo-notifications";

const repeatCount: number = 3;
const intervalSeconds: number = 2;

export async function scheduleTaskReminder(
  id: string,
  body: string,
  remindAt: Date,
) {
  if (remindAt.getTime() <= Date.now()) {
    console.warn("Cannot schedule notification in the past.");
    return null;
  }

  const notificationIDs: string[] = [];

  for (let i = 0; i < repeatCount; i++) {
    const triggerDate = new Date(remindAt.getTime() + i * intervalSeconds * 1000);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        body,
        sound: "reminder.wav",
        data: { taskId: id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
        channelId: "reminders",
      },
    });

    notificationIDs.push(notificationId);
  }

  return notificationIDs;
}
