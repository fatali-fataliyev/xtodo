import {
  Alert,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ShareButton() {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "Hey! Check out this awesome app I'm using to stay productive: https://yourapplink.com",
        // url: 'https://yourapplink.com', // Optional, iOS only
        title: "Share App", // Optional, Android only
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with a specific activity type (iOS)
          console.log("Shared via: ", result.activityType);
        } else {
          // shared
          console.log("App shared successfully!");
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed (iOS only)
        console.log("Share dismissed");
      }
    } catch (error) {
      Alert.alert(`Error: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onShare}>
        <Text style={styles.buttonText}>Invite Friends</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
