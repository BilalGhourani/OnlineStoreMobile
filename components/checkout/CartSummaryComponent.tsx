// components/checkout/CartSummary.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useAppDispatch } from "../../store/hooks";
import { removeFromCart, updateCartItemQuantity } from "../../store/slices/cartSlice";
import { CartItem } from "../../types";

interface Props {
    cartItems: CartItem[];
    totalPrice: number;
    onApplyVoucher: (code: string) => Promise<void>;
    isApplyingVoucher: boolean;
}

export default function CartSummaryComponent({
    cartItems,
    totalPrice,
    onApplyVoucher,
    isApplyingVoucher,
}: Props) {
    const dispatch = useAppDispatch();
    const [voucherCode, setVoucherCode] = useState("");

    const renderCartItem = (item: CartItem) => (
        <View key={item.ioi_id} style={styles.cartItem}>
            <Image source={{ uri: item.ioi_photo1 ?? "" }} style={styles.cartItemImage} />
            <View style={styles.cartItemDetails}>
                <Text style={styles.cartItemName} numberOfLines={2}>
                    {item.ioi_name}
                </Text>
                <View style={styles.quantityControl}>
                    <Pressable
                        style={styles.quantityButton}
                        onPress={() =>
                            dispatch(updateCartItemQuantity({ productId: item.ioi_id, amount: item.amount - 1 }))
                        }
                    >
                        <Text style={styles.quantityButtonText}>-</Text>
                    </Pressable>
                    <Text style={styles.quantityText}>{item.amount}</Text>
                    <Pressable
                        style={styles.quantityButton}
                        onPress={() =>
                            dispatch(updateCartItemQuantity({ productId: item.ioi_id, amount: item.amount + 1 }))
                        }
                    >
                        <Text style={styles.quantityButtonText}>+</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.cartItemPriceRemove}>
                <Text style={styles.cartItemTotalPrice}>
                    ${(item.ioi_unitprice * (1 - (item.ioi_disc ?? 0) / 100) * item.amount).toFixed(2)}
                </Text>
                <Pressable onPress={() => dispatch(removeFromCart(item.ioi_id))}>
                    <Ionicons name="close-circle-outline" size={24} color="#e74c3c" />
                </Pressable>
            </View>
        </View>
    );

    return (
        <View style={styles.card}>
            {/* Voucher Input */}
            <View style={styles.voucherContainer}>
                <TextInput
                    style={styles.voucherInput}
                    placeholder="Enter voucher code"
                    placeholderTextColor="#999"
                    value={voucherCode}
                    onChangeText={setVoucherCode}
                    autoCapitalize="none"
                />
                <Pressable
                    style={[styles.applyVoucherButton, isApplyingVoucher && styles.buttonDisabled]}
                    onPress={() => onApplyVoucher(voucherCode)}
                    disabled={isApplyingVoucher}
                >
                    {isApplyingVoucher ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.applyVoucherButtonText}>Apply</Text>
                    )}
                </Pressable>
            </View>

            {/* Cart Items */}
            {cartItems.length === 0 ? (
                <Text style={styles.emptyCartText}>Your cart is empty.</Text>
            ) : (
                <View style={styles.cartItemsList}>
                    {cartItems.map(renderCartItem)}
                </View>
            )}

            {/* Total */}
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    voucherContainer: {
        flexDirection: "row",
        marginBottom: 15,
    },
    voucherInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 15,
        height: 45,
        fontSize: 16,
        marginRight: 10,
    },
    applyVoucherButton: {
        backgroundColor: "#007bff",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    applyVoucherButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    buttonDisabled: { opacity: 0.6 },
    emptyCartText: { textAlign: "center", fontSize: 16, color: "#777", paddingVertical: 20 },
    cartItemsList: { borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 10, marginBottom: 10 },
    cartItem: { flexDirection: "row", alignItems: "center", marginBottom: 15, paddingRight: 10 },
    cartItemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
    cartItemDetails: { flex: 1 },
    cartItemName: { fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 5 },
    quantityControl: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        width: 100,
        justifyContent: "space-between",
    },
    quantityButton: { paddingHorizontal: 10, paddingVertical: 5 },
    quantityButtonText: { fontSize: 18, fontWeight: "bold", color: "#007bff" },
    quantityText: { fontSize: 16, color: "#333" },
    cartItemPriceRemove: { alignItems: "flex-end", marginLeft: 10 },
    cartItemTotalPrice: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 5 },
    totalContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 10 },
    totalText: { fontSize: 20, fontWeight: "bold", color: "#333" },
    totalPrice: { fontSize: 20, fontWeight: "bold", color: "#007bff" },
});
