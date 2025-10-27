import { useTheme } from "@/theme/ThemeProvider";
import { ShippingMethod } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAppSelector } from "../../store/hooks";


interface Props {
    selectedShippingMethod: ShippingMethod | null;
    setSelectedShippingMethod: (method: ShippingMethod) => void;
}

export default function ShippingMethodSelector({
    selectedShippingMethod,
    setSelectedShippingMethod,
}: Props) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const shippingMethods = useAppSelector(
        (state) => state.payment.shippingMethods
    );
    const { theme } = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Shipping method</Text>

            <Pressable
                style={[styles.dropdownButton, { borderColor: theme.menuBorder, backgroundColor: theme.card }]}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <Text style={[styles.dropdownButtonText, { color: theme.text }]}>
                    {selectedShippingMethod ? selectedShippingMethod.hsh_name : "Select a Shipping method"}
                </Text>
                <Ionicons
                    name={isDropdownOpen ? "chevron-up-outline" : "chevron-down-outline"}
                    size={20}
                    color={theme.iconTint}
                />
            </Pressable>

            {isDropdownOpen && (
                <View style={[styles.dropdownList, { backgroundColor: theme.card, borderColor: theme.menuBorder }]}>
                    {shippingMethods.map((method) => (
                        <Pressable
                            key={method.hsh_id}
                            style={[styles.dropdownItem, { borderBottomColor: theme.menuBorder }]}
                            onPress={() => {
                                setSelectedShippingMethod(method);
                                setIsDropdownOpen(false);
                            }}
                        >
                            <Text style={{ color: theme.text }}>{method.hsh_name}</Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
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
        borderColor: "#ddd",
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
