const { withAndroidManifest } = require("expo/config-plugins");

module.exports = function withXTodoAlarms(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    manifest["uses-permission"] = manifest["uses-permission"] || [];
    const permissions = [
      "android.permission.SCHEDULE_EXACT_ALARM",
      "android.permission.RECEIVE_BOOT_COMPLETED",
      "android.permission.POST_NOTIFICATIONS",
    ];

    for (const permission of permissions) {
      const exists = manifest["uses-permission"].some(
        (item) => item.$?.["android:name"] === permission,
      );

      if (!exists) {
        manifest["uses-permission"].push({
          $: {
            "android:name": permission,
          },
        });
      }
    }

    const application = manifest.application?.[0];

    if (!application) {
      throw new Error("Android application node not found.");
    }

    application.receiver = application.receiver || [];

    const receivers = [
      "expo.modules.xtodoalarms.ReminderAlarmReceiver",
      "expo.modules.xtodoalarms.NotificationActionReceiver",
      "expo.modules.xtodoalarms.BootReceiver",
    ];

    for (const receiverName of receivers) {
      const exists = application.receiver.some(
        (receiver) => receiver.$?.["android:name"] === receiverName,
      );

      if (!exists) {
        application.receiver.push({
          $: {
            "android:name": receiverName,
            "android:exported": "false",
          },
        });
      }
    }

    return config;
  });
};
