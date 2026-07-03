import { Note, useNoteStore } from "@/store/useNoteStore";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import * as crypto from "expo-crypto";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  ColorValue,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  EnrichedTextInput,
  EnrichedTextInputInstance,
  OnChangeStateEvent,
} from "react-native-enriched-html";

interface customTextEditorStyle {
  h1?: { fontSize?: number; bold?: boolean };
  h2?: { bold?: boolean };
  codeblock?: {
    color?: ColorValue;
    borderRadius?: number;
    backgroundColor?: ColorValue;
  };
}

const textEditorStyles: customTextEditorStyle = {
  h1: { fontSize: 28, bold: true },
  h2: { bold: true },
  codeblock: { backgroundColor: "#000", borderRadius: 3, color: "#33FF00" },
};

export default function NoteEditorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // ZUSTAND STATES
  const notes = useNoteStore((state) => state.notes);
  const addNote = useNoteStore((state) => state.addNote);
  const updateNote = useNoteStore((state) => state.updateNote);

  // LOCAL STATES
  const found = notes.find((noteItem) => noteItem.id === id);
  const note: Note | undefined = found;

  const [title, setTitle] = useState(note ? note.title : "");
  const [createdDate] = useState(() => (note ? note.createdAt : new Date()));

  const editorRef = useRef<EnrichedTextInputInstance>(null);
  const titleRef = useRef(title);
  const [stylesState, setStylesState] = useState<OnChangeStateEvent | null>(
    null,
  );

  const isNewNote = id === "new";

  useEffect(() => {
    if (!isNewNote && note?.content) {
      const timer = setTimeout(() => {
        editorRef.current?.setValue(note.content);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [id]);

  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  const handleSave = useCallback(async () => {
    let content: string = "";
    const htmlContent = await editorRef.current?.getHTML();

    let trimmedTitle = titleRef.current.trim();
    const emptyHtml = isHtmlEmpty(htmlContent);

    if (emptyHtml && !trimmedTitle) {
      router.back();
      return;
    }

    if (htmlContent && !emptyHtml) {
      content = htmlContent.trim();
    }

    if (!trimmedTitle) {
      trimmedTitle = "Untitled";
    }

    if (isNewNote) {
      addNote({
        id: crypto.randomUUID(),
        title: trimmedTitle,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      updateNote(id, {
        title: trimmedTitle,
        content,
        updatedAt: new Date(),
      });
    }
    router.back();
  }, [id, isNewNote, addNote, updateNote, router]);

  const handleSaveRef = useRef(handleSave);
  useEffect(() => {
    handleSaveRef.current = handleSave;
  }, [handleSave]);

  useEffect(() => {
    const onBackPress = () => {
      handleSaveRef.current();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleSave}>
          <MaterialIcons name="arrow-back-ios" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Title Section */}
      <TextInput
        style={styles.title}
        placeholder="Title"
        placeholderTextColor="#4a4a4a"
        value={title}
        onChangeText={setTitle}
        selectionColor="#eab308"
      />

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{parseDate(createdDate)}</Text>
      </View>

      {/* Rich Text Editor Body */}
      <View style={styles.editorContainer}>
        <EnrichedTextInput
          placeholder="Start writing..."
          placeholderTextColor="#4a4a4a"
          ref={editorRef}
          onChangeState={(e) => setStylesState(e.nativeEvent)}
          style={styles.editorInput}
          cursorColor={"#CCC"}
          autoFocus={true}
          htmlStyle={textEditorStyles}
        />
      </View>

      {/* Toolbar */}
      <View style={styles.stickyToolbar}>
        {/* H1 */}
        <TouchableOpacity
          style={[
            styles.toolbarButton,
            stylesState?.h1?.isActive && styles.toolbarButtonActive,
          ]}
          onPress={() => editorRef.current?.toggleH1()}
        >
          <View style={styles.headingIconContainer}>
            <Octicons
              name="heading"
              size={14}
              color={stylesState?.h1?.isActive ? "#eab308" : "#9ca3af"}
            />
            <Text
              style={[
                styles.headingSubText,
                { color: stylesState?.h1?.isActive ? "#eab308" : "#9ca3af" },
              ]}
            >
              1
            </Text>
          </View>
        </TouchableOpacity>

        {/* H2 */}
        <TouchableOpacity
          style={[
            styles.toolbarButton,
            stylesState?.h2?.isActive && styles.toolbarButtonActive,
          ]}
          onPress={() => editorRef.current?.toggleH2()}
        >
          <View style={styles.headingIconContainer}>
            <Octicons
              name="heading"
              size={14}
              color={stylesState?.h2?.isActive ? "#eab308" : "#9ca3af"}
            />
            <Text
              style={[
                styles.headingSubText,
                { color: stylesState?.h2?.isActive ? "#eab308" : "#9ca3af" },
              ]}
            >
              2
            </Text>
          </View>
        </TouchableOpacity>

        {/* BOLD */}
        <TouchableOpacity
          style={[
            styles.toolbarButton,
            stylesState?.bold?.isActive && styles.toolbarButtonActive,
          ]}
          onPress={() => editorRef.current?.toggleBold()}
        >
          <MaterialIcons
            name="format-bold"
            size={20}
            color={stylesState?.bold?.isActive ? "#eab308" : "#9ca3af"}
          />
        </TouchableOpacity>

        {/* UNDERLINE */}
        <TouchableOpacity
          style={[
            styles.toolbarButton,
            stylesState?.underline?.isActive && styles.toolbarButtonActive,
          ]}
          onPress={() => editorRef.current?.toggleUnderline()}
        >
          <MaterialIcons
            name="format-underline"
            size={20}
            color={stylesState?.underline?.isActive ? "#eab308" : "#9ca3af"}
          />
        </TouchableOpacity>

        {/* ITALIC */}
        <TouchableOpacity
          style={[
            styles.toolbarButton,
            stylesState?.italic?.isActive && styles.toolbarButtonActive,
          ]}
          onPress={() => editorRef.current?.toggleItalic()}
        >
          <MaterialIcons
            name="format-italic"
            size={20}
            color={stylesState?.italic?.isActive ? "#eab308" : "#9ca3af"}
          />
        </TouchableOpacity>

        {/* ORDERED LIST */}
        <TouchableOpacity
          style={[
            styles.toolbarButton,
            stylesState?.orderedList?.isActive && styles.toolbarButtonActive,
          ]}
          onPress={() => editorRef.current?.toggleOrderedList()}
        >
          <AntDesign
            name="ordered-list"
            size={20}
            color={stylesState?.orderedList?.isActive ? "#eab308" : "#9ca3af"}
          />
        </TouchableOpacity>

        {/* CODE BLOCK */}
        <TouchableOpacity
          style={[
            styles.toolbarButton,
            stylesState?.codeBlock?.isActive && styles.toolbarButtonActive,
          ]}
          onPress={() => editorRef.current?.toggleCodeBlock()}
        >
          <Entypo
            name="code"
            size={20}
            color={stylesState?.codeBlock?.isActive ? "#eab308" : "#9ca3af"}
          />
        </TouchableOpacity>

        {/* CLEAR TEXT INPUT */}
        <TouchableOpacity
          style={[styles.toolbarButton]}
          onPress={() => editorRef.current?.setValue("")}
        >
          <MaterialCommunityIcons name="broom" size={20} color={"#9ca3af"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const parseDate = (dateParam: Date | string | undefined): string => {
  if (!dateParam) return "Unknown date";

  const date = dateParam instanceof Date ? dateParam : new Date(dateParam);

  if (isNaN(date.getTime())) return "Unknown date";

  const monthName = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${monthName} ${day}, ${hours}:${minutes}`;
};

const isHtmlEmpty = (html: string | undefined | null): boolean => {
  if (!html) return true;
  const cleanText = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return cleanText.length === 0;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 50,
    marginTop: 10,
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#262626",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: "#eab308",
    fontWeight: "600",
    fontSize: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    fontFamily: "Inter-Regular",
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoText: {
    color: "#6b7280",
    fontSize: 13,
    fontWeight: "500",
  },
  editorContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  editorInput: {
    width: "100%",
    height: "100%",
    fontSize: 16,
    lineHeight: 24,
    color: "#e5e7eb",
    fontFamily: "Inter-Regular",
    paddingHorizontal: 8,
  },
  stickyToolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#2d2d2d",
    width: "100%",
  },
  toolbarButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  toolbarButtonActive: {
    backgroundColor: "#2a2a2a",
  },
  headingIconContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  headingSubText: {
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 1,
  },
});
