import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";

interface MessageBoxProps {
  isVisible: boolean;
  title: string;
  message: string;
  buttonText: string | "OK";
  onButtonClicked: () => void | null;
  onClose: () => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  isVisible,
  title,
  message,
  buttonText = "Ok",
  onButtonClicked,
  onClose,
}) => {
  if (!isVisible) {
    return null;
  }
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>{title}</Text>
          <Text style={styles.alertMessage}>{message}</Text>
          <Pressable
            onPress={onButtonClicked != null ? onButtonClicked : onClose}
            style={styles.alertButton}
          >
            <Text style={styles.alertButtonText}>{buttonText}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertBox: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  alertMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  alertButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  alertButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MessageBox;
