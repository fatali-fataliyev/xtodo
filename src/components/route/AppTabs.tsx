import { Colors } from "@/constants/colors";
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor="black"
      iconColor={{ default: "#8E8E93", selected: Colors.medium }}
      labelStyle={{
        default: { color: "#8E8E93" },
        selected: { color: Colors.medium },
      }}
    >
      <NativeTabs.Trigger name="notes">
        <NativeTabs.Trigger.Label>Notes</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md={{ default: "description", selected: "description" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="todos">
        <NativeTabs.Trigger.Label>Todos</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md={{ default: "check_box", selected: "check_box" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "gearshape", selected: "gearshape.fill" }}
          md={{ default: "settings", selected: "settings" }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
