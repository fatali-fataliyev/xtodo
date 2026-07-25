import { requestWidgetUpdate } from "react-native-android-widget";
import { TodoWidget, TodoWidgetProps } from "./TodoWidget";

export function updateTodoListWidget({
  Todos,
  ListBg,
  FontSize,
}: TodoWidgetProps) {
  requestWidgetUpdate({
    widgetName: "TodoList",
    renderWidget: (props) => (
      <TodoWidget
        Todos={Todos}
        FontSize={FontSize}
        ListBg={ListBg}
      />
    ),
  });
}
