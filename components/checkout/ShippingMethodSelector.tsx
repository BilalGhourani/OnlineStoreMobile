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

    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Shipping method</Text>

            <Pressable
                style={styles.dropdownButton}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <Text style={styles.dropdownButtonText}>
                    {selectedShippingMethod ? selectedShippingMethod.hsh_name : "Select a Shipping method"}
                </Text>
                <Ionicons
                    name={isDropdownOpen ? "chevron-up-outline" : "chevron-down-outline"}
                    size={20}
                    color="#555"
                />
            </Pressable>

            {isDropdownOpen && (
                <View style={styles.dropdownList}>
                    {shippingMethods.map((method) => (
                        <Pressable
                            key={method.hsh_id}
                            style={styles.dropdownItem}
                            onPress={() => {
                                setSelectedShippingMethod(method);
                                setIsDropdownOpen(false);
                            }}
                        >
                            <Text>{method.hsh_name}</Text>
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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#333" },
    dropdownButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: "#f9f9f9",
    },
    dropdownButtonText: { fontSize: 16, color: "#555" },
    dropdownList: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginTop: 5,
        backgroundColor: "#fff",
        maxHeight: 150,
    },
    dropdownItem: { paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 0.5, borderBottomColor: "#eee" },
});
