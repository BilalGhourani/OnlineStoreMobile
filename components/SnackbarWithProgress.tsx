import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

interface SnackbarWithProgressProps {
  message: string;
  duration?: number;
  progressColor: string;
  onClose?: () => void;
}

const SnackbarWithProgress: React.FC<SnackbarWithProgressProps> = ({
  message,
  duration = 3000,
  progressColor,
  onClose,
}) => {
  const progress = useRef(new Animated.Value(1)).current;
  const [visible, setVisible] = useState(true);

  // Animate progress from 1 to 0 over duration
  useEffect(() => {
    Animated.timing(progress, {
      toValue: 0,
      duration,
      useNativeDriver: false,
    }).start(() => {
      setVisible(false);
      onClose?.();
    });
  }, []);

  // Handler for manual close
  const handleClose = () => {
    progress.stopAnimation();
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.snackbar}>
      <Text style={styles.message}>{message}</Text>
      <Pressable onPress={handleClose} style={styles.closeButton}>
        <Text style={styles.closeText}>×</Text>
      </Pressable>
      <Animated.View
        style={[
          styles.progress,
          { width: progressWidth, backgroundColor: progressColor },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#333",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 6,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
  },
  message: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  closeButton: {
    marginLeft: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  closeText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 22,
  },
  progress: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 4,
    borderRadius: 2,
  },
});

export default SnackbarWithProgress;
