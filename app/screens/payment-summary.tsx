import { useTheme } from "@/theme/ThemeProvider";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { checkout, sendEmail } from "../../services/paymentService";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearCart } from "../../store/slices/cartSlice";
import { showSnackbar } from "../../store/slices/snackbarSlice";

// Define the expected parameters from the navigation
interface PaymentSummaryParams {
  totalAmount: string;
  paymentMethod: string;
  deliveryAddress: string;
  basketHeader: string;
  checkoutModel: string;
}

export default function PaymentSummaryScreen() {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { totalAmount, paymentMethod, deliveryAddress, basketHeader, checkoutModel } =
    useLocalSearchParams<Partial<Record<keyof PaymentSummaryParams, string>>>();

  const addressDetails = deliveryAddress ? JSON.parse(deliveryAddress) : null;
  const inCheckoutModel = checkoutModel ? JSON.parse(checkoutModel) : null;
  const deliveryAddressString = addressDetails
    ? `${addressDetails.da_address}, ${addressDetails.da_street}, ${addressDetails.da_building}, ${addressDetails.da_floor}`
    : "Address not available";

  const phone1 = addressDetails?.da_phone1;
  const phone2 = addressDetails?.da_phone2;
  const phone3 = addressDetails?.da_phone3;

  const cartItems = useAppSelector((state) => state.cart.cartItems);

  const [isPaying, setIsPaying] = useState(false);

  const showSnackBarMsg = (message: string, isError: boolean = true) => {
    dispatch(showSnackbar({ message, isError }));
  };

  const payNow = async () => {
    if (isPaying) return; // Prevent double-taps
    if (!inCheckoutModel) {
      showSnackBarMsg("something went wrong.");
      return;
    }

    try {

      setIsPaying(true);
      const response = await checkout(inCheckoutModel);
      if (response.success == 1) {
        const emailModel = {
          cart: cartItems,
          checkoutForm: inCheckoutModel
        }
        await sendEmail(emailModel);
        dispatch(clearCart());
        setIsPaying(false);
        router.replace("/(tabs)/HomeTab");
      } else {
        setIsPaying(false);
        showSnackBarMsg(response.data.message ?? "Something went wrong,Please try again later");
      }
    } catch (error) {
      setIsPaying(false);
      showSnackBarMsg("Something went wrong,Please try again later.");
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 50 + insets.bottom }]}>
        <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Payment Summary</Text>
          <Text style={[styles.summaryText, { color: theme.text }]}>
            <Text style={styles.boldText}>Total Amount:</Text> {totalAmount} USD
          </Text>
          <Text style={[styles.summaryText, { color: theme.text }]}>
            <Text style={styles.boldText}>Payment Method:</Text> {paymentMethod}
          </Text>
          <Text style={[styles.summaryText, { color: theme.text }]}>
            <Text style={styles.boldText}>Phone:</Text>
          </Text>
          <Text style={[styles.summaryText, { color: theme.text }]}>
            <Text style={styles.boldText}>Delivery Address:</Text>
          </Text>
          <Text style={[styles.summaryText, { color: theme.text }]}>
            <Text style={styles.boldText}>City:</Text>
          </Text>
          <Text style={[styles.summaryText, { color: theme.text }]}>
            <Text style={styles.boldText}>Street:</Text>
          </Text>
          <Text style={[styles.summaryText, { color: theme.text }]}>
            <Text style={styles.boldText}>Floor:</Text>
          </Text>

          <Text style={[styles.summaryText, { color: theme.text }, styles.addressDetailHeading]}>
            Address details:
          </Text>
          <Text style={[styles.summaryText, { color: theme.text }]}>{addressDetails?.da_contact}</Text>
          <Text style={[styles.summaryText, { color: theme.text }]}>{addressDetails?.da_city}</Text>
          <Text style={[styles.summaryText, { color: theme.text }]}>
            <Text style={styles.boldText}>Phone 1:</Text> {phone1}
          </Text>
          {phone2 && (
            <Text style={[styles.summaryText, { color: theme.text }]}>
              <Text style={styles.boldText}>Phone 2:</Text> {phone2}
            </Text>
          )}
          {phone3 && (
            <Text style={[styles.summaryText, { color: theme.text }]}>
              <Text style={styles.boldText}>Phone 3:</Text> {phone3}
            </Text>
          )}
          <Text style={[styles.summaryText, { color: theme.text }]}>
            <Text style={styles.boldText}>Address:</Text> {deliveryAddressString}
          </Text>
        </View>
        {paymentMethod && paymentMethod.toLowerCase() == "wallet".toLowerCase() && (
          <Pressable style={[styles.payButton, { backgroundColor: theme.secondary, marginBottom: insets.bottom }]} onPress={() => payNow()}>
            <Text style={styles.payButtonText}>Pay Now {totalAmount}</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
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
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    margin: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  boldText: {
    fontWeight: "bold",
  },
  addressDetailHeading: {
    marginTop: 15,
    marginBottom: 5,
    textDecorationLine: "underline",
  },
  payButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#17a34a",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#17a34a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
