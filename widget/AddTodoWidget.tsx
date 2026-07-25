"use no memo";
import { FlexWidget, ImageWidget } from "react-native-android-widget";

export function AddTodoWidget() {
  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
      }}
      clickAction="ADD_ROUTE"
    >
      <FlexWidget
        style={{
          width: "match_parent",
          height: "match_parent",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ImageWidget
          image={require("../assets/images/add_neum.png")}
          imageHeight={45}
          imageWidth={45}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
