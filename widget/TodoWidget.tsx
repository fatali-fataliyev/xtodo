"use no memo";
import { Todo } from "@/store/useTodoStore";
import type { ColorProp } from "react-native-android-widget";
import {
  FlexWidget,
  ImageWidget,
  ListWidget,
  TextWidget,
} from "react-native-android-widget";

export interface TodoWidgetProps {
  Todos: Todo[];
  ListBg: ColorProp;
  FontSize: number;
}

function TodoList({ Todos, ListBg, FontSize }: TodoWidgetProps) {
  if (!Todos || Todos === undefined) {
    Todos = [];
  }

  return (
    <ListWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        backgroundColor: ListBg,
      }}
    >
      {Todos.length === 0 ? (
        <FlexWidget
          style={{
            width: "match_parent",
            height: "match_parent",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextWidget
            text="No todos here yet"
            style={{
              color: "#FFF",
            }}
          />
        </FlexWidget>
      ) : (
        Todos.map((todo) => (
          // MAIN ROW
          <FlexWidget
            key={todo.id}
            style={{
              width: "match_parent",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FlexWidget
              style={{
                flex: 9,
                flexDirection: "row",
                alignItems: "center",
                overflow: "hidden",
                marginTop: 5,
                marginBottom: 5,
              }}
              clickAction="MARK_TODO_DONE"
              clickActionData={{ todoId: todo.id }}
            >
              {/* DONE ICON */}
              <ImageWidget
                imageWidth={15}
                imageHeight={15}
                image={
                  todo.isDone
                    ? require("../assets/images/widget/done.png")
                    : require("../assets/images/widget/undone.png")
                }
                style={{ marginHorizontal: 5 }}
              />

              {/* TASK & PRIORITY WRAPPER */}
              <FlexWidget
                style={{
                  flex: 1,
                  backgroundColor: "#374151",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginVertical: 4,
                  borderRadius: 8,
                }}
              >
                <FlexWidget style={{ flex: 10 }}>
                  <TextWidget
                    text={
                      todo.isDone ? makeStrikethrough(todo.task) : todo.task
                    }
                    style={{
                      fontSize: FontSize,
                      color: todo.isDone ? "#808080" : "#ffffff",
                      fontWeight: "500",
                      fontFamily: "Roboto",
                    }}
                    maxLines={1}
                    truncate="END"
                  />
                </FlexWidget>

                {/* PRIORITY */}

                <FlexWidget
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 10,
                    backgroundColor: todo.isDone
                      ? getProrityCircleColor("done")
                      : getProrityCircleColor(todo.priority),
                  }}
                />
              </FlexWidget>
            </FlexWidget>

            {/* RIGHT SIDE: 10% (EDIT Icon) */}
            <FlexWidget
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 5,
              }}
              clickAction="EDIT"
              clickActionData={{ todoId: todo.id }}
            >
              <ImageWidget
                imageWidth={15}
                imageHeight={15}
                image={require("../assets/images/widget/edit.png")}
              />
            </FlexWidget>
          </FlexWidget>
        ))
      )}
    </ListWidget>
  );
}

export const Colors = {
  high: "#E53935",
  medium: "#FFD166",
  low: "#06D6A0",
};

export function getProrityCircleColor(priority: string): ColorProp {
  let color: string;

  switch (priority) {
    case "high":
      color = Colors.high;
      break;
    case "medium":
      color = Colors.medium;
      break;
    case "low":
      color = Colors.low;
      break;
    case "done":
      color = "#808080";
      break;
    default:
      color = "#808080";
  }

  const colorFormatted = color.slice(1);

  return `#${colorFormatted}`;
}

function makeStrikethrough(text: string): string {
  return text
    .split("")
    .map((char) => char + "\u0336")
    .join("");
}

export function TodoWidget({ Todos, ListBg, FontSize }: TodoWidgetProps) {
  if (!Todos || Todos === undefined) {
    Todos = [];
  }

  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        backgroundColor: ListBg,
        flexDirection: "column",
        alignItems: "flex-end",
        paddingHorizontal: 16,
        paddingTop: 8,
        borderRadius: 16,
      }}
    >
      <FlexWidget
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#374151",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
        }}
        clickAction="ADD_ROUTE"
      >
        <TextWidget
          text="+"
          style={{
            fontSize: 24,
            color: "#FFFFFF",
            fontWeight: "300",
          }}
        />
      </FlexWidget>

      <TodoList Todos={Todos} FontSize={FontSize} ListBg={ListBg} />
    </FlexWidget>
  );
}
