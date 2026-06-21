import { Button, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

export default function TodoFilterModal({ isVisible, onClose }: Props) {
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
        <Text style={styles.title}>Filter Todos</Text>
        <Text style={styles.message}>Select your filters here.</Text>
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
});
