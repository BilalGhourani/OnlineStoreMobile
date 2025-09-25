import React from "react";
import { Modal, StyleSheet, Pressable, Text, View } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer"; // Import ImageViewer
import { Ionicons } from "@expo/vector-icons"; // For the close icon

interface ImageViewerModalProps {
  isVisible: boolean;
  imageUrls: { url: string }[]; // Array of objects with 'url' property as required by ImageViewer
  initialIndex?: number;
  onClose: () => void;
}

const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  isVisible,
  imageUrls,
  initialIndex = 0,
  onClose,
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      backdropColor={"#fff"}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.fullScreenOverlay}>
        <ImageViewer
          imageUrls={imageUrls}
          index={initialIndex}
          enableSwipeDown={true} // Allows swiping down to close the modal
          onSwipeDown={onClose} // Callback when swiped down
          enablePreload={true} // Preload surrounding images
          saveToLocalByLongPress={false} // Disable saving image on long press
          enableImageZoom={true}
          renderHeader={() => (
            <View style={styles.header}>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close-circle" size={30} color="white" />
              </Pressable>
            </View>
          )}
          // Custom footer if needed (e.g., image counter)
          renderFooter={(currentIndex) => (
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {currentIndex + 1} / {imageUrls.length}
              </Text>
            </View>
          )}
          // Style for the container around the image viewer
          style={styles.imageViewer}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black", // Match ImageViewer background for seamless transition
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 15,
    zIndex: 1, // Ensure header is above images
  },
  closeButton: {
    padding: 5,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensure footer is above images
  },
  footerText: {
    color: "white",
    fontSize: 16,
  },
  imageViewer: {
    backgroundColor: "black", // Background when no image is loaded or between images
  },
});

export default ImageViewerModal;
