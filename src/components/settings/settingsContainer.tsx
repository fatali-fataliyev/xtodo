import {
  ADD_BUTTON_TYPES,
  getAddBtnBySettingsName,
} from "@/constants/buttonTypes";
import {
  getClickSound,
  getSoundByMapName,
  SOUNDS_DATA,
} from "@/constants/clickSounds";

import { useSettingsStore } from "@/store/useSettingsStore";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAudioPlayer } from "expo-audio";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import ColorPicker, { Panel1, Swatches } from "reanimated-color-picker";
import { GlowProvider } from "../todos/GlowContext";
import ExampleTodoItem from "./exampleTodoItem";
import Footer from "./footer";
import Header from "./header";

interface SelectorOption<T> {
  label: string;
  value: T;
}

interface AnimatedSelectorProps<T> {
  options: SelectorOption<T>[];
  selected: T;
  onSelect: (option: T) => void;
  style?: any;
}

function AnimatedSelector<T extends string>({
  options,
  selected,
  onSelect,
  style,
}: AnimatedSelectorProps<T>) {
  const PADDING = 3;
  const [containerWidth, setContainerWidth] = useState(0);

  const pillWidth = containerWidth
    ? (containerWidth - PADDING * 2) / options.length
    : 0;

  const currentIndex = options.findIndex((opt) => opt.value === selected);
  const initialIndex = Math.max(0, currentIndex);
  const selectedIndex = useSharedValue(initialIndex);

  useEffect(() => {
    const idx = options.findIndex((opt) => opt.value === selected);
    selectedIndex.value = Math.max(0, idx);
  }, [selected, options]);

  const animatedPillStyle = useAnimatedStyle(() => {
    const translation = selectedIndex.value * pillWidth;
    return {
      transform: [
        {
          translateX: withTiming(translation, {
            duration: 200,
          }),
        },
      ],
    };
  });

  const handlePress = (value: T, index: number) => {
    selectedIndex.value = index;
    setTimeout(() => {
      onSelect(value);
    }, 200);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  return (
    <View style={[styles.selectorContainer, style]} onLayout={onLayout}>
      {containerWidth > 0 && (
        <Animated.View
          style={[styles.selectorPill, { width: pillWidth }, animatedPillStyle]}
        />
      )}

      {options.map((option, index) => {
        const isSelected = option.value === selected;
        return (
          <Pressable
            key={String(option.value)}
            style={styles.optionButton}
            onPress={() => handlePress(option.value, index)}
          >
            <Text
              style={[styles.optionText, isSelected && styles.optionTextActive]}
            >
              {option.label.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function SettingsContainer() {
  // ZUSTAND
  const currentPage = useSettingsStore((state) => state.rootPage);
  const selectedClickSound = useSettingsStore((state) => state.todoClickSound);
  const selectedAddBtnType = useSettingsStore((state) => state.addBtnType);
  const currentAddBtnType = getAddBtnBySettingsName(selectedAddBtnType)?.name;
  const currentClickSound = getSoundByMapName(selectedClickSound).name;
  const currentCustomAddBtnBg = useSettingsStore(
    (state) => state.customAddBtnBg,
  );
  const currentCustomAddBtnIconColor = useSettingsStore(
    (state) => state.customAddBtnIconColor,
  );
  const currentTodoDoneTextStyle = useSettingsStore(
    (state) => state.doneTodoTextStyle,
  );
  const updateRootPage = useSettingsStore((state) => state.updateRootPage);
  const updateTodoDoneTextStyle = useSettingsStore(
    (state) => state.updateDoneTextStyle,
  );
  const updateClickSound = useSettingsStore(
    (state) => state.updateTodoClickSound,
  );
  const updateAddBtnType = useSettingsStore((state) => state.updateAddBtnType);
  const updateCustomAddBtnBg = useSettingsStore(
    (state) => state.updateCustomAddBtnBg,
  );
  const updateCustomAddBtnIconColor = useSettingsStore(
    (state) => state.updateCustomAddBtnIconColor,
  );

  // LOCAL STATES
  const [isSoundOpen, setIsSoundOpen] = useState(false);
  const [isBtnOpen, setIsBtnOpen] = useState(false);
  const [showBGColorPicker, setShowBGColorPicker] = useState(false);
  const [showIconColorPicker, setShowIconColorPicker] = useState(false);
  const [demoTrigger, setDemoTrigger] = useState({ mapName: "", timestamp: 0 });
  const isCustomBtnSelected = selectedAddBtnType === "custom";

  const customBtnBGSharedColor = useSharedValue(currentCustomAddBtnBg);
  const customBtnIconSharedColor = useSharedValue(currentCustomAddBtnIconColor);

  // FUNCTIONS
  const player = useAudioPlayer(getClickSound(demoTrigger.mapName));

  const isColorPickerOpen = showBGColorPicker || showIconColorPicker;

  useEffect(() => {
    if (demoTrigger.mapName) {
      player.seekTo(0);
      player.play();
    }
  }, [demoTrigger]);

  useEffect(() => {
    customBtnBGSharedColor.value = currentCustomAddBtnBg;
  }, [currentCustomAddBtnBg]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: customBtnBGSharedColor.value,
    };
  });

  const setCustomBtnBGColor = ({ hex }: { hex: string }) => {
    updateCustomAddBtnBg(hex);
  };
  const setCustomBtnIconColor = ({ hex }: { hex: string }) => {
    updateCustomAddBtnIconColor(hex);
  };

  const handleOnChangeBGColor = ({ hex }: { hex: string }) => {
    "worklet";
    customBtnBGSharedColor.value = hex;
  };
  const handleOnChangeIconColor = ({ hex }: { hex: string }) => {
    "worklet";
    customBtnIconSharedColor.value = hex;
  };

  const toggleSoundDropdown = () => setIsSoundOpen(!isSoundOpen);
  const toggleBtnDropdown = () => setIsBtnOpen(!isBtnOpen);

  // ANIMATIONS FOR SOUND DROPDOWN
  const soundExpanded = useDerivedValue(() => {
    return isSoundOpen
      ? withTiming(1, { duration: 250 })
      : withTiming(0, { duration: 250 });
  }, [isSoundOpen]);

  const soundArrowStyle = useAnimatedStyle(() => {
    const rotate = soundExpanded.value * 180;
    return { transform: [{ rotate: `-${rotate}deg` }] };
  });

  const soundDropdownStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(isSoundOpen ? 405 : 0, { duration: 250 }),
      opacity: withTiming(isSoundOpen ? 1 : 0, { duration: 200 }),
      overflow: "hidden",
    };
  }, [isSoundOpen]);

  // ANIMATIONS FOR ADD BUTTON DROPDOWN
  const btnExpanded = useDerivedValue(() => {
    return isBtnOpen
      ? withTiming(1, { duration: 250 })
      : withTiming(0, { duration: 250 });
  }, [isBtnOpen]);

  const btnArrowStyle = useAnimatedStyle(() => {
    const rotate = btnExpanded.value * 180;
    return { transform: [{ rotate: `-${rotate}deg` }] };
  });

  const btnDropdownStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(isBtnOpen ? 120 : 0, { duration: 250 }),
      opacity: withTiming(isBtnOpen ? 1 : 0, { duration: 200 }),
      overflow: "hidden",
    };
  }, [isBtnOpen]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        isColorPickerOpen={isColorPickerOpen}
        bgColor={customBtnBGSharedColor}
        iconColor={customBtnIconSharedColor}
      />

      {/* SETTINGS SECTION */}
      <Animated.ScrollView>
        {/* HOME PAGE */}
        <View style={styles.menuItem}>
          <Text style={styles.menuItemTitle}>Home page</Text>
          <AnimatedSelector
            options={[
              { label: "todos", value: "todos" },
              { label: "notes", value: "notes" },
            ]}
            selected={currentPage}
            onSelect={updateRootPage}
            style={{ flex: 1, marginLeft: 15 }}
          />
        </View>
        {/* COMPLETED TODO STYLE */}
        <View style={[styles.menuItem, styles.menuItemMultiLine]}>
          <Text style={[styles.menuItemTitle, { marginBottom: 10 }]}>
            Completed todo style
          </Text>
          <AnimatedSelector
            options={[
              { label: "underline", value: "underline" },
              { label: "cross out", value: "line-through" },
              { label: "both", value: "underline line-through" },
            ]}
            selected={currentTodoDoneTextStyle}
            onSelect={updateTodoDoneTextStyle}
            style={{ width: "100%" }}
          />
          <GlowProvider>
            <ExampleTodoItem isDone={true} task="Review Products" />
          </GlowProvider>
        </View>
        {/* TODO COMPLETION SOUND DROPDOWN */}
        <Animated.View style={[styles.menuItem, styles.menuItemMultiLine]}>
          <Text style={[styles.menuItemTitle, { marginBottom: 10 }]}>
            Todo completion sound
          </Text>
          <TouchableOpacity style={styles.header} onPress={toggleSoundDropdown}>
            <Text style={styles.headerText}>{currentClickSound}</Text>
            <Animated.View style={soundArrowStyle}>
              <AntDesign name="down" size={12} color="#FFF" />
            </Animated.View>
          </TouchableOpacity>

          <Animated.View style={[styles.listContainer, soundDropdownStyle]}>
            <View style={{ paddingBottom: 4 }}>
              <FlatList
                data={SOUNDS_DATA}
                keyExtractor={(item) => item.mapName}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                      setIsSoundOpen(false);
                      updateClickSound(item.mapName);
                    }}
                  >
                    <Text style={styles.itemText}>{item.name}</Text>
                    <TouchableOpacity
                      style={styles.demoPlayBtn}
                      onPress={() => {
                        setDemoTrigger({
                          mapName: item.mapName,
                          timestamp: Date.now(),
                        });
                      }}
                    >
                      <FontAwesome name="play" size={20} color="#FFF" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
                scrollEnabled={false}
              />
            </View>
          </Animated.View>
        </Animated.View>
        {/* ADD TODO BUTTON DROPDOWN */}
        <Animated.View style={[styles.menuItem, styles.menuItemMultiLine]}>
          <Text style={[styles.menuItemTitle, { marginBottom: 10 }]}>
            Change add button
          </Text>
          <TouchableOpacity style={styles.header} onPress={toggleBtnDropdown}>
            <Text style={styles.headerText}>{currentAddBtnType}</Text>
            <Animated.View style={btnArrowStyle}>
              <AntDesign name="down" size={12} color="#FFF" />
            </Animated.View>
          </TouchableOpacity>

          <Animated.View style={[styles.listContainer, btnDropdownStyle]}>
            <View style={{ paddingBottom: 4 }}>
              <FlatList
                data={ADD_BUTTON_TYPES}
                keyExtractor={(item) => item.settingsName}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                      setIsBtnOpen(false);
                      updateAddBtnType(item.settingsName);
                    }}
                  >
                    <Text style={styles.itemText}>{item.name}</Text>
                    <Image
                      source={item.imgSrc}
                      style={{ width: 30, height: 30 }}
                    />
                  </TouchableOpacity>
                )}
                scrollEnabled={false}
              />
            </View>
          </Animated.View>

          {/* BUTTON COLOR PICKER */}
          {isCustomBtnSelected && (
            <View style={{ marginTop: 10 }}>
              <TouchableOpacity
                style={[
                  styles.colorPickerToggleBtn,
                  {
                    backgroundColor: showBGColorPicker ? "#1E293B" : "#1A1A1A",
                  },
                ]}
                onPress={() => {
                  setShowBGColorPicker(!showBGColorPicker);
                }}
              >
                <Text
                  style={[
                    styles.colorPickerToggleBtnText,
                    { color: showBGColorPicker ? "#38BDF8" : "#A1A1AA" },
                  ]}
                >
                  {showBGColorPicker ? "CLOSE AND SAVE" : "SET BUTTON COLOR"}
                </Text>
              </TouchableOpacity>

              {showBGColorPicker && (
                <View style={styles.inlinePickerContainer}>
                  <ColorPicker
                    thumbSize={30}
                    style={{ width: "100%" }}
                    value={currentCustomAddBtnBg}
                    onChange={handleOnChangeBGColor}
                    onCompleteJS={setCustomBtnBGColor}
                  >
                    <Panel1
                      style={{
                        borderRadius: 8,
                        marginBottom: 15,
                        height: 180,
                      }}
                    />

                    <Swatches
                      colors={[
                        "#DC2626",
                        "#F97316",
                        "#EAB308",
                        "#22C55E",
                        "#16A34A",
                        "#0D9488",
                        "#06B6D4",
                        "#2563EB",
                        "#7C3AED",
                        "#EC4899",
                        "#1F2937",
                        "#6B7280",
                      ]}
                    />
                  </ColorPicker>
                </View>
              )}
            </View>
          )}

          {/*BUTTON ICON COLORPICKER*/}
          {isCustomBtnSelected && (
            <View style={{ marginTop: 10 }}>
              <TouchableOpacity
                style={[
                  styles.colorPickerToggleBtn,
                  {
                    backgroundColor: showIconColorPicker
                      ? "#1E293B"
                      : "#1A1A1A",
                  },
                ]}
                onPress={() => {
                  setShowIconColorPicker(!showIconColorPicker);
                }}
              >
                <Text
                  style={[
                    styles.colorPickerToggleBtnText,
                    { color: showIconColorPicker ? "#38BDF8" : "#A1A1AA" },
                  ]}
                >
                  {showIconColorPicker ? "CLOSE AND SAVE" : "SET ICON COLOR"}
                </Text>
              </TouchableOpacity>

              {showIconColorPicker && (
                <View style={styles.inlinePickerContainer}>
                  <ColorPicker
                    thumbSize={30}
                    style={{ width: "100%" }}
                    value={currentCustomAddBtnIconColor}
                    onChange={handleOnChangeIconColor}
                    onCompleteJS={setCustomBtnIconColor}
                  >
                    <Panel1
                      style={{
                        borderRadius: 8,
                        marginBottom: 15,
                        height: 180,
                      }}
                    />

                    <Swatches
                      colors={[
                        "#DC2626",
                        "#F97316",
                        "#EAB308",
                        "#22C55E",
                        "#16A34A",
                        "#0D9488",
                        "#06B6D4",
                        "#2563EB",
                        "#7C3AED",
                        "#EC4899",
                        "#1F2937",
                        "#6B7280",
                      ]}
                    />
                  </ColorPicker>
                </View>
              )}
            </View>
          )}
        </Animated.View>

        {/* _FOOTER */}
        <Footer />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
    padding: 20,
  },
  menuItem: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#262626",
    marginTop: 15,
    marginBottom: 15,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  menuItemTitle: {
    color: "#FFF",
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
  },
  menuItemMultiLine: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  selectorContainer: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 3,
    position: "relative",
    height: 34,
    alignItems: "center",
    overflow: "hidden",
  },
  selectorPill: {
    position: "absolute",
    top: 3,
    bottom: 3,
    left: 3,
    backgroundColor: "#2F2F30",
    borderRadius: 6,
  },
  optionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    zIndex: 1,
  },
  optionText: {
    color: "#8E8E93",
    fontSize: 12,
    fontWeight: "600",
  },
  optionTextActive: {
    color: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#262626",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#000",
  },
  headerText: {
    fontSize: 16,
    color: "#FFF",
  },
  listContainer: {
    borderWidth: 1,
    borderColor: "#3D3C3C",
    borderRadius: 8,
    backgroundColor: "#000",
  },
  item: {
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  },
  itemText: {
    fontSize: 16,
    color: "#FFFAFA",
  },
  demoPlayBtn: {
    position: "absolute",
    backgroundColor: "#1A1717",
    borderRadius: 15,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    right: 3,
    zIndex: 999,
    width: "25%",
  },
  inlinePickerContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#262626",
  },
  colorPickerToggleBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#262626",
    justifyContent: "center",
    alignItems: "center",
  },
  colorPickerToggleBtnText: {
    alignSelf: "center",
    fontFamily: "Inter-Bold",
    color: "#FFF",
  },
});
