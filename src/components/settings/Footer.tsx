import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { useState } from "react";
import {
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Divider from "./Divider";

const logo = require("../../../assets/images/xtodo_clear.png");

export default function Footer() {
  const appVersion = Constants.expoConfig?.version || "1.0.0";

  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [aboutContentHeight, setAboutContentHeight] = useState(0);

  const animatedHeight = useSharedValue(0);

  const handleGitRepoURL = async () => {
    const repoURL = "https://github.com/fatali-fataliyev/xtodo";
    const supported = await Linking.canOpenURL(repoURL);

    if (supported) {
      await Linking.openURL(repoURL);
    } else {
      alert(
        "Failed to open GitHub repo URL. Make sure you have a browser installed.",
      );
    }
  };

  const handlePixabayURL = async () => {
    const URL = "https://pixabay.com/";
    const supported = await Linking.canOpenURL(URL);
    if (supported) {
      await Linking.openURL(URL);
    } else {
      alert(
        "Failed to open Pixabay URL. Make sure you have a browser installed.",
      );
    }
  };

  const onShare = async () => {
    try {
      await Share.share({
        message:
          "Get XTodo, stay organized and productive. Download here: https://xtodo.app",
        url: "https://xtodo.app",
        title: "Share XTodo",
      });
    } catch (error) {
      alert(`failed to share app: ${error}`);
    }
  };

  const toggleAbout = () => {
    const nextExpanded = !isAboutExpanded;
    setIsAboutExpanded(nextExpanded);

    animatedHeight.value = withTiming(nextExpanded ? aboutContentHeight : 0, {
      duration: 250,
    });
  };

  const animatedContentStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    overflow: "hidden",
  }));

  const animatedChevronStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: withTiming(isAboutExpanded ? "-180deg" : "0deg", {
          duration: 250,
        }),
      },
    ],
  }));

  const handleAboutLayout = (event: any) => {
    const height = event.nativeEvent.layout.height;

    if (height !== aboutContentHeight) {
      setAboutContentHeight(height);

      if (isAboutExpanded) {
        animatedHeight.value = withTiming(height, {
          duration: 250,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Divider text="ABOUT" />

      <View style={styles.quickLinksContainer}>
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} contentFit="contain" />
        </View>

        {/* GIT */}
        <TouchableOpacity
          style={styles.linkItem}
          onPress={handleGitRepoURL}
          accessibilityRole="link"
        >
          <View style={styles.iconWrapper}>
            <Image
              source={require("@/assets/images/github.svg")}
              style={{ width: 22, height: 22 }}
              tintColor="#FFF"
            />
          </View>

          <Text style={styles.linkText}>View on GitHub</Text>
        </TouchableOpacity>

        {/* SHARE */}
        <TouchableOpacity
          style={styles.linkItem}
          onPress={onShare}
          accessibilityRole="link"
        >
          <View style={styles.iconWrapper}>
            <MaterialDesignIcons name="share-variant" size={22} color="#FFF" />
          </View>

          <Text style={styles.linkText}>Tap to share app</Text>
        </TouchableOpacity>

        {/* PIXABAY */}
        <TouchableOpacity
          style={styles.linkItem}
          onPress={handlePixabayURL}
          accessibilityRole="link"
        >
          <View style={styles.iconWrapper}>
            <MaterialDesignIcons
              name="music-box-multiple-outline"
              size={22}
              color="#FFF"
            />
          </View>

          <Text style={styles.linkText}>Sounds from Pixabay</Text>
        </TouchableOpacity>

        {/* ABOUT */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity style={styles.linkItem} onPress={toggleAbout}>
            <View style={styles.iconWrapper}>
              <MaterialDesignIcons
                name="information-outline"
                size={22}
                color="#FFF"
              />
            </View>

            <Text style={styles.linkText}>About XTodo</Text>

            <Animated.View style={animatedChevronStyle}>
              <MaterialDesignIcons name="chevron-down" color="#FFF" size={18} />
            </Animated.View>
          </TouchableOpacity>

          <View style={styles.measureContent} onLayout={handleAboutLayout}>
            <View style={styles.aboutContent}>
              <Text style={styles.aboutText}>
                XTodo is a powerful task & note manager designed to keep you
                organized. Rank tasks by priority and take notes with peace of
                mind, everything is fully secured with strong encryption.
              </Text>

              <View style={styles.developerContainer}>
                <Image
                  source={require("@/assets/images/dev.webp")}
                  style={{
                    width: 100,
                    height: 15,
                    marginRight: 10,
                  }}
                  contentFit="contain"
                />

                <Text style={styles.developerName}>Fatali Fataliyev</Text>
              </View>
            </View>
          </View>

          <Animated.View
            style={[styles.aboutAnimatedContainer, animatedContentStyle]}
          >
            <View style={styles.aboutContent}>
              <Text style={styles.aboutText}>
                XTodo is a powerful task & note manager designed to keep you
                organized. Rank tasks by priority and take notes with peace of
                mind, everything is fully secured with strong encryption.
              </Text>

              <View style={styles.developerContainer}>
                <Image
                  source={require("@/assets/images/dev.webp")}
                  style={{
                    width: 100,
                    height: 15,
                    marginRight: 10,
                  }}
                  contentFit="contain"
                />

                <Text style={styles.developerName}>Fatali Fataliyev</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </View>

      <Text style={styles.thankText}>Thank you for using XTodo 🤍</Text>
      <Text style={styles.versionText}>v{appVersion}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  quickLinksContainer: {
    borderWidth: 0.3,
    borderColor: "#CCC",
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  logo: {
    width: 80,
    height: 40,
  },
  header: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  thankText: {
    color: "#FFF",
    fontFamily: "Inter-Regular",
    textAlign: "center",
    marginBottom: 4,
    fontSize: 13,
  },
  versionText: {
    color: "#CCC",
    fontFamily: "Inter-SemiBold",
    textAlign: "center",
    fontSize: 9,
  },
  accordionContainer: {
    width: "100%",
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  iconWrapper: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  linkText: {
    color: "#CCC",
    fontFamily: "Inter-Regular",
    fontSize: 15,
    marginLeft: 15,
    flex: 1,
  },
  measureContent: {
    position: "absolute",
    left: 0,
    right: 0,
    opacity: 0,
    zIndex: -1,
  },
  aboutAnimatedContainer: {
    overflow: "hidden",
  },
  aboutContent: {
    paddingLeft: 45,
    paddingRight: 10,
  },
  aboutText: {
    color: "#AAA",
    fontFamily: "Inter-Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  developerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    opacity: 0.8,
  },
  developerName: {
    color: "#FFF",
    fontFamily: "Inter-SemiBold",
  },
});
