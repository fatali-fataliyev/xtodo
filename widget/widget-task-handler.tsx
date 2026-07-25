import React from "react";
import { Linking } from "react-native";
import type {
  ColorProp,
  WidgetTaskHandlerProps,
} from "react-native-android-widget";
import {
  getStoredBackgroundColor,
  getStoredFontSize,
  getStoredTodos,
  SaveTodos,
} from "./storage";
import { AddTodoWidget } from "./AddTodoWidget";
import { TodoWidget } from "./TodoWidget";
import { updateTodoListWidget } from "./updateTodoWidget";

const nameToWidget = {
  TodoList: TodoWidget,
  AddTodo: AddTodoWidget,
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget =
    nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

  switch (props.widgetAction) {
    case "WIDGET_ADDED": {
      if (widgetInfo.widgetName === "TodoList") {
        const todos = getStoredTodos();
        const listBg = getStoredBackgroundColor() as ColorProp;
        const fontSize = getStoredFontSize();

        props.renderWidget(
          <TodoWidget
            Todos={todos}
            FontSize={fontSize}
            ListBg={listBg}
          />,
        );
        break;
      } else {
        props.renderWidget(<AddTodoWidget />);
      }

      break;
    }

    case "WIDGET_UPDATE": {
      if (widgetInfo.widgetName === "TodoList") {
        const todos = getStoredTodos();
        const listBg = getStoredBackgroundColor() as ColorProp;
        const fontSize = getStoredFontSize();

        props.renderWidget(
          <TodoWidget
            Todos={todos}
            FontSize={fontSize}
            ListBg={listBg}
          />,
        );
      } else {
        props.renderWidget(<AddTodoWidget />);
      }

      break;
    }

    case "WIDGET_RESIZED": {
      if (widgetInfo.widgetName === "TodoList") {
        const todos = getStoredTodos();
        const listBg = getStoredBackgroundColor() as ColorProp;
        const fontSize = getStoredFontSize();

        props.renderWidget(
          <TodoWidget
            Todos={todos}
            FontSize={fontSize}
            ListBg={listBg}
          />,
        );
      } else {
        props.renderWidget(<AddTodoWidget />);
      }

      break;
    }

    case "WIDGET_DELETED":
      break;

    case "WIDGET_CLICK": {
      console.log("WIDGET CLICKED: ", widgetInfo.widgetName);
      if (
        widgetInfo.widgetName === "TodoList" ||
        widgetInfo.widgetName === "AddTodo"
      ) {
        if (props.clickAction === "ADD_ROUTE") {
          console.log("FAST ROUTING TO ADD...");
          Linking.openURL("xtodo://add");
          break;
        }

        if (props.clickAction === "MARK_TODO_DONE") {
          const id = props.clickActionData?.todoId;
          if (!id) break;

          const todos = getStoredTodos();
          const idx = todos.findIndex((todo) => todo.id === id);

          if (idx !== -1) {
            todos[idx].isDone = !todos[idx].isDone;
          }

          SaveTodos(todos);
          const sortedTodos = getStoredTodos();
          const listBg = getStoredBackgroundColor() as ColorProp;
          const fontSize = getStoredFontSize();
          updateTodoListWidget({
            Todos: sortedTodos,
            ListBg: listBg,
            FontSize: fontSize,
          });
          break;
        }

        if (props.clickAction === "EDIT") {
          const id = props.clickActionData?.todoId;
          if (!id) break;

          Linking.openURL(`xtodo://edit?id=${id}`);
          break;
        }

        break;
      }
    }

    // DEFAULT
    default:
      break;
  }
}
