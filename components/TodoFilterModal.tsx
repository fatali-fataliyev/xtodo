import { PriorityLevels } from "@/assets/js/priorityLevels";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

export default function TodoFilterModal({ isVisible, onClose }: Props) {
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

  const togglePriority = (priority: string) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority],
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn="zoomIn"
      animationOut="zoomOut"
      useNativeDriver={true} // hardware accler..
      hideModalContentWhileAnimating={true} // Prevents a common flashing glitch
    >
      <View style={styles.modalCard}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Ionicons name="close-circle-sharp" size={25} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.title}>Filter by Priority</Text>

        {/* Custom Checkbox Group */}
        <View style={styles.checkboxContainer}>
          {PriorityLevels.map((priority) => {
            const isChecked = selectedPriorities.includes(priority.level);
            return (
              <TouchableOpacity
                key={priority.level}
                style={styles.checkboxRow}
                onPress={() => togglePriority(priority.level)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isChecked ? "checkbox" : "square-outline"}
                  size={24}
                  color={isChecked ? "#4CAF50" : "#FFF"} // Green when checked
                />
                <Text style={styles.checkboxLabel}>
                  {priority.level.toLocaleUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button title="Close" onPress={onClose} color="#FF3B30" />
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#FFF",
    fontFamily: "Inter-Regular",
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
    color: "#FFF",
    marginLeft: 12,
    fontFamily: "Inter-Regular",
  },
  closeBtn: {
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 35,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#c1c1c1",
    marginBottom: 10,
  },
});
