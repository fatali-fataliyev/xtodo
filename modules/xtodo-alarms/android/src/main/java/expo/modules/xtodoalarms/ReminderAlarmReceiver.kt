package expo.modules.xtodoalarms

import android.app.Notification
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log

import androidx.core.app.NotificationCompat

class ReminderAlarmReceiver : BroadcastReceiver() {
    override fun onReceive(
        context: Context,
        intent: Intent
    ) {
        Log.e("XTODO_ALARM", "[+]: ReminderAlarmReceiver.onReceive() CALLED")

        val pendingResult = goAsync()
        try {
            val taskId = intent.getStringExtra(XTodoAlarmsModule.EXTRA_TASK_ID) ?: run {
                Log.e("XTODO_ALARM", "❌ taskId missing")
                pendingResult.finish()
                return
            }

            val title = intent.getStringExtra(XTodoAlarmsModule.EXTRA_TITLE) ?: "Todo reminder"
            val body = intent.getStringExtra(XTodoAlarmsModule.EXTRA_BODY) ?: ""
            val notificationId =
                intent.getIntExtra(XTodoAlarmsModule.EXTRA_NOTIFICATION_ID, stableNotificationId(taskId))

            Log.e("XTODO_ALARM", "taskId=$taskId notificationId=$notificationId")

            val completeIntent = Intent(context, NotificationActionReceiver::class.java).apply {
                action = XTodoAlarmsModule.ACTION_COMPLETE

                putExtra(XTodoAlarmsModule.EXTRA_TASK_ID, taskId)

                putExtra(XTodoAlarmsModule.EXTRA_NOTIFICATION_ID, notificationId)
            }

            val completePendingIntent =
                PendingIntent.getBroadcast(
                    context,
                    notificationId + 1_000_000,
                    completeIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )

            Log.e("XTODO_ACTION", "PendingIntent CREATED requestCode=${notificationId + 1_000_000} taskId=$taskId")

            val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)

            val contentPendingIntent = launchIntent?.let {
                PendingIntent.getActivity(
                    context,
                    notificationId,
                    it,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
            }

            val notification =
                NotificationCompat.Builder(
                    context,
                    XTodoAlarmsModule.CHANNEL_ID
                )
                    .setSmallIcon(
                        getNotificationIcon(context)
                    )
                    .setContentTitle(title)
                    .setContentText(body)
                    .setStyle(
                        NotificationCompat.BigTextStyle()
                            .bigText(body)
                    )
                    .setPriority(
                        NotificationCompat.PRIORITY_MAX
                    )
                    .setCategory(
                        NotificationCompat.CATEGORY_REMINDER
                    )
                    .setVisibility(
                        NotificationCompat.VISIBILITY_PUBLIC
                    )
                    .setAutoCancel(false)
                    .setOngoing(false)
                    .addAction(
                        android.R.drawable.ic_menu_save,
                        "Mark as Done",
                        completePendingIntent
                    )
                    .apply {
                        if (contentPendingIntent != null) {
                            setContentIntent(contentPendingIntent)
                        }
                    }
                    .build()

            val manager = context.getSystemService(NotificationManager::class.java)

            Log.e("XTODO_NOTIFY", "BEFORE notify id=$notificationId channel=${XTodoAlarmsModule.CHANNEL_ID}")

            try {
                manager.notify(notificationId, notification)
                Log.e("XTODO_NOTIFY", "AFTER notify id=$notificationId")
            } catch (e: Throwable) {
                Log.e("XTODO_NOTIFY", "NOTIFY FAILED id=$notificationId error=${e.message}", e)
            } finally {
                Log.e("XTODO_ALARM", "[+]: ReminderAlarmReceiver finishing")
                pendingResult.finish()
            }
        } catch (e: Throwable) {
            Log.e("XTODO_ALARM", "❌ RECEIVER FAILED: ${e.message}", e)
            pendingResult.finish()
        }
    }


    private fun getNotificationIcon(context: Context): Int {
        val resourceId = context.resources.getIdentifier(
            "notification_icon",
            "drawable",
            context.packageName
        )

        return if (
            resourceId != 0
        ) {
            resourceId
        } else {
            android.R.drawable.ic_dialog_info
        }
    }

    private fun stableNotificationId(taskId: String): Int {
        var result = 0
        for (char in taskId) {
            result =
                31 * result + char.code
        }

        return kotlin.math.abs(result)
    }
}
