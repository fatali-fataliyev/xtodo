package expo.modules.xtodoalarms

import android.app.AlarmManager
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build

import androidx.core.content.ContextCompat
import androidx.core.os.bundleOf

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class XTodoAlarmsModule : Module() {

    companion object {
        const val CHANNEL_ID = "xtodo_reminders"
        const val ACTION_REMINDER = "expo.modules.xtodoalarms.ACTION_REMINDER"
        const val ACTION_COMPLETE = "expo.modules.xtodoalarms.ACTION_COMPLETE"
        const val EXTRA_TASK_ID = "taskId"
        const val EXTRA_TITLE = "title"
        const val EXTRA_BODY = "body"
        const val EXTRA_NOTIFICATION_ID = "notificationId"
        const val EXTRA_ALARM_ID = "alarmId"
        const val PREFS_NAME = "xtodo_native_alarms"
        const val KEY_PREFIX = "alarm_"
        const val KEY_PENDING_DONE = "pending_done_"
        const val EVENT_TASK_COMPLETED = "onTaskCompleted"
    }

    // CONTEXT

    private fun context(): Context {
        return appContext.reactContext
            ?: throw IllegalStateException(
                "React context is unavailable."
            )
    }

    // ALARM MANAGER

    private fun alarmManager(): AlarmManager {
        return context().getSystemService(
            Context.ALARM_SERVICE
        ) as AlarmManager
    }

    // PREFS

    private fun prefs() =
        context().getSharedPreferences(
            PREFS_NAME,
            Context.MODE_PRIVATE
        )

    // COMPLETION RECEIVER

    private val completionReceiver =
        object : BroadcastReceiver() {

            override fun onReceive(
                context: Context,
                intent: Intent
            ) {
                if (
                    intent.action != ACTION_COMPLETE
                ) {
                    return
                }

                val taskId =
                    intent.getStringExtra(
                        EXTRA_TASK_ID
                    ) ?: return

                sendEvent(
                    EVENT_TASK_COMPLETED,
                    bundleOf(
                        EXTRA_TASK_ID to taskId
                    )
                )
            }
        }

    // =============================================================
    // MODULE DEFINITION
    // =============================================================

    override fun definition() =
        ModuleDefinition {

            Name("XTodoAlarms")

            // =====================================================
            // EVENTS
            // =====================================================

            Events(
                EVENT_TASK_COMPLETED
            )

            // =====================================================
            // START OBSERVING (O_O)
            // =====================================================

            OnStartObserving(
                EVENT_TASK_COMPLETED
            ) {

                val ctx =
                    context()

                ContextCompat.registerReceiver(
                    ctx,
                    completionReceiver,
                    IntentFilter(
                        ACTION_COMPLETE
                    ),
                    ContextCompat.RECEIVER_NOT_EXPORTED
                )
            }

            // =====================================================
            // STOP OBSERVING (X_X)
            // =====================================================

            OnStopObserving(
                EVENT_TASK_COMPLETED
            ) {

                try {
                    context().unregisterReceiver(
                        completionReceiver
                    )
                } catch (
                    _: IllegalArgumentException
                ) {
                    // Already unregistered.
                }
            }

            // =====================================================
            // NOTIFICATION PERMISSION
            // =====================================================

            Function(
                "hasNotificationPermission"
            ) {

                if (
                    Build.VERSION.SDK_INT <
                    Build.VERSION_CODES.TIRAMISU
                ) {
                    true
                } else {
                    ContextCompat.checkSelfPermission(
                        context(),
                        android.Manifest.permission.POST_NOTIFICATIONS
                    ) ==
                            PackageManager.PERMISSION_GRANTED
                }
            }

            // =====================================================
            // EXACT ALARM PERMISSION
            // =====================================================

            Function(
                "canScheduleExactAlarms"
            ) {

                if (
                    Build.VERSION.SDK_INT <
                    Build.VERSION_CODES.S
                ) {
                    true
                } else {
                    alarmManager()
                        .canScheduleExactAlarms()
                }
            }

            // =====================================================
            // CREATE NOTIFICATION CHANNEL
            // =====================================================

            Function(
                "createNotificationChannel"
            ) {
                createChannel(
                    context()
                )
            }

            // =====================================================
            // SCHEDULE REMINDER
            // =====================================================

            Function(
                "scheduleReminder"
            ) { taskId: String,
                title: String,
                body: String,
                triggerAtMillis: Double ->

                val ctx =
                    context()

                val alarm =
                    alarmManager()

                // -------------------------------------------------
                // EXACT ALARM PERMISSION
                // -------------------------------------------------

                if (
                    Build.VERSION.SDK_INT >=
                    Build.VERSION_CODES.S
                ) {
                    if (
                        !alarm.canScheduleExactAlarms()
                    ) {
                        throw IllegalStateException(
                            "EXACT_ALARM_PERMISSION_REQUIRED"
                        )
                    }
                }

                // -------------------------------------------------
                // NOTIFICATION PERMISSION
                // -------------------------------------------------

                if (
                    Build.VERSION.SDK_INT >=
                    Build.VERSION_CODES.TIRAMISU
                ) {
                    if (
                        ContextCompat.checkSelfPermission(
                            ctx,
                            android.Manifest.permission.POST_NOTIFICATIONS
                        ) !=
                        PackageManager.PERMISSION_GRANTED
                    ) {
                        throw IllegalStateException(
                            "POST_NOTIFICATIONS_PERMISSION_REQUIRED"
                        )
                    }
                }

                // -------------------------------------------------
                // TIME
                // -------------------------------------------------

                val triggerAt =
                    triggerAtMillis.toLong()

                if (
                    triggerAt <=
                    System.currentTimeMillis()
                ) {
                    throw IllegalArgumentException(
                        "Reminder time must be in the future."
                    )
                }

                // -------------------------------------------------
                // CHANNEL
                // -------------------------------------------------

                createChannel(
                    ctx
                )

                // -------------------------------------------------
                // IDS
                // -------------------------------------------------

                val alarmId =
                    stableAlarmId(
                        taskId
                    )

                val notificationId =
                    alarmId

                // -------------------------------------------------
                // REMINDER BROADCAST
                // -------------------------------------------------

                val reminderIntent =
                    Intent(
                        ctx,
                        ReminderAlarmReceiver::class.java
                    ).apply {

                        action =
                            ACTION_REMINDER

                        putExtra(
                            EXTRA_TASK_ID,
                            taskId
                        )

                        putExtra(
                            EXTRA_TITLE,
                            title
                        )

                        putExtra(
                            EXTRA_BODY,
                            body
                        )

                        putExtra(
                            EXTRA_NOTIFICATION_ID,
                            notificationId
                        )

                        putExtra(
                            EXTRA_ALARM_ID,
                            alarmId
                        )
                    }

                val reminderPendingIntent =
                    PendingIntent.getBroadcast(
                        ctx,
                        alarmId,
                        reminderIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT or
                                PendingIntent.FLAG_IMMUTABLE
                    )

                // -------------------------------------------------
                // SHOW INTENT
                // -------------------------------------------------

                val launchIntent =
                    ctx.packageManager
                        .getLaunchIntentForPackage(
                            ctx.packageName
                        )
                        ?: throw IllegalStateException(
                            "Unable to create alarm show intent."
                        )

                val showPendingIntent =
                    PendingIntent.getActivity(
                        ctx,
                        alarmId + 2_000_000,
                        launchIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT or
                                PendingIntent.FLAG_IMMUTABLE
                    )

                // -------------------------------------------------
                // EXACT ALARM CLOCK
                // -------------------------------------------------

                val alarmClockInfo =
                    AlarmManager.AlarmClockInfo(
                        triggerAt,
                        showPendingIntent
                    )

                alarm.setAlarmClock(
                    alarmClockInfo,
                    reminderPendingIntent
                )

                // -------------------------------------------------
                // SAVE FOR REBOOT RECOVERY
                // -------------------------------------------------

                prefs()
                    .edit()
                    .putString(
                        "${KEY_PREFIX}${taskId}",
                        buildStoredReminder(
                            triggerAt,
                            title,
                            body,
                            alarmId
                        )
                    )
                    .apply()

                alarmId
            }

            // =====================================================
            // CANCEL ONE
            // =====================================================

            Function(
                "cancelReminder"
            ) { taskId: String ->

                val ctx = context()

                val alarm = alarmManager()

                val alarmId = stableAlarmId(taskId)

                val intent =
                    Intent(
                        ctx,
                        ReminderAlarmReceiver::class.java
                    ).apply { action = ACTION_REMINDER }

                val pendingIntent =
                    PendingIntent.getBroadcast(
                        ctx,
                        alarmId,
                        intent,
                        PendingIntent.FLAG_UPDATE_CURRENT or
                                PendingIntent.FLAG_IMMUTABLE
                    )

                alarm.cancel(pendingIntent)
                pendingIntent.cancel()

                prefs()
                    .edit()
                    .remove(
                        "${KEY_PREFIX}${taskId}"
                    )
                    .apply()
            }

            // CANCEL ALL
            Function("cancelAllReminders") {

                val allPrefs = prefs().all

                val editor = prefs().edit()

                for (key in allPrefs.keys) {

                    if (!key.startsWith(KEY_PREFIX)
                    ) {
                        continue
                    }

                    val taskId = key.removePrefix(KEY_PREFIX)

                    val alarmId =
                        stableAlarmId(
                            taskId
                        )

                    val intent =
                        Intent(
                            context(),
                            ReminderAlarmReceiver::class.java
                        ).apply {
                            action =
                                ACTION_REMINDER
                        }

                    val pendingIntent =
                        PendingIntent.getBroadcast(
                            context(),
                            alarmId,
                            intent,
                            PendingIntent.FLAG_UPDATE_CURRENT or
                                    PendingIntent.FLAG_IMMUTABLE
                        )

                    alarmManager()
                        .cancel(
                            pendingIntent
                        )

                    pendingIntent.cancel()

                    editor.remove(
                        key
                    )
                }

                editor.apply()
            }

            // =====================================================
            // GET PENDING COMPLETIONS
            // =====================================================

            Function(
                "getPendingCompletions"
            ) {

                prefs()
                    .all
                    .keys
                    .filter {
                        it.startsWith(
                            KEY_PENDING_DONE
                        )
                    }
                    .map {
                        it.removePrefix(
                            KEY_PENDING_DONE
                        )
                    }
            }

            // =====================================================
            // CLEAR PENDING COMPLETION
            // =====================================================

            Function(
                "clearPendingCompletion"
            ) { taskId: String ->

                prefs()
                    .edit()
                    .remove(
                        "${KEY_PENDING_DONE}${taskId}"
                    )
                    .apply()
            }
        }

    // =============================================================
    // STORED REMINDER
    // =============================================================

    private fun buildStoredReminder(
        triggerAt: Long,
        title: String,
        body: String,
        alarmId: Int
    ): String {

        return listOf(
            triggerAt.toString(),
            encode(title),
            encode(body),
            alarmId.toString()
        ).joinToString("|")
    }

    // =============================================================
    // ENCODE
    // =============================================================

    private fun encode(
        value: String
    ): String {

        return value
            .replace("%", "%25")
            .replace("|", "%7C")
            .replace("\n", "%0A")
    }

    // =============================================================
    // STABLE ID
    // =============================================================

    private fun stableAlarmId(
        taskId: String
    ): Int {

        var result = 0

        for (char in taskId) {
            result = 31 * result + char.code
        }
        return if (result == Int.MIN_VALUE) {
            0
        } else {
            kotlin.math.abs(
                result
            )
        }
    }

    // =============================================================
    // NOTIFICATION CHANNEL
    // =============================================================

    private fun createChannel(
        context: Context
    ) {

        if (
            Build.VERSION.SDK_INT <
            Build.VERSION_CODES.O
        ) {
            return
        }

        val manager =
            context.getSystemService(
                NotificationManager::class.java
            )

        if (
            manager.getNotificationChannel(
                CHANNEL_ID
            ) != null
        ) {
            return
        }

        val soundUri =
            Uri.parse(
                "android.resource://${context.packageName}/${
                    context.resources.getIdentifier(
                        "reminder",
                        "raw",
                        context.packageName
                    )
                }"
            )

        val audioAttributes =
            AudioAttributes.Builder()
                .setUsage(
                    AudioAttributes.USAGE_NOTIFICATION
                )
                .setContentType(
                    AudioAttributes.CONTENT_TYPE_SONIFICATION
                )
                .build()

        val channel =
            NotificationChannel(
                CHANNEL_ID,
                "Task Reminders",
                NotificationManager.IMPORTANCE_HIGH
            )

        channel.description =
            "XTodo task reminders"

        channel.setSound(soundUri, audioAttributes)

        channel.enableVibration(true)

        channel.vibrationPattern =
            longArrayOf(
                0,
                250,
                250,
                250
            )

        channel.setShowBadge(true)

        channel.lockscreenVisibility = Notification.VISIBILITY_PUBLIC
        manager.createNotificationChannel(
            channel
        )
    }
}
