import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Constants from "expo-constants";
import { useState } from "react";
import {
  Image,
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import Divider from "./divider";

const logo = require("../../../assets/images/xtodo_clear.png");

export default function Footer() {
  const appVersion = Constants.expoConfig?.version || "1.0.0";
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

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
      const result = await Share.share({
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
    setIsAboutExpanded(!isAboutExpanded);
  };

  return (
    <View style={styles.container}>
      <Divider text="ABOUT" />

      <Animated.View
        layout={LinearTransition}
        style={styles.quickLinksContainer}
      >
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} />
        </View>

        {/* GIT */}
        <TouchableOpacity
          style={styles.linkItem}
          onPress={handleGitRepoURL}
          accessibilityRole="link"
        >
          <View style={styles.iconWrapper}>
            <FontAwesome name="github" size={24} color="#FFF" />
          </View>
          <Text style={styles.linkText}>View on GitHub</Text>
        </TouchableOpacity>

        {/*SHARE*/}
        <TouchableOpacity
          style={styles.linkItem}
          onPress={onShare}
          accessibilityRole="link"
        >
          <View style={styles.iconWrapper}>
            <FontAwesome name="share-alt" size={24} color="#FFF" />
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
            <MaterialIcons name="library-music" size={24} color="#FFF" />
          </View>
          <Text style={styles.linkText}>Sounds from Pixabay</Text>
        </TouchableOpacity>

        {/* ABOUT ACCORDION */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity style={styles.linkItem} onPress={toggleAbout}>
            <View style={styles.iconWrapper}>
              <FontAwesome name="question-circle" size={24} color="#FFF" />
            </View>
            <Text style={styles.linkText}>About XTodo</Text>
            <FontAwesome
              name={isAboutExpanded ? "chevron-up" : "chevron-down"}
              size={14}
              color="#CCC"
              style={styles.chevron}
            />
          </TouchableOpacity>

          {isAboutExpanded && (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(150)}
              style={styles.aboutContent}
            >
              <Text style={styles.aboutText}>
                XTodo is a powerful task manager designed to keep you organized.
                Rank tasks by priority and take notes with peace of mind,
                everything is fully secured with strong encryption.
              </Text>

              <View style={styles.developerContainer}>
                <FontAwesome
                  name="code"
                  size={14}
                  color="#888"
                  style={styles.developerIcon}
                />
                <Text style={styles.developerText}>
                  Developer:{" "}
                  <Text style={styles.developerName}>Fatali Fataliyev</Text>
                </Text>
              </View>
            </Animated.View>
          )}
        </View>
      </Animated.View>

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
    resizeMode: "contain",
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
    color: "#E9EDEF",
    fontFamily: "Inter-Bold",
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
  chevron: {
    marginLeft: "auto",
  },
  aboutContent: {
    paddingLeft: 45,
    paddingRight: 10,
    paddingBottom: 12,
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
  developerIcon: {
    marginRight: 8,
  },
  developerText: {
    color: "#AAA",
    fontFamily: "Inter-Regular",
    fontSize: 13,
  },
  developerName: {
    color: "#FFF",
    fontFamily: "Inter-Medium",
  },
});
