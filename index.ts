import "expo-router/entry";
import {
  registerWidgetTaskHandler,
  registerWidgetConfigurationScreen,
} from "react-native-android-widget";

import { widgetTaskHandler } from "./widget/widget-task-handler";
import { WidgetConfigurationScreen } from "./widget/WidgetConfigurationScreen";

// Register the widget background tasks
registerWidgetTaskHandler(widgetTaskHandler);
registerWidgetConfigurationScreen(WidgetConfigurationScreen);