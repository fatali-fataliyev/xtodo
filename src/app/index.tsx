// app/index.tsx
import Constants from "expo-constants";
import TasksScreen from "./tasks";

const appVersion = Constants.expoConfig?.version;
console.log("Current App Version:", appVersion);

export default function Index() {
  return <TasksScreen />;
}
