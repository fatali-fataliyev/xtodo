package expo.modules.xtodoalarms

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED && intent.action != Intent.ACTION_MY_PACKAGE_REPLACED) {
            return
        }

        val pendingResult = goAsync()

        Thread {
            try {
                restoreAlarms(context)
            } finally {
                pendingResult.finish()
            }

        }.start()
    }

    private fun restoreAlarms(context: Context) {
        val prefs = context.getSharedPreferences(XTodoAlarmsModule.PREFS_NAME, Context.MODE_PRIVATE)
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        for (entry in prefs.all.entries) {
            val key = entry.key
            if (!key.startsWith(XTodoAlarmsModule.KEY_PREFIX)) {
                continue
            }

            val taskId = key.removePrefix(XTodoAlarmsModule.KEY_PREFIX)
            val stored = entry.value as? String ?: continue
            val parts = stored.split("|", limit = 4)

            if (parts.size != 4) {
                continue
            }

            val triggerAt = parts[0].toLongOrNull() ?: continue
            val title = decode(parts[1])
            val body = decode(parts[2])

            val alarmId = parts[3].toIntOrNull() ?: stableAlarmId(taskId)

            if (triggerAt <= System.currentTimeMillis()) {
                prefs.edit().remove(key).apply()
                continue
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                if (!alarmManager.canScheduleExactAlarms()) {
                    continue
                }
            }

            val reminderIntent =
                Intent(context, ReminderAlarmReceiver::class.java).apply {
                    action = XTodoAlarmsModule.ACTION_REMINDER
                    putExtra(XTodoAlarmsModule.EXTRA_TASK_ID, taskId)
                    putExtra(XTodoAlarmsModule.EXTRA_TITLE, title)
                    putExtra(XTodoAlarmsModule.EXTRA_BODY, body)
                    putExtra(XTodoAlarmsModule.EXTRA_NOTIFICATION_ID, alarmId)
                    putExtra(XTodoAlarmsModule.EXTRA_ALARM_ID, alarmId)
                }

            val pendingIntent =
                PendingIntent.getBroadcast(
                    context,
                    alarmId,
                    reminderIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT or
                            PendingIntent.FLAG_IMMUTABLE
                )

            alarmManager.setExactAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                triggerAt,
                pendingIntent
            )
        }
    }

    private fun decode(value: String): String {
        return value
            .replace("%0A", "\n")
            .replace("%7C", "|")
            .replace("%25", "%")
    }

    private fun stableAlarmId(taskId: String): Int {
        var result = 0
        for (char in taskId) {
            result = 31 * result + char.code
        }

        return kotlin.math.abs(result)
    }
}
