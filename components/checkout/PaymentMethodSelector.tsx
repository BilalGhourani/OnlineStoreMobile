import { useTheme } from "@/theme/ThemeProvider";
import { PaymentMethod } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAppSelector } from "../../store/hooks";

interface Props {
    selectedPaymentMethod: PaymentMethod | null;
    setSelectedPaymentMethod: (method: PaymentMethod) => void;
}

export default function PaymentMethodSelector({
    selectedPaymentMethod,
    setSelectedPaymentMethod,
}: Props) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const paymentMethods = useAppSelector((state) => state.payment.paymentMethods);
    const { theme } = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Payment</Text>

            <Pressable
                style={[styles.dropdownButton, { borderColor: theme.menuBorder, backgroundColor: theme.card }]}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <Text style={[styles.dropdownButtonText, { color: theme.text }]}>
                    {selectedPaymentMethod ? selectedPaymentMethod.icp_paymentmodename : "Select a Payment method"}
                </Text>
                <Ionicons
                    name={isDropdownOpen ? "chevron-up-outline" : "chevron-down-outline"}
                    size={20}
                    color={theme.iconTint}
                />
            </Pressable>

            {isDropdownOpen && (
                <View style={[styles.dropdownList, { backgroundColor: theme.card, borderColor: theme.menuBorder }]}>
                    {paymentMethods.map((method) => (
                        <Pressable
                            key={method.icp_id}
                            style={[styles.dropdownItem, { borderBottomColor: theme.menuBorder }]}
                            onPress={() => {
                                if (selectedPaymentMethod != method) {
                                    setSelectedPaymentMethod(method);
                                }
                                setIsDropdownOpen(false);
                            }}
                        >
                            <Text style={{ color: theme.text }}>{method.icp_paymentmodename}</Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    dropdownButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    dropdownButtonText: { fontSize: 16 },
    dropdownList: {
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 5,
        maxHeight: 150,
    },
    dropdownItem: { paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 0.5 },
});
