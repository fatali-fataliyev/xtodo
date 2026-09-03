import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import { useTodoStore } from "@/store/useTodoStore";
import { initializeStorage } from "@/utils/secureStorage";

export const BG_TASK = "todo-notification-bg-handler";

TaskManager.defineTask(BG_TASK, async ({ data, error }) => {
  if (error || !data) return;

  if (typeof data === "object" && "actionIdentifier" in data) {
    const resp = data as Notifications.NotificationResponse;

    if (resp.actionIdentifier === "ACTION_COMPLETE") {
      const notificationId = resp.notification.request.identifier;
      if (notificationId) {
        await Notifications.dismissNotificationAsync(notificationId);
      }

      try {
        const storageReady = await initializeStorage();
        if (storageReady) {
          await useTodoStore.persist.rehydrate();
        }
      } catch (e) {
        console.log("failed to init storage: ", error);
        return;
      }

      const todos = useTodoStore.getState().todos;
      const targetTodo = todos.find((t) => t.notificationID === notificationId);
      if (targetTodo?.isDone) return;

      if (targetTodo) {
        useTodoStore.getState().markTodoDone(targetTodo.id);
      } else {
        const rawTaskId = resp.notification.request.content.data?.taskId;
        if (rawTaskId) {
          useTodoStore.getState().markTodoDone(String(rawTaskId));
        }
      }
    }
  }
});

async function check() {
  if (!(await TaskManager.isTaskRegisteredAsync(BG_TASK))) {
    Notifications.registerTaskAsync(BG_TASK).catch((err) =>
      console.error("failed to register BG task:", err),
    );
  }
}

check();
