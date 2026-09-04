import { PermissionsAndroid, Platform } from "react-native";
import * as Application from "expo-application";
import * as IntentLauncher from "expo-intent-launcher";
import { Todo } from "@/store/useTodoStore";
import XTodoAlarms from "../../modules/xtodo-alarms/src";

export const REMINDER_TITLE = "Todo reminder";

export type NotificationPermissionResult = | "granted" | "denied";
export type ExactAlarmPermissionResult = | "granted" | "required";

export function setupNotificationChannel() {
  if (Platform.OS !== "android") {
    return;
  }

  XTodoAlarms.createNotificationChannel();
}

// PERMISSION CHECKS
export function hasNotificationPermission(): boolean {
  if (Platform.OS !== "android") {
    return true;
  }

  return XTodoAlarms.hasNotificationPermission();
}

export function canScheduleExactAlarms(): boolean {
  if (Platform.OS !== "android") {
    return true;
  }

  return XTodoAlarms.canScheduleExactAlarms();
}

export async function openNotificationSettings(): Promise<boolean> {
  if (Platform.OS !== "android") {
    return true;
  }

  try {
    await IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.APP_NOTIFICATION_SETTINGS,
      {
        extra: {
          "android.provider.extra.APP_PACKAGE":
            Application.applicationId,
        },
      },
    );
  } catch (error) {
    console.error(
      "[XTODO] Failed to open notification settings:",
      error,
    );

    try {
      await IntentLauncher.startActivityAsync(
        IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
        {
          data: `package:${Application.applicationId}`,
        },
      );
    } catch (fallbackError) {
      console.error(
        "[XTODO] Failed to open application settings:",
        fallbackError,
      );
    }
  }

  return XTodoAlarms.hasNotificationPermission();
}

export async function openExactAlarmSettings(): Promise<boolean> {
  if (Platform.OS !== "android") {
    return true;
  }

  try {
    await IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.REQUEST_SCHEDULE_EXACT_ALARM,
      {
        data: `package:${Application.applicationId}`,
      },
    );
  } catch (error) {
    console.error(
      "[XTODO] Failed to open exact alarm settings:",
      error,
    );
  }

  return XTodoAlarms.canScheduleExactAlarms();
}

// NOTIFICATION PERMISSION
export async function askForNotificationPermission(): Promise<NotificationPermissionResult> {
  if (Platform.OS !== "android") {
    return "granted";
  }

  // Android < 13 does not require POST_NOTIFICATIONS runtime permission.
  if (Platform.Version < 33) {
    return "granted";
  }

  if (XTodoAlarms.hasNotificationPermission()) {
    return "granted";
  }

  XTodoAlarms.createNotificationChannel();

  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

  if (result === PermissionsAndroid.RESULTS.GRANTED) {
    return "granted";
  }

  return "denied";
}

// EXACT ALARM PERMISSION
export async function askForExactAlarmPermission(): Promise<ExactAlarmPermissionResult> {
  if (Platform.OS !== "android") {
    return "granted";
  }

  // Android < 12 does not use exact-alarm special access.
  if (Platform.Version < 31) {
    return "granted";
  }

  if (XTodoAlarms.canScheduleExactAlarms()) {
    return "granted";
  }

  return "required";
}


export async function ensureReminderPermissions(): Promise<boolean> {
  if (Platform.OS !== "android") {
    return true;
  }

  const notificationPermission =
    await askForNotificationPermission();

  if (notificationPermission !== "granted") {
    return false;
  }

  const exactAlarmPermission =
    await askForExactAlarmPermission();

  if (exactAlarmPermission !== "granted") {
    return false;
  }

  return true;
}

// SCHEDULE
export function scheduleTaskReminder(taskId: string, body: string,remindAt: Date): string {
  if (Platform.OS !== "android") {
    return "";
  }

  const triggerAt = remindAt.getTime();
  if (triggerAt <= Date.now()) {
    return "-1"
  }

  if (!XTodoAlarms.hasNotificationPermission()) {
    return "-1";
  }

  if (!XTodoAlarms.canScheduleExactAlarms()) {
    return "-1";
  }

  XTodoAlarms.createNotificationChannel();

  const alarmId = XTodoAlarms.scheduleReminder(
    taskId,
    REMINDER_TITLE,
    body,
    triggerAt,
  );

  return String(alarmId);
}

// CANCEL ONE
export function cancelTaskReminder(taskId: string) {
  if (Platform.OS !== "android") {
    return;
  }

  if (taskId === "-1") {
    return;
  }

  XTodoAlarms.cancelReminder(taskId);
}

// CANCEL ALL
export function cancelAllReminders(todos: Todo[]) {
  if (Platform.OS !== "android") {
    return;
  }

  for (const todo of todos) {
    XTodoAlarms.cancelReminder(todo.id);
  }
}
