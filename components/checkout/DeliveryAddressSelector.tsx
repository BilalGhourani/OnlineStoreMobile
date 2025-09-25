import { AddressModel } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAppSelector } from "../../store/hooks";


interface Props {
    selectedAddress: AddressModel | null;
    onSelectAddress: (address: AddressModel) => void;
}

export default function DeliveryAddressSelector({
    selectedAddress,
    onSelectAddress
}: Props) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const userAddresses = useAppSelector((state) => state.address.userAddresses);

    const navigateToAddressManagement = () => {
        router.push("/screens/addresses");
    };

    return (
        <View style={styles.card}>
            <View style={styles.addressHeader}>
                <Text style={styles.cardTitle}>Delivery Address</Text>
                <Pressable
                    onPress={navigateToAddressManagement}
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                    <Text style={styles.manageAddressesText}>manage addresses</Text>
                </Pressable>
            </View>

            <Pressable
                style={styles.dropdownButton}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <Text style={styles.dropdownButtonText}>
                    {selectedAddress
                        ? `${selectedAddress.da_contact} - ${selectedAddress.da_address}, ${selectedAddress.da_city}`
                        : "Select a Delivery Address"}
                </Text>
                <Ionicons
                    name={isDropdownOpen ? "chevron-up-outline" : "chevron-down-outline"}
                    size={20}
                    color="#555"
                />
            </Pressable>

            {isDropdownOpen && (
                <View style={styles.dropdownList}>
                    {userAddresses.length === 0 ? (
                        <Text style={styles.dropdownEmptyText}>
                            No addresses found. Add one in 'Manage Addresses'.
                        </Text>
                    ) : (
                        userAddresses.map((address) => (
                            <Pressable
                                key={address.da_id}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    onSelectAddress(address);
                                    setIsDropdownOpen(false);
                                }}
                            >
                                <Text>
                                    {address.da_contact} - {address.da_address}, {address.da_city}
                                </Text>
                            </Pressable>
                        ))
                    )}
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
    addressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    cardTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
    manageAddressesText: { color: "#007bff", fontSize: 14, alignSelf: "center" },
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
    dropdownEmptyText: { paddingVertical: 12, paddingHorizontal: 15, textAlign: "center", color: "#777" },
});
