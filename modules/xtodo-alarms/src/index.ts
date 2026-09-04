import { NativeModule, requireNativeModule } from "expo-modules-core";

export type TaskCompletedEvent = {
  taskId: string;
};

export type XTodoAlarmsEvents = {
  onTaskCompleted: (event: TaskCompletedEvent) => void;
};

declare class XTodoAlarmsNative extends NativeModule<XTodoAlarmsEvents> {
  hasNotificationPermission(): boolean;
  canScheduleExactAlarms(): boolean;
  createNotificationChannel(): void;
  scheduleReminder(
    taskId: string,
    title: string,
    body: string,
    triggerAtMillis: number,
  ): number;
  cancelReminder(taskId: string): void;
  cancelAllReminders(): void;
  getPendingCompletions(): string[];
  clearPendingCompletion(taskId: string): void;
}

const XTodoAlarms = requireNativeModule<XTodoAlarmsNative>("XTodoAlarms");

export default XTodoAlarms;
