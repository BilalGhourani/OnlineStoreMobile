import { showSnackbar } from "@/store/slices/snackbarSlice";
import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loadCompanyId, signOut } from "../store/slices/authSlice";
import { clearCart } from "../store/slices/cartSlice";
import type { CompanyModel } from "../types/companyModel";

interface StoreCellProps {
    company: CompanyModel;
}

const StoreCell: React.FC<StoreCellProps> = ({ company }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { theme } = useTheme();

    const companyModel = useAppSelector((state) => state.company.companyModel);
    const cartItems = useAppSelector((state) => state.cart.cartItems);
    const isLoggedIn = useAppSelector((state) => state.auth.userProfile != null);

    const handlePress = () => {
        if (company.cmp_id == companyModel?.cmp_id) {
            dispatch(showSnackbar({ message: `You are already in "${company.cmp_name}.`, isError: undefined }));
            return
        }
        let message = `You are about to open "${company.cmp_name}".`;

        if (cartItems.length > 0 && isLoggedIn) {
            message += ` This will reset your current cart and log you out. Do you want to continue?`;
        } else if (cartItems.length > 0) {
            message += ` Your current cart will be reset. Do you want to continue?`;
        } else if (isLoggedIn) {
            message += ` You will be logged out. Do you want to continue?`;
        } else {
            message += ` Do you want to continue?`;
        }
        Alert.alert(
            "Open Store",
            message,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            dispatch(clearCart());
                            dispatch(signOut());
                            dispatch(loadCompanyId({ cmpId: company.cmp_id, save: true }));

                            router.replace("/(tabs)/HomeTab");
                        } catch (err) {
                            console.error(err);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };
    return (
        <TouchableOpacity style={[styles.card, { backgroundColor: theme.card }]} onPress={handlePress} activeOpacity={0.8}>
            <Image
                source={
                    company.cmp_logo
                        ? { uri: company.cmp_logo }
                        : require("../assets/images/store-placeholder.png")
                }
                style={styles.logo}
                resizeMode="cover"
            />

            <View style={{ flex: 1 }}>
                {/* Company Name */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                    <Ionicons name="business-outline" size={18} color={theme.iconTint} style={{ marginRight: 6 }} />
                    <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
                        {company.cmp_name}
                    </Text>
                </View>

                {/* Address */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                    <Ionicons name="location-outline" size={18} color={theme.iconTint} style={{ marginRight: 6 }} />
                    <Text numberOfLines={2} style={[styles.text, { color: theme.text, flex: 1 }]}>
                        {company.cmp_address || "-"}
                    </Text>
                </View>

                {/* Phone */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="call-outline" size={18} color={theme.iconTint} style={{ marginRight: 6 }} />
                    <Text style={[styles.text, { color: theme.text }]}>
                        {company.cmp_phone || "-"}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default StoreCell;

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 12,
        backgroundColor: "#eee",
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    text: {
        fontSize: 14,
    },
});
