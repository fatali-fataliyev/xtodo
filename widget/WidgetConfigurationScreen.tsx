import { Image } from "expo-image";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { WidgetConfigurationScreenProps } from "react-native-android-widget";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import {
  getStoredBackgroundColor,
  getStoredTodos,
  mmkvStorage,
  TODO_LIST_BG_KEY,
  TODO_TEXT_FONTSIZE_KEY,
} from "./storage";
import { getProrityCircleColor } from "./TodoWidget";

const COLORS = [
  { name: "Default", value: "#1A1818" },
  { name: "Blue Dark", value: "#1F2937" },
  { name: "Blue Green", value: "#152226" },
  { name: "Muted Green", value: "#191B1C" },
];

const FONT_SIZES = [
  {
    name: "Small",
    fontSize: 10,
  },
  {
    name: "Normal",
    fontSize: 12,
  },
  {
    name: "Large",
    fontSize: 14,
  },
];

const MOCK_TODOS = [
  {
    id: "1",
    task: "Todo 1",
    priority: "high",
  },

  {
    id: "2",
    task: "Todo 2",
    priority: "medium",
  },

  {
    id: "3",
    task: "Todo 3",
    priority: "low",
  },
];

export function WidgetConfigurationScreen({
  setResult,
  renderWidget,
}: WidgetConfigurationScreenProps) {
  const initialColor = getStoredBackgroundColor() as string;

  const [selectedColor, setSelectedColor] = useState(initialColor);

  const [fontSize, setFontSize] = useState<number>(10);

  const isDark = selectedColor !== "#FFFFFF" && selectedColor !== "#F97316";

  const handleSave = () => {
    mmkvStorage?.set(TODO_LIST_BG_KEY, selectedColor);
    mmkvStorage?.set(TODO_TEXT_FONTSIZE_KEY, fontSize);

    const { TodoWidget } = require("./TodoWidget");

    const todos = getStoredTodos();

    renderWidget(
      <TodoWidget Todos={todos} ListBg={selectedColor} FontSize={fontSize} />,
    );

    setResult("ok");
  };

  const handleCancel = () => {
    setResult("cancel");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={{
            flex: 1,
          }}
        >
          <Text style={styles.title}>Configure Widget</Text>

          {/*PREVIEW*/}

          <View style={styles.preview}>
            <Text style={styles.previewLabel}>Preview</Text>

            <View
              style={[styles.previewWidget, { backgroundColor: selectedColor }]}
            >
              <View style={styles.previewHeader}>
                <View
                  style={[
                    styles.previewAddButton,
                    { backgroundColor: "#374151" },
                  ]}
                >
                  <Text
                    style={[
                      styles.previewAddButtonText,

                      isDark ? styles.lightText : styles.darkText,
                    ]}
                  >
                    +
                  </Text>
                </View>
              </View>

              <View style={styles.previewTodoList}>
                {MOCK_TODOS.map((todo) => (
                  <View key={todo.id} style={styles.todoItemContainer}>
                    <View
                      style={[
                        styles.todoItemButton,
                        { marginRight: 5, alignItems: "flex-end" },
                      ]}
                    >
                      <Image
                        source={require("../assets/images/widget/undone.png")}
                        style={{ width: 15, height: 15 }}
                        resizeMode="contain"
                      />
                    </View>

                    <View style={styles.todoItem}>
                      <Text
                        style={[
                          isDark ? styles.lightText : styles.darkText,
                          { fontSize: fontSize, paddingLeft: 6 },
                        ]}
                      >
                        {todo.task}
                      </Text>
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 10,
                          backgroundColor: getProrityCircleColor(todo.priority),
                          marginRight: 6,
                        }}
                      />
                    </View>

                    <View style={[styles.todoItemButton, { marginLeft: 5 }]}>
                      <Image
                        source={require("../assets/images/widget/edit.png")}
                        style={{ width: 15, height: 15 }}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/*COLOR SELECTION*/}

          <View style={styles.content}>
            <Text style={styles.subtitle}>Choose a background color</Text>

            <View style={styles.colorsContainer}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color.value}

                  style={[
                    styles.colorButton,

                    { backgroundColor: color.value },

                    selectedColor === color.value && styles.selectedColor,
                  ]}

                  onPress={() => setSelectedColor(color.value)}
                >
                  {selectedColor === color.value && (
                    <Text
                      style={[
                        styles.checkmark,

                        color.value === "#FFFFFF" || color.value === "#F97316"
                          ? styles.darkCheckmark
                          : styles.lightCheckmark,
                      ]}
                    >
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.subtitle}>Choose Font Size</Text>
            <View style={styles.fontSizeContainer}>
              {FONT_SIZES.map((size) => (
                <TouchableOpacity
                  key={size.name}
                  style={[
                    styles.sizeButton,
                    fontSize === size.fontSize && styles.selectedSizeButton,
                  ]}
                  onPress={() => setFontSize(size.fontSize)}
                >
                  <Text
                    style={[
                      styles.sizeButtonText,
                      fontSize === size.fontSize &&
                        styles.selectedSizeButtonText,
                    ]}
                  >
                    {size.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1818",
  },

  content: {
    flex: 1,
    padding: 24,
  },

  todoItemContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  todoItem: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#374151",
    borderRadius: 8,
    padding: 4,
  },
  todoItemButton: {
    width: "10%",
  },
  fontSizeLabel: {
    fontSize: 14,
    color: "#C1C1C1",
    marginBottom: 12,
    textAlign: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#CCC",
    marginTop: 10,
    marginBottom: 33,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 24,
    textAlign: "center",
  },

  colorsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  colorButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },

  selectedColor: {
    borderColor: "#3B82F6",
    borderWidth: 3,
  },

  checkmark: {
    fontSize: 24,
    fontWeight: "bold",
  },

  darkCheckmark: {
    color: "#1F2937",
  },

  lightCheckmark: {
    color: "#FFFFFF",
  },

  fontSizeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 32,
  },
  sizeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4B5563",
    backgroundColor: "#1F2937",
    alignItems: "center",
  },
  selectedSizeButton: {
    borderColor: "#CCC",
    backgroundColor: "#000000",
  },
  sizeButtonText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600",
  },
  selectedSizeButtonText: {
    color: "#FFFFFF",
  },

  preview: {
    marginBottom: 33,
  },

  previewLabel: {
    fontSize: 14,
    color: "#C1C1C1",
    marginBottom: 12,
    textAlign: "center",
  },

  previewWidget: {
    height: 190,
    width: "90%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  previewHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  previewTodoList: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  previewAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  previewAddButtonText: {
    fontSize: 24,
    fontWeight: "300",
  },

  darkText: {
    color: "#1F2937",
  },

  lightText: {
    color: "#FFFFFF",
  },

  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: "auto",
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B5563",
  },

  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#3B82F6",
    alignItems: "center",
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
