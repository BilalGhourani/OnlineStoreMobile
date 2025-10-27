import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddressCard from "../../../components/AddressCard";
import MessageBox from "../../../components/MessageBox";
import {
  deleteAddress,
  fetchDeliveryAddresses,
} from "../../../services/paymentService";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setUserAddresses } from "../../../store/slices/addressSlice";
import { showSnackbar } from "../../../store/slices/snackbarSlice";
import { AddressModel } from "../../../types";

export default function AddressesScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const userAddresses = useAppSelector((state) => state.address.userAddresses);

  const [isAddressesLoaded, setisAddressesLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // New state for delete/set default loading
  const [messageBoxVisible, setMessageBoxVisible] = useState(false);
  const [messageBoxTitle, setMessageBoxTitle] = useState("");
  const [messageBoxMessage, setMessageBoxMessage] = useState("");
  const [messageBoxOnConfirm, setMessageBoxOnConfirm] = useState<
    (() => void) | null
  >(null);

  const showMessageBox = (
    title: string,
    message: string,
    onConfirm: (() => void) | null = null
  ) => {
    setMessageBoxTitle(title);
    setMessageBoxMessage(message);
    setMessageBoxOnConfirm(() => onConfirm); // Store callback
    setMessageBoxVisible(true);
  };

  const showSnackbarMsg = (message: string, isError: boolean = true) => {
    dispatch(showSnackbar({ message, isError }));
  };

  const hideMessageBox = () => {
    setMessageBoxVisible(false);
    setMessageBoxOnConfirm(null);
  };

  useEffect(() => {
    // Set default shipping/payment methods if available
    const loadAddresses = async (userId: string) => {
      setisAddressesLoaded(true);
      const listOfAddress = await fetchDeliveryAddresses(userId);
      dispatch(setUserAddresses(listOfAddress));
    };
    if (!isAddressesLoaded && userProfile?.ireg_id) {
      try {
        setIsProcessing(true);
        loadAddresses(userProfile?.ireg_id);
      } catch (error) {
      } finally {
        setIsProcessing(false);
      }
    }
  }, [userAddresses]);

  const handleMessageBoxConfirm = () => {
    if (messageBoxOnConfirm) {
      messageBoxOnConfirm();
    }
    hideMessageBox();
  };

  const handleEditAddress = (address: AddressModel) => {
    if (!userProfile?.ireg_id) {
      showSnackbarMsg(
        "Authentication Required. Please log in to edit addresses."
      );
      return;
    }
    router.push({
      pathname: "/screens/addresses/form",
      params: { address: JSON.stringify(address) },
    });
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (addressId == "") {
      return;
    }
    if (!userProfile?.ireg_id) {
      showSnackbarMsg(
        "Authentication Required. Please log in to delete addresses."
      );
      return;
    }

    showMessageBox(
      "Confirm Delete",
      "Are you sure you want to delete this address?",
      async () => {
        console.log(`This is the callback for "Yes"`);
        setIsProcessing(true);
        try {
          const response = await deleteAddress(addressId);
          if (response.success == 1) {
            const updatedList = userAddresses.filter(
              (addr) => !(addr.da_id === addressId)
            );
            dispatch(setUserAddresses(updatedList));
            showSnackbarMsg("Address deleted successfully!", false);
          } else {
            showSnackbarMsg("Failed to delete address.");
          }
        } catch (error) {
          console.error("Error deleting address:", error);
          showSnackbarMsg(`Failed to delete address`);
        } finally {
          setIsProcessing(false);
        }
      }
    );
  };

  if (isProcessing) {
    // Combine loading states
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading addresses...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.screenBackground }]}>
      <View style={styles.content}>
        {/* /addresses/form */}
        <Pressable
          style={[styles.addButton, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
          disabled={!userProfile?.ireg_id}
          onPress={() =>
            router.push({
              pathname: "/screens/addresses/form",
              params: { address: "" },
            })
          }
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add New Address</Text>
        </Pressable>
        {userAddresses.length === 0 ? (
          <Text style={[styles.noAddressesText, { color: theme.text }]}>
            No addresses found. Add one!
          </Text>
        ) : (
          <FlatList
            data={userAddresses}
            keyExtractor={(item) => item.da_id}
            renderItem={({ item }) => (
              <AddressCard
                address={item}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
              />
            )}
            contentContainerStyle={[
              styles.listContentContainer,
              { paddingBottom: insets.bottom }
            ]}
          />
        )}
      </View>

      {/* MessageBox component for confirmations and alerts */}
      <MessageBox
        isVisible={messageBoxVisible}
        title={messageBoxTitle}
        message={messageBoxMessage}
        buttonText={messageBoxOnConfirm ? "Delete" : "Ok"}
        onButtonClicked={
          messageBoxOnConfirm ? handleMessageBoxConfirm : hideMessageBox
        } // Pass confirm handler if available
        onClose={hideMessageBox}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginHorizontal: 20,
  },
  addButton: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  noAddressesText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 30,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
});
