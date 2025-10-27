// src/components/AddressCard.tsx

import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AddressModel } from "../types";

interface AddressCardProps {
  address: AddressModel;
  onEdit: (address: AddressModel) => void;
  onDelete: (addressId: string) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
}) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.card }]}>
      <View style={styles.header}>
        {/* Using da_contact as the primary display name for the address */}
        <Text style={[styles.name, { color: theme.text }]}>{address.da_contact || "Address"}</Text>
      </View>
      <Text style={[styles.addressLine, { color: theme.text }]}>{address.da_address}</Text>
      {address.da_street && (
        <Text style={[styles.addressLine, { color: theme.text }]}>Street: {address.da_street}</Text>
      )}
      {address.da_building && (
        <Text style={[styles.addressLine, { color: theme.text }]}>Building: {address.da_building}</Text>
      )}
      {address.da_floor && (
        <Text style={[styles.addressLine, { color: theme.text }]}>Floor: {address.da_floor}</Text>
      )}
      <Text style={[styles.addressLine, { color: theme.text }]}>{address.da_city}</Text>
      <Text style={[styles.addressLine, { color: theme.text }]}>Phone 1: {address.da_phone1}</Text>
      {address.da_phone2 && (
        <Text style={[styles.addressLine, { color: theme.text }]}>Phone 2: {address.da_phone2}</Text>
      )}
      {address.da_phone3 && (
        <Text style={[styles.addressLine, { color: theme.text }]}>Phone 3: {address.da_phone3}</Text>
      )}
      {address.da_map && (
        <Text style={[styles.addressLine, { color: theme.text }]}>Map: {address.da_map}</Text>
      )}

      <View style={[styles.actions, { borderTopColor: theme.menuBorder }]}>
        <Pressable onPress={() => onEdit(address)} style={styles.actionButton}>
          <Ionicons name="create-outline" size={20} color="#007bff" />
          <Text style={[styles.actionButtonText, { color: theme.text }]}>Edit</Text>
        </Pressable>
        <Pressable
          onPress={() => onDelete(address.da_id ?? "")}
          style={styles.actionButton}
        >
          <Ionicons name="trash-outline" size={20} color="#e74c3c" />
          <Text style={[styles.actionButtonText, { color: theme.text }]}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  defaultBadge: {
    backgroundColor: "#28a745",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  defaultBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  addressLine: {
    fontSize: 15,
    color: "#555",
    marginBottom: 3,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  actionButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#555",
  },
});

export default AddressCard;
