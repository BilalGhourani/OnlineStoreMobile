import { useTheme } from "@/theme/ThemeProvider";
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
    const { theme } = useTheme();

    const navigateToAddressManagement = () => {
        router.push("/screens/addresses");
    };

    return (
        <View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.card }]}>
            <View style={styles.addressHeader}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Delivery Address</Text>
                <Pressable
                    onPress={navigateToAddressManagement}
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                    <Text style={[styles.manageAddressesText, { color: theme.primary }]}>manage addresses</Text>
                </Pressable>
            </View>

            <Pressable
                style={[styles.dropdownButton, { borderColor: theme.menuBorder, backgroundColor: theme.card }]}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <Text style={[styles.dropdownButtonText, { color: theme.text }]}>
                    {selectedAddress
                        ? `${selectedAddress.da_contact} - ${selectedAddress.da_address}, ${selectedAddress.da_city}`
                        : "Select a Delivery Address"}
                </Text>
                <Ionicons
                    name={isDropdownOpen ? "chevron-up-outline" : "chevron-down-outline"}
                    size={20}
                    color={theme.iconTint}
                />
            </Pressable>

            {isDropdownOpen && (
                <View style={[styles.dropdownList, { backgroundColor: theme.card, borderColor: theme.menuBorder }]}>
                    {userAddresses.length === 0 ? (
                        <Text style={[styles.dropdownEmptyText, { color: theme.text }]}>
                            No addresses found. Add one in 'Manage Addresses'.
                        </Text>
                    ) : (
                        userAddresses.map((address) => (
                            <Pressable
                                key={address.da_id}
                                style={[styles.dropdownItem, { borderBottomColor: theme.menuBorder }]}
                                onPress={() => {
                                    onSelectAddress(address);
                                    setIsDropdownOpen(false);
                                }}
                            >
                                <Text style={{ color: theme.text }}>
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
    cardTitle: { fontSize: 18, fontWeight: "bold" },
    manageAddressesText: { fontSize: 14, alignSelf: "center" },
    dropdownButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: "#f9f9f9",
    },
    dropdownButtonText: { fontSize: 16 },
    dropdownList: {
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 5,
        maxHeight: 150,
    },
    dropdownItem: { paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 0.5 },
    dropdownEmptyText: { paddingVertical: 12, paddingHorizontal: 15, textAlign: "center" },
});
