import CapitalizeFirstLetter from "@/constants/firstLetterCapitalizer";
import { useTodoStore } from "@/store/useTodoStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { GetColorByLevel } from "../constants/colors";
import { PriorityLevels } from "../constants/priorityLevels";

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const FILTER_LEVELS = [...PriorityLevels, { level: "completed" }];

export default function TodoFilterModal({ isVisible, onClose }: Props) {
  // ZUSTAND STATES
  const setFilteres = useTodoStore((state) => state.applyFilters);
  const setIsFilterMode = useTodoStore((state) => state.setIsFilterMode);
  const clearFilterResults = useTodoStore((state) => state.clearFilterResults);

  // LOCAL STATES
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  

  const togglePriority = (priority: string) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority],
    );
  };

  const applyFilters = () => {
    setFilteres(selectedPriorities);
    setIsFilterMode(true);
    onClose();
  };

  const clearAndClose = () => {
    setSelectedPriorities([]);
    setIsFilterMode(false);
    clearFilterResults();
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={clearAndClose}
      animationIn="zoomIn"
      animationOut="zoomOut"
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
    >
      <View style={styles.modalCard}>
        <View style={styles.modalCardHeader}>
          <Text style={styles.title}>Filter by Priority</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={clearAndClose}>
            <Ionicons name="close-circle-sharp" size={25} color="#FFF" />
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
                    <Ionicons
                      name={isChecked ? "checkbox" : "square-outline"}
                      size={24}
                      color={isChecked ? "#454545" : "#FFF"}
                    />
                    <Text style={[styles.checkboxLabel, { color: "#FFF" }]}>
                      {CapitalizeFirstLetter(priority.level)}
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons
                      name={isChecked ? "checkbox" : "square-outline"}
                      size={24}
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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalCard: {
    backgroundColor: "#303030",
    padding: 24,
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
    fontFamily: "Inter-Bold",
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
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#121212",
  },
});
