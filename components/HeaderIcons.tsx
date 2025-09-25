import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signOut } from "@/store/slices/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type HeaderIconsProps = {
    showCart?: boolean;
    showAuth?: boolean;
};

export default function HeaderIcons({
    showCart = true,
    showAuth = true,
}: HeaderIconsProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const cartItemCount = useAppSelector(
        (state) => state.cart.cartItems.length
    );
    const isLoggedIn = useAppSelector((state) => !!state.auth.userProfile);

    const handleCartPress = () => {
        router.push("/screens/cart");
    };

    const handleAuthPress = () => {
        if (isLoggedIn) {
            dispatch(signOut());
        } else {
            router.push("/screens/login");
        }
    };

    return (
        <View style={styles.container}>
            {showCart && (
                <Pressable onPress={handleCartPress} style={styles.iconButton}>
                    <Ionicons name="cart-outline" size={26} color="#333" />
                    {cartItemCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{cartItemCount}</Text>
                        </View>
                    )}
                </Pressable>
            )}

            {showAuth && (
                <Pressable onPress={handleAuthPress} style={styles.iconButton}>
                    <Ionicons
                        name={isLoggedIn ? "log-out-outline" : "person-outline"}
                        size={26}
                        color="#333"
                    />
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginRight: 10,
    },
    iconButton: {
        marginLeft: 20,
        position: "relative",
    },
    badge: {
        position: "absolute",
        top: -5,
        right: -10,
        backgroundColor: "red",
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 1,
        minWidth: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
});
