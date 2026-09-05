import { Note, useNoteStore } from "@/store/useNoteStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { parseDate } from "@/utils/dateParser";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import * as crypto from "expo-crypto";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Share,
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
import { textEditorStyles } from "./EditorElementsStyle";

const TOOLBAR_ITEM_SIZE = 23;

export default function NoteEditorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // ZUSTAND STATES
  const notes = useNoteStore((state) => state.notes);
  const addNote = useNoteStore((state) => state.addNote);
  const updateNote = useNoteStore((state) => state.updateNote);
  const hourFormat = useSettingsStore((state) => state.hourFormat);

  // LOCAL STATES
  const found = notes.find((noteItem) => noteItem.id === id);
  const note: Note | undefined = found;

  const [title, setTitle] = useState(note ? note.title : "");
  console.log("TITLE: ", title);
  const [editorContent, setEditorContent] = useState("");
  const [createdDate] = useState(() => (note ? note.createdAt : new Date()));

  const editorRef = useRef<EnrichedTextInputInstance>(null);
  const initialTitle = useRef<string>("");
  const [stylesState, setStylesState] = useState<
    OnChangeStateEvent | any | null
  >(null);

  const initialContent = useRef<string>("");
  console.log("INITIAL title: ", initialTitle.current);
  const [isInitialContentCaptured, setIsInitialContentCaptured] =
    useState<boolean>(false);

  const isSaveDisabled =
    editorContent === initialContent.current && title === initialTitle.current;
  const isShareButtonDisabled = editorContent.trim() === "";

  const isNewNote = id === "new";

  useEffect(() => {
    if (!isNewNote && note?.content) {
      editorRef.current?.setValue(note.content);
      initialTitle.current = note.title;
    }
  }, [id]);

  const handleSave = useCallback(async () => {
    const htmlContent = await editorRef.current?.getHTML();

    const trimmedTitle = title.trim();
    const emptyHtml = isHtmlEmpty(htmlContent);

    if (emptyHtml && !trimmedTitle) {
      router.back();
      return;
    }

    let content = "";

    if (htmlContent && !emptyHtml) {
      content = htmlContent.trim();
    }

    const finalTitle = trimmedTitle || "Untitled";

    if (isNewNote) {
      addNote({
        id: crypto.randomUUID(),
        title: finalTitle,
        content,
        createdAt: createdDate,
        updatedAt: new Date(),
      });
    } else {
      updateNote(id, {
        title: finalTitle,
        content,
        updatedAt: new Date(),
      });
    }
    router.back();
  }, [id, isNewNote, addNote, updateNote, router, createdDate, title]);

  const handleSaveRef = useRef(handleSave);
  useEffect(() => {
    handleSaveRef.current = handleSave;
  }, [handleSave]);

  const handleTitleInputPress = () => {
    const titleText: string = initialTitle.current.trim().toLowerCase();
    if (titleText === "untitled") {
      setTitle("");
    }
  };

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

  const handleTextShare = async () => {
    try {
      await Share.share({
        message: editorContent,
      });
    } catch (err) {
      alert(`failed to share text: ${err}`);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleSave}>
          <MaterialIcons name={"arrow-back-ios-new"} color={"#FFF"} size={22} />
        </TouchableOpacity>

        <View style={styles.headerActionMenuContainer}>
          {/*SHARE*/}
          <TouchableOpacity
            style={[
              styles.headerActionButton,
              isShareButtonDisabled && { opacity: 0.4 },
              { marginRight: 5 },
            ]}
            disabled={isShareButtonDisabled}
            onPress={handleTextShare}
          >
            <MaterialIcons
              name="share"
              color={isShareButtonDisabled ? "#666" : "#FFF"}
              size={21}
            />
          </TouchableOpacity>

          {/*SAVE*/}
          <TouchableOpacity
            style={[
              styles.headerActionButton,
              isSaveDisabled && { opacity: 0.4 },
            ]}
            disabled={isSaveDisabled}
            onPress={handleSave}
          >
            <MaterialIcons
              name="check"
              color={isSaveDisabled ? "#666" : "#FFF"}
              size={25}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title Section */}
      <TextInput
        style={styles.title}
        placeholder="Title"
        placeholderTextColor="#4a4a4a"
        value={title}
        onChangeText={setTitle}
        selectionColor="#eab308"
        onPress={handleTitleInputPress}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {parseDate(createdDate, hourFormat)} | {editorContent.trim().length}{" "}
          characters
        </Text>
      </View>

      {/* Rich Text Editor Body */}
      <View style={styles.editorContainer}>
        <EnrichedTextInput
          placeholder="Start writing..."
          placeholderTextColor="#4a4a4a"
          selectionColor="#eab308"
          ref={editorRef}
          onChangeState={(e) => setStylesState(e.nativeEvent)}
          onChangeText={(e) => {
            if (!isInitialContentCaptured && e.nativeEvent.value !== "") {
              initialContent.current = e.nativeEvent.value;
              setEditorContent(e.nativeEvent.value ?? "");
              setIsInitialContentCaptured(true);
            }
            setEditorContent(e.nativeEvent.value ?? "");
          }}
          style={styles.editorInput}
          cursorColor="#CCC"
          autoFocus={isNewNote}
          htmlStyle={textEditorStyles}
        />
      </View>

      {/* Toolbar */}
      <View style={styles.stickyToolbarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.toolbarScrollContent}
        >
          {/* H1 */}
          <TouchableOpacity
            style={[
              styles.toolbarButton,
              stylesState?.h1?.isActive && styles.toolbarButtonActive,
            ]}
            onPress={() => editorRef.current?.toggleH1()}
          >
            <MaterialDesignIcons
              name="format-header-1"
              size={TOOLBAR_ITEM_SIZE}
              color={stylesState?.h1?.isActive ? "#eab308" : "#9ca3af"}
            />
          </TouchableOpacity>

          {/* H2 */}
          <TouchableOpacity
            style={[
              styles.toolbarButton,
              stylesState?.h2?.isActive && styles.toolbarButtonActive,
            ]}
            onPress={() => editorRef.current?.toggleH2()}
          >
            <MaterialDesignIcons
              name="format-header-2"
              size={TOOLBAR_ITEM_SIZE}
              color={stylesState?.h2?.isActive ? "#eab308" : "#9ca3af"}
            />
          </TouchableOpacity>

          {/* H3 */}
          <TouchableOpacity
            style={[
              styles.toolbarButton,
              stylesState?.h3?.isActive && styles.toolbarButtonActive,
            ]}
            onPress={() => editorRef.current?.toggleH3()}
          >
            <MaterialDesignIcons
              name="format-header-3"
              size={TOOLBAR_ITEM_SIZE}
              color={stylesState?.h3?.isActive ? "#eab308" : "#9ca3af"}
            />
          </TouchableOpacity>

          {/* BOLD */}
          <TouchableOpacity
            style={[
              styles.toolbarButton,
              stylesState?.bold?.isActive && styles.toolbarButtonActive,
            ]}
            onPress={() => editorRef.current?.toggleBold()}
          >
            <MaterialDesignIcons
              name="format-bold"
              size={TOOLBAR_ITEM_SIZE}
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
            <MaterialDesignIcons
              name="format-underline"
              size={TOOLBAR_ITEM_SIZE}
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
            <MaterialDesignIcons
              name="format-italic"
              size={TOOLBAR_ITEM_SIZE}
              color={stylesState?.italic?.isActive ? "#eab308" : "#9ca3af"}
            />
          </TouchableOpacity>

          {/* STRIKE Through */}
          <TouchableOpacity
            style={[
              styles.toolbarButton,
              stylesState?.strikeThrough?.isActive &&
                styles.toolbarButtonActive,
            ]}
            onPress={() => editorRef.current?.toggleStrikeThrough()}
          >
            <MaterialDesignIcons
              name="format-strikethrough"
              size={TOOLBAR_ITEM_SIZE}
              color={
                stylesState?.strikeThrough?.isActive ? "#eab308" : "#9ca3af"
              }
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
            <MaterialDesignIcons
              name="format-list-numbered"
              size={TOOLBAR_ITEM_SIZE}
              color={stylesState?.orderedList?.isActive ? "#eab308" : "#9ca3af"}
            />
          </TouchableOpacity>

          {/* UNORDERED LIST */}
          <TouchableOpacity
            style={[
              styles.toolbarButton,
              stylesState?.unorderedList?.isActive &&
                styles.toolbarButtonActive,
            ]}
            onPress={() => editorRef.current?.toggleUnorderedList()}
          >
            <MaterialDesignIcons
              name="format-list-bulleted"
              size={TOOLBAR_ITEM_SIZE}
              color={
                stylesState?.unorderedList?.isActive ? "#eab308" : "#9ca3af"
              }
            />
          </TouchableOpacity>

          {/* CHECKBOX */}
          <TouchableOpacity
            style={[
              styles.toolbarButton,
              stylesState?.checkboxList?.isActive && styles.toolbarButtonActive,
            ]}
            onPress={() => editorRef.current?.toggleCheckboxList(false)}
          >
            <MaterialDesignIcons
              name="checkbox-multiple-marked-outline"
              size={TOOLBAR_ITEM_SIZE}
              color={
                stylesState?.checkboxList?.isActive ? "#eab308" : "#9ca3af"
              }
            />
          </TouchableOpacity>

          {/* CODE INLINE */}
          <TouchableOpacity
            style={[
              styles.toolbarButton,
              stylesState?.inlineCode?.isActive && styles.toolbarButtonActive,
            ]}
            onPress={() => editorRef.current?.toggleInlineCode()}
          >
            <MaterialDesignIcons
              name="code-tags"
              size={TOOLBAR_ITEM_SIZE}
              color={stylesState?.inlineCode?.isActive ? "#eab308" : "#9ca3af"}
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
            <MaterialDesignIcons
              name="code-json"
              size={TOOLBAR_ITEM_SIZE - 2}
              color={stylesState?.codeBlock?.isActive ? "#eab308" : "#9ca3af"}
            />
          </TouchableOpacity>

          {/* CLEAR TEXT INPUT */}
          <TouchableOpacity
            style={[styles.toolbarButton]}
            onPress={() => editorRef.current?.setValue("")}
          >
            <MaterialDesignIcons
              name="broom"
              size={TOOLBAR_ITEM_SIZE}
              color={"#9ca3af"}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

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
    paddingHorizontal: 15,
    marginTop: 20,
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
    paddingHorizontal: 20,
    marginTop: 5,
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
    paddingHorizontal: 15,
  },
  headerActionMenuContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerActionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
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
  stickyToolbarContainer: {
    backgroundColor: "#1e1e1e",
    borderTopWidth: 1,
    borderColor: "#2d2d2d",
    width: "100%",
  },
  toolbarScrollContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 5,
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
});
