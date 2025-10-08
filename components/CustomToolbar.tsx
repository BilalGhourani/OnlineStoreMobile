import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CustomToolbarProps = {
    title?: string;
    transparent?: boolean;
    showBack?: boolean;
    showCart?: boolean;
    titleAlign?: "left" | "center";
    cartBackground?: boolean; // new option
};

const CustomToolbar: React.FC<CustomToolbarProps> = ({
    title = "",
    transparent = false,
    showBack = false,
    showCart = false,
    titleAlign = "center",
    cartBackground = false,
}) => {
    const router = useRouter();
    const route = useRoute();
    const { theme } = useTheme();
    const cartItemCount = useAppSelector(
        (state) => state.cart.cartItems.length
    );
    const insets = useSafeAreaInsets();

    const toolbarTitle = route.params?.name ?? title;

    return (
        <View
            style={[
                styles.container,
                transparent ? styles.transparent : { backgroundColor: theme.toolbarBackground },
                { marginTop: insets.top, borderBottomColor: theme.border },
            ]}
        >
            {/* Left side: Back */}
            {showBack ? (
                <Pressable style={styles.iconButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.iconTint} />
                </Pressable>
            ) : (
                <View style={styles.spacer} />
            )}

            {/* Title */}
            <View
                style={[
                    styles.titleContainer,
                    titleAlign === "left" ? styles.titleLeft : styles.titleCenter,
                ]}
            >
                <Text style={[styles.title, { color: theme.text }]}>{toolbarTitle}</Text>
            </View>

            {/* Right side: Cart */}
            {showCart ? (
                <Pressable
                    style={[styles.iconButton, { marginRight: 10 }]}
                    onPress={() => router.push("/screens/cart")}
                >
                    <View style={cartBackground ? styles.iconBackground : undefined}>
                        <Ionicons name="cart-outline" size={24} color="#333" />
                    </View>
                    {cartItemCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{cartItemCount}</Text>
                        </View>
                    )}
                </Pressable>
            ) : (
                <View style={styles.spacer} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#ddd",
        elevation: 10,
    },
    transparent: {
        backgroundColor: "transparent",
        borderBottomWidth: 0,
        elevation: 0,
    },
    titleContainer: {
        flex: 1,
    },
    titleCenter: {
        alignItems: "center",
    },
    titleLeft: {
        alignItems: "flex-start",
        marginLeft: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    iconButton: {
        padding: 6,
        position: "relative",
    },
    iconBackground: {
        backgroundColor: "rgba(255, 252, 252, 0.61)",
        borderRadius: 20,
        padding: 6,
    },
    spacer: {
        width: 32,
    },
    badge: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "red",
        borderRadius: 10,
        paddingHorizontal: 4,
        minWidth: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    badgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "bold",
    },
});

export default CustomToolbar;
