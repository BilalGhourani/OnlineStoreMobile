import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Linking, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

type Props = {
    storeName?: string;
    address?: string;
    phone?: string;
    email?: string;
    web?: string;
    onPressStore?: () => void;
};

export default function CompanyMenuItem({
    storeName,
    address,
    phone,
    email,
    web,
    onPressStore,
}: Props) {
    const { theme } = useTheme();

    const openLink = (url: string) => {
        if (!url) return;
        try {
            const formattedUrl =
                url.startsWith("http") || url.startsWith("mailto") || url.startsWith("tel")
                    ? url
                    : `https://${url}`;
            Linking.openURL(formattedUrl);
        } catch {
            console.log("Failed to open:", url);
        }
    };

    return (
        <Pressable
            style={[styles.container, { borderBottomColor: theme.menuBorder }]}
            onPress={onPressStore}
        >
            {/* Left icon centered vertically */}
            <View style={styles.leadingIconContainer}>
                <Ionicons name="storefront-outline" size={22} color={theme.text} />
            </View>

            {/* Right content block */}
            <View style={styles.contentContainer}>
                {/* Store name + action icons */}
                <View style={styles.topRow}>
                    <Text style={[styles.storeName, { color: theme.text }]} numberOfLines={1}>
                        {storeName || "Store"}
                    </Text>

                    <View style={styles.iconRow}>
                        {!!phone && (
                            <TouchableOpacity onPress={() => openLink(`tel:${phone}`)}>
                                <Ionicons name="call-outline" size={22} color={theme.text} />
                            </TouchableOpacity>
                        )}
                        {!!email && (
                            <TouchableOpacity onPress={() => openLink(`mailto:${email}`)}>
                                <Ionicons name="mail-outline" size={22} color={theme.text} />
                            </TouchableOpacity>
                        )}
                        {!!phone && (
                            <TouchableOpacity onPress={() => openLink(`https://wa.me/${phone}`)}>
                                <Ionicons name="logo-whatsapp" size={22} color={theme.text} />
                            </TouchableOpacity>
                        )}
                        {!!web && (
                            <TouchableOpacity onPress={() => openLink(web)}>
                                <Ionicons name="globe-outline" size={22} color={theme.text} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Address below */}
                {!!address && (
                    <Text style={[styles.address, { color: theme.textSecondary }]} numberOfLines={2}>
                        {address}
                    </Text>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        alignItems: "center",
    },
    leadingIconContainer: {
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    contentContainer: {
        flex: 1,
        flexDirection: "column",
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    storeName: {
        fontSize: 16,
        fontWeight: "600",
        flexShrink: 1,
    },
    iconRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        flexShrink: 0,
    },
    address: {
        fontSize: 13,
        opacity: 0.7,
        marginTop: 4,
    },
});
