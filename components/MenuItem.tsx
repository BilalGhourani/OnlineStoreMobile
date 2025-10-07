import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider"; // adjust path if needed

type MenuItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    color?: string;
    showSeparator?: boolean;
};

export default function MenuItem({
    icon,
    label,
    onPress,
    color,
    showSeparator = true,
}: MenuItemProps) {
    const { theme } = useTheme();
    const textColor = color || theme.text;

    return (
        <Pressable
            style={[
                styles.menuItem,
                { borderBottomWidth: showSeparator ? 1 : 0, borderBottomColor: theme.menuBorder },
            ]}
            onPress={onPress}
        >
            <View style={styles.menuRow}>
                <Ionicons name={icon} size={22} color={textColor} style={styles.menuIcon} />
                <Text style={[styles.menuLabel, { color: textColor }]}>{label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={textColor} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    menuItem: {
        height: 70,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    menuRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    menuIcon: {
        marginRight: 15,
    },
    menuLabel: {
        fontSize: 16,
        color: "#333",
    },
});
