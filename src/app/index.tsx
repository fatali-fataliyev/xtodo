// app/index.tsx
import Constants from "expo-constants";
import TodosScreen from "./todos";

const appVersion = Constants.expoConfig?.version;
console.log("Current App Version:", appVersion);

export default function Index() {
  return <TodosScreen />;
}
