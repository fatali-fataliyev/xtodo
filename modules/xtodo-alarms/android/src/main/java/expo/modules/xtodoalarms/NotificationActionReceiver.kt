package expo.modules.xtodoalarms

import android.appwidget.AppWidgetManager
import android.content.BroadcastReceiver
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Bundle
import androidx.core.app.NotificationManagerCompat

class NotificationActionReceiver : BroadcastReceiver() {

    override fun onReceive(
        context: Context, intent: Intent
    ) {
        if (intent.action != XTodoAlarmsModule.ACTION_COMPLETE) {
            return
        }

        val taskId = intent.getStringExtra(XTodoAlarmsModule.EXTRA_TASK_ID) ?: return

        val notificationId = intent.getIntExtra(XTodoAlarmsModule.EXTRA_NOTIFICATION_ID, -1)
        // hide notification instant
        if (notificationId != -1) {
            NotificationManagerCompat.from(context).cancel(notificationId)
        }

        val appWidgetManager = AppWidgetManager.getInstance(context)
        val widgetComponent = ComponentName(context.packageName, "${context.packageName}.widget.TodoList")

        // Get all active instance IDs for TodoList widget
        val activeWidgetIds = appWidgetManager.getAppWidgetIds(widgetComponent)

        // If at least one TodoList widget exists send MARK_TODO_DONE click action to make Todo as done.
        if (activeWidgetIds.isNotEmpty()) {
            val widgetClassName = "${context.packageName}.widget.TodoList"

            // Bundle required for clickActionData payload
            val clickActionDataBundle = Bundle().apply {
                putString("todoId", taskId)
            }

            val widgetIntent = Intent("${context.packageName}.WIDGET_CLICK").apply {
                setComponent(ComponentName(context.packageName, widgetClassName))
                putExtra("widgetName", "TodoList")
                putExtra("widgetClass", widgetClassName)
                putExtra("clickAction", "MARK_TODO_DONE")
                putExtra("clickActionData", clickActionDataBundle)
            }

            context.sendBroadcast(widgetIntent)

        } else {
            // There is no active TodoList widget, sending to pendingCompletions for marking as done on next app open.
            context.getSharedPreferences(XTodoAlarmsModule.PREFS_NAME, Context.MODE_PRIVATE).edit().putBoolean(
                "${XTodoAlarmsModule.KEY_PENDING_DONE}${taskId}",
                true
            ).apply()

            context.sendBroadcast(Intent(XTodoAlarmsModule.ACTION_COMPLETE).apply {
                setPackage(context.packageName)
                putExtra(XTodoAlarmsModule.EXTRA_TASK_ID, taskId)
            })
        }
    }
}