import CapitalizeFirstLetter from "@/constants/firstLetterCapitalizer";
import { useTodoStore } from "@/store/useTodoStore";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import MaterialIcons from "@react-native-vector-icons/material-icons";
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
import { GetColorByLevel } from "../../constants/colors";
import { PriorityLevels } from "../../constants/priorityLevels";
type Props = {
  isVisible: boolean;
  setHasAnyFilter: (status: boolean) => void;
  onClose: () => void;
};

const FILTER_LEVELS = [...PriorityLevels, { level: "completed" }];

export default function TodoFilterModal({
  isVisible,
  setHasAnyFilter,
  onClose,
}: Props) {
  // ZUSTAND STATES
  const setFilteres = useTodoStore((state) => state.applyFilters);
  const setIsFilterMode = useTodoStore((state) => state.setIsFilterMode);

  // LOCAL STATES
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(isVisible);

  // REANIMATED SHARED VALUES
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  // ANIMATION SYNC
  useEffect(() => {
    setSelectedPriorities([]);

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

  const togglePriority = (priority: string) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority],
    );
  };

  const applyFilters = () => {
    if (selectedPriorities) {
      setHasAnyFilter(true);
    }
    onClose();

    setFilteres(selectedPriorities);
    setIsFilterMode(true);
  };

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="fade"
      onLayout={() => console.log("modal mounted!")}
    >
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <View style={styles.modalContainer} pointerEvents="box-none">
        <Animated.View
          style={[styles.modalCard, cardStyle]}
          pointerEvents="auto"
        >
          <View style={styles.modalCardHeader}>
            <Text style={styles.title}>Filter by Priority</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <MaterialIcons name={"close"} color={"#FFF"} size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.checkboxContainer}>
            {FILTER_LEVELS.map((priority) => {
              const isChecked = selectedPriorities.includes(priority.level);
              return (
                <TouchableOpacity
                  key={priority.level}
                  style={styles.checkboxRow}
                  onPress={() => togglePriority(priority.level)}
                  activeOpacity={0.7}
                >
                  {priority.level === "completed" ? (
                    <>
                      <MaterialDesignIcons
                        name={
                          isChecked
                            ? "checkbox-outline"
                            : "checkbox-blank-outline"
                        }
                        size={20}
                        color={isChecked ? "#454545" : "#FFF"}
                      />
                      <Text style={[styles.checkboxLabel, { color: "#FFF" }]}>
                        {CapitalizeFirstLetter(priority.level)}
                      </Text>
                    </>
                  ) : (
                    <>
                      <MaterialDesignIcons
                        name={
                          isChecked
                            ? "checkbox-outline"
                            : "checkbox-blank-outline"
                        }
                        size={20}
                        color={
                          isChecked ? GetColorByLevel(priority.level) : "#FFF"
                        }
                      />
                      <Text
                        style={[
                          styles.checkboxLabel,
                          { color: GetColorByLevel(priority.level) },
                        ]}
                      >
                        {CapitalizeFirstLetter(priority.level)}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[
              styles.filterApplyBtn,
              selectedPriorities.length === 0 && { backgroundColor: "gray" },
            ]}
            onPress={applyFilters}
            disabled={selectedPriorities.length === 0}
          >
            <Text style={styles.filterApplyBtnText}>Apply</Text>
          </TouchableOpacity>
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#303030",
    padding: 24,
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
  modalCardHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#FFF",
    fontFamily: "Inter-Regular",
    paddingLeft: 10,
  },
  checkboxContainer: {
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 12,
    fontFamily: "Inter-SemiBold",
  },
  closeBtn: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 35,
    marginBottom: 10,
  },
  filterApplyBtn: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  filterApplyBtnText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#121212",
  },
});
