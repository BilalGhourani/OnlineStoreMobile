import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";

type ThemeOption = "system" | "light" | "dark";

type ThemeBottomSheetProps = {
    visible: boolean;
    selectedTheme: ThemeOption;
    setSelectedTheme: (theme: ThemeOption) => void;
    onApply: () => void;
    onClose: () => void;
};

export default function ThemeBottomSheet({
    visible,
    selectedTheme,
    setSelectedTheme,
    onApply,
    onClose,
}: ThemeBottomSheetProps) {
    const { theme } = useTheme();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            />
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                    Select Theme
                </Text>

                {(["system", "light", "dark"] as ThemeOption[]).map((option) => (
                    <Pressable
                        key={option}
                        style={styles.modalOption}
                        onPress={() => setSelectedTheme(option)}
                    >
                        <Text
                            style={{
                                color: selectedTheme === option ? theme.primary : theme.text,
                                fontWeight: selectedTheme === option ? "700" : "400",
                                fontSize: 16,
                            }}
                        >
                            {option === "system"
                                ? "System Default"
                                : option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                        {selectedTheme === option && (
                            <Ionicons name="checkmark" size={20} color={theme.primary} />
                        )}
                    </Pressable>
                ))}

                <Pressable
                    style={[styles.applyButton, { backgroundColor: theme.primary }]}
                    onPress={onApply}
                >
                    <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                        Apply
                    </Text>
                </Pressable>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "#00000088",
    },
    modalContent: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderBottomStartRadius: 16,
        borderBottomEndRadius: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 15,
    },
    modalOption: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    applyButton: {
        marginTop: 20,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
});
