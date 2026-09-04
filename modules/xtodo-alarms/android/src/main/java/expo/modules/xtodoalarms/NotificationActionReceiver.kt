package expo.modules.xtodoalarms

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

import androidx.core.app.NotificationManagerCompat

class NotificationActionReceiver :
    BroadcastReceiver() {

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

        // Send to pendingCompletetions for marking as done in next app open.
        context.getSharedPreferences(XTodoAlarmsModule.PREFS_NAME, Context.MODE_PRIVATE).edit().putBoolean(
            "${XTodoAlarmsModule.KEY_PENDING_DONE}${taskId}",
            true
        ).apply()

        context.sendBroadcast(Intent(XTodoAlarmsModule.ACTION_COMPLETE).apply {
            setPackage(context.packageName)
            putExtra(XTodoAlarmsModule.EXTRA_TASK_ID, taskId)
        }
        )
    }
}
