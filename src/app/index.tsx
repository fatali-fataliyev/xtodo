// app/index.tsx
import { useSettingsStore } from "@/store/useSettingsStore";
import { Redirect } from "expo-router";

export default function Index() {
  const homePage = useSettingsStore((state) => state.rootPage);

  let hrefRoute: "/todos" | "/notes" = "/todos";

  if (homePage !== "todos") {
    hrefRoute = "/notes";
  }

  return <Redirect href={hrefRoute} />;
}
