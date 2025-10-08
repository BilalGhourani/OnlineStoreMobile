import { useTheme } from "@/theme/ThemeProvider";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { addAddress, fetchDeliveryAddresses } from "../../../services/paymentService";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setUserAddresses } from "../../../store/slices/addressSlice";
import { showSnackbar } from "../../../store/slices/snackbarSlice";
import { AddressModel } from "../../../types";

export default function AddressFormScreen() {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const existingAddress: AddressModel | undefined = params.address
    ? JSON.parse(params.address as string)
    : undefined;

  // Initialize states with new address model fields
  const [da_contact, setDa_contact] = useState(
    existingAddress?.da_contact || ""
  );
  const [da_phone1, setDa_phone1] = useState(existingAddress?.da_phone1 || "");
  const [da_phone2, setDa_phone2] = useState(existingAddress?.da_phone2 || "");
  const [da_phone3, setDa_phone3] = useState(existingAddress?.da_phone3 || "");
  const [da_address, setDa_address] = useState(
    existingAddress?.da_address || ""
  );
  const [da_city, setDa_city] = useState(existingAddress?.da_city || "");
  const [da_street, setDa_street] = useState(existingAddress?.da_street || "");
  const [da_building, setDa_building] = useState(
    existingAddress?.da_building || ""
  );
  const [da_floor, setDa_floor] = useState(existingAddress?.da_floor || "");
  const [da_map, setDa_map] = useState(existingAddress?.da_map || "");

  const [localError, setLocalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const userProfile = useAppSelector((state) => state.auth.userProfile);

  const showSnackBarMsg = (message: string) => {
    dispatch(showSnackbar({ message, isError: true }));
  };

  const validateForm = () => {
    if (!da_contact || !da_phone1 || !da_address || !da_city) {
      setLocalError(
        "Please fill in all required fields (Recipient Name, Phone 1, Address Line 1, City)."
      );
      showSnackBarMsg("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleSaveAddress = async () => {
    setLocalError(null);
    if (!validateForm()) {
      return;
    }

    if (!userProfile?.ireg_id) {
      showSnackBarMsg(
        "User not authenticated. Please log in to manage addresses."
      );
      return;
    }

    setIsSaving(true); // Start loading

    const addressData = {
      da_id: existingAddress?.da_id ?? null,
      da_ireg_id: userProfile?.ireg_id,
      da_contact,
      da_phone1,
      da_phone2: da_phone2 || undefined,
      da_phone3: da_phone3 || undefined,
      da_address,
      da_city,
      da_street: da_street || undefined,
      da_building: da_building || undefined,
      da_floor: da_floor || undefined,
      da_map: da_map || undefined,
    };

    try {
      let response = await addAddress(addressData);

      if (response.success == 1) {
        try {
          const listOfAddress = await fetchDeliveryAddresses(
            userProfile?.ireg_id
          );
          dispatch(setUserAddresses(listOfAddress));
        } catch (error) { }
        router.back();
      } else {
        showSnackBarMsg(
          `Failed to ${existingAddress ? "update" : "add"} address.`
        );
      }
    } catch (error) {
      console.error("Error saving address:", error);
      showSnackBarMsg(`Failed to save address: ${error.message}`);
    } finally {
      setIsSaving(false); // End loading
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 30 + insets.bottom }]}>
        <TextInput
          style={[styles.input, { borderColor: theme.menuBorder, backgroundColor: theme.card }]}
          placeholder="Recipient Name"
          placeholderTextColor={theme.placeHolder}
          value={da_contact}
          onChangeText={setDa_contact}
          editable={!isSaving}
        />
        <TextInput
          style={[styles.input, { borderColor: theme.menuBorder, backgroundColor: theme.card }]}
          placeholder="Phone Number 1"
          placeholderTextColor={theme.placeHolder}
          value={da_phone1}
          onChangeText={setDa_phone1}
          keyboardType="phone-pad"
          editable={!isSaving}
        />
        <TextInput
          style={[styles.input, { borderColor: theme.menuBorder, backgroundColor: theme.card }]}
          placeholder="Phone Number 2 (Optional)"
          placeholderTextColor={theme.placeHolder}
          value={da_phone2}
          onChangeText={setDa_phone2}
          keyboardType="phone-pad"
          editable={!isSaving}
        />
        <TextInput
          style={[styles.input, { borderColor: theme.menuBorder, backgroundColor: theme.card }]}
          placeholder="Phone Number 3 (Optional)"
          placeholderTextColor={theme.placeHolder}
          value={da_phone3}
          onChangeText={setDa_phone3}
          keyboardType="phone-pad"
          editable={!isSaving}
        />
        <TextInput
          style={[styles.input, { borderColor: theme.menuBorder, backgroundColor: theme.card }]}
          placeholder="Address Line 1"
          placeholderTextColor={theme.placeHolder}
          value={da_address}
          onChangeText={setDa_address}
          editable={!isSaving}
        />
        <TextInput
          style={[styles.input, { borderColor: theme.menuBorder, backgroundColor: theme.card }]}
          placeholder="City"
          placeholderTextColor={theme.placeHolder}
          value={da_city}
          onChangeText={setDa_city}
          editable={!isSaving}
        />
        <TextInput
          style={[styles.input, { borderColor: theme.menuBorder, backgroundColor: theme.card }]}
          placeholder="Street (Optional)"
          placeholderTextColor={theme.placeHolder}
          value={da_street}
          onChangeText={setDa_street}
          editable={!isSaving}
        />
        <TextInput
          style={[styles.input, { borderColor: theme.menuBorder, backgroundColor: theme.card }]}
          placeholder="Building (Optional)"
          placeholderTextColor={theme.placeHolder}
          value={da_building}
          onChangeText={setDa_building}
          editable={!isSaving}
        />
        <TextInput
          style={[styles.input, { borderColor: theme.menuBorder, backgroundColor: theme.card }]}
          placeholder="Floor (Optional)"
          placeholderTextColor={theme.placeHolder}
          value={da_floor}
          onChangeText={setDa_floor}
          editable={!isSaving}
        />
        <TextInput
          style={[styles.input, { borderColor: theme.menuBorder, backgroundColor: theme.card }]}
          placeholder="Map URL (Optional)"
          placeholderTextColor={theme.placeHolder}
          value={da_map}
          onChangeText={setDa_map}
          editable={!isSaving}
        />

        {localError && <Text style={[styles.errorText, { color: theme.redButton }]}>{localError}</Text>}

        <Pressable
          style={[styles.saveButton, { backgroundColor: theme.secondary }]}
          onPress={handleSaveAddress}
          disabled={isSaving || !userProfile?.ireg_id} // Disable if saving or not authenticated
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>
              {existingAddress ? "Update Address" : "Add Address"}
            </Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.back()} style={styles.cancelButton}>
          <Text style={[styles.cancelButtonText, { color: theme.primary }]}>Cancel</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    maxWidth: 400,
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    width: "100%",
    maxWidth: 400,
    height: 50,
    backgroundColor: "#28a745",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    width: "100%",
    maxWidth: 400,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#007bff",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
    fontSize: 14,
    width: "100%",
    maxWidth: 400,
  },
});
