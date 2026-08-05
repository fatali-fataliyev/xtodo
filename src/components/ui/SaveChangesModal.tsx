import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
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
import { scheduleOnRN } from "react-native-worklets";

type Props = {
  isVisible: boolean;
  title: string;
  body: string;
  onDiscard: () => void;
  onCancel: () => void;
};

export default function SaveChangesModal({
  isVisible,
  title,
  body,
  onCancel,
  onDiscard,
}: Props) {
  const [showModal, setShowModal] = useState(isVisible);

  // REANIMATED SHARED VALUES
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  // ANIMATION SYNC
  useEffect(() => {
    if (isVisible) {
      setShowModal(true);
      opacity.value = withTiming(1, { duration: 150 });
      scale.value = withTiming(1, { duration: 150 });
    } else if (showModal) {
      opacity.value = withTiming(0, { duration: 100 });
      scale.value = withTiming(0.95, { duration: 100 }, (isFinished) => {
        if (isFinished) {
          scheduleOnRN(setShowModal, false);
        }
      });
    }
  }, [isVisible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal transparent visible={showModal} animationType="fade">
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} />
      </Animated.View>

      <View style={styles.modalContainer} pointerEvents="box-none">
        <Animated.View
          style={[styles.modalCard, cardStyle]}
          pointerEvents="auto"
        >
          <View style={styles.modalBody}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.body}>{body}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  onCancel();
                  setShowModal(false);
                }}
              >
                <Text style={[styles.buttonText, { color: "#10B981" }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { marginLeft: 15 }]}
                onPress={onDiscard}
              >
                <Text style={[styles.buttonText, { color: "#EE4B2B" }]}>
                  Discard
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  modalCard: {
    backgroundColor: "#303030",
    padding: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalBody: {
    width: "95%",
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
    color: "#FFF",
    fontFamily: "Inter-SemiBold",
    paddingLeft: 10,
  },
  body: {
    color: "#FFF",
    fontFamily: "Inter-SemiBold",
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingTop: 20,
    justifyContent: "flex-end",
  },
  button: {
    padding: 7,
  },
  buttonText: {
    color: "#FFF",
    fontFamily: "Inter-SemiBold",
  },
});
