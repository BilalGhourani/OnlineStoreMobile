import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text } from "react-native";

import CartSummary from "../../components/checkout/CartSummaryComponent";
import DeliveryAddressSelector from "../../components/checkout/DeliveryAddressSelector";
import PaymentMethodSelector from "../../components/checkout/PaymentMethodSelector";
import ShippingMethodSelector from "../../components/checkout/ShippingMethodSelector";

import { addBasket, checkVoucher, fetchDeliveryAddresses } from "../../services/paymentService";
import { AddressModel, PaymentMethod, ShippingMethod } from "../../types";
import { BasketBody } from "../../types/basketModel";

import { useTheme } from "@/theme/ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setUserAddresses } from "../../store/slices/addressSlice";
import { fetchPayments, fetchWallet } from "../../store/slices/paymentSlice";
import { showSnackbar } from "../../store/slices/snackbarSlice";

export default function CheckoutScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const companyModel = useAppSelector((state) => state.company.companyModel);
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const userAddresses = useAppSelector((state) => state.address.userAddresses);
  const shippingMethods = useAppSelector((state) => state.payment.shippingMethods);
  const paymentMethods = useAppSelector((state) => state.payment.paymentMethods);
  const wallet = useAppSelector((state) => state.payment.wallet);
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const totalCartPrice = useAppSelector((state) => state.cart.totalCartPrice);

  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<AddressModel | null>(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [isCheckingVoucher, setIsCheckingVoucher] = useState(false);

  const showSnackBarMsg = (message: string, isError: boolean = true) => {
    dispatch(showSnackbar({ message, isError }));
  };

  useEffect(() => {
    if (companyModel) dispatch(fetchPayments(companyModel.cmp_id));
  }, [companyModel]);

  useEffect(() => {
    if (cartItems.length === 0) router.back();
  }, [cartItems]);

  useEffect(() => {
    if (shippingMethods.length > 0 && !selectedShippingMethod) setSelectedShippingMethod(shippingMethods[0]);
    if (paymentMethods.length > 0 && !selectedPaymentMethod) setSelectedPaymentMethod(paymentMethods[0]);
  }, [shippingMethods, paymentMethods]);

  useEffect(() => {
    const loadAddresses = async () => {
      if (userProfile?.ireg_id) {
        const listOfAddress = await fetchDeliveryAddresses(userProfile.ireg_id);
        dispatch(setUserAddresses(listOfAddress));
        if (listOfAddress.length > 0 && !selectedAddress) setSelectedAddress(listOfAddress[0]);
      }
    };
    if (userAddresses.length === 0) loadAddresses();
  }, [userAddresses]);

  const handlePaymentMethodChange = async (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    if (userProfile?.ireg_id && method.icp_paymentmodename?.toLowerCase() == "wallet".toLowerCase()) {
      dispatch(fetchWallet(userProfile?.ireg_id));
    }
  }

  const handleApplyVoucher = async (code: string) => {
    if (isCheckingVoucher) return;
    if (code.trim() === "") {
      showSnackBarMsg("Please enter a voucher code.");
      return;
    }
    try {
      setIsCheckingVoucher(true);
      const response = await checkVoucher(companyModel?.cmp_id || "", code.trim(), userProfile?.ireg_id || "");
      setIsCheckingVoucher(false);
      if (response.success && response.data.result === 1) {
        dispatch(fetchWallet(userProfile?.ireg_id || ""));
        showSnackBarMsg("Your wallet has been updated!", false);
      } else {
        showSnackBarMsg("Voucher is invalid");
      }
    } catch (error) {
      setIsCheckingVoucher(false);
      showSnackBarMsg("Something went wrong, please try again.");
    }
  };

  const handleProceedToCheckout = async () => {
    if (isProcessingCheckout) return;
    if (!userProfile?.ireg_id) return showSnackBarMsg("Please log in.");
    if (cartItems.length === 0) return showSnackBarMsg("Cart is empty.");
    if (!selectedShippingMethod) return showSnackBarMsg("Select a shipping method.");
    if (!selectedPaymentMethod) return showSnackBarMsg("Select a payment method.");
    if (!selectedAddress) return showSnackBarMsg("Select a delivery address.");

    const walletAmount = wallet?.iwal_amt || 0;
    if (selectedPaymentMethod.icp_paymentmodename.toLowerCase() === "wallet" && walletAmount < totalCartPrice) {
      return alert(`Insufficient wallet amount ${walletAmount}`);
    }

    setIsProcessingCheckout(true);
    showSnackBarMsg("Processing your order...", false);

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

    const payload: BasketBody = {
      hbasket: {
        ihb_id: undefined,
        ihb_ireg_id: userProfile.ireg_id,
        ihb_cmp_id: companyModel?.cmp_id || "",
        ihb_date: formattedDate,
        ihb_discamt: 0,
        ihb_taxamt: 0,
        ihb_tax1amt: companyModel?.cmp_tax1 || 0,
        ihb_tax2amt: companyModel?.cmp_tax2 || 0,
        ihb_total: totalCartPrice,
        ihb_status: "pending",
        ihb_userstamp: userProfile.ireg_email,
        ihb_hsh_id: selectedShippingMethod.hsh_id,
        ihb_deliveryaddress: JSON.stringify(selectedAddress),
      },
      basket: cartItems.map(item => {
        const total = item.ioi_unitprice * (1 - (item.ioi_disc || 0) / 100) * item.amount;
        const roundedTotal = parseFloat(total.toFixed(2));

        return {
          iba_id: undefined,
          iba_it_id: item.it_id,
          iba_qty: item.amount,
          iba_price: roundedTotal,
          iba_disc: item.ioi_disc || 0,
          iba_tax: 0,
          iba_tax1: 0,
          iba_tax2: 0,
          iba_total: roundedTotal,
          iba_expirydate: "",
          iba_purchasedate: formattedDate,
          iba_userstamp: userProfile.ireg_id,
          iba_pm_id: "",
        };
      }),
    };

    try {
      const response = await addBasket(payload);
      if (response.success === 1) {
        const inCheckoutModel = {
          ich_ireg_id: userProfile.ireg_id,
          ich_cmp_id: companyModel?.cmp_id,
          ich_ihb_id: response.res.hbasket.ihb_id,
          ich_checkoutpaymentmode: selectedPaymentMethod.icp_paymentmodename,
          ich_total: totalCartPrice.toFixed(1),
          ich_status: 'paid',
          ich_userstamp: userProfile.ireg_id,
          wallet_id: wallet?.iwal_id,
          storename: companyModel?.cmp_name,
          user: userProfile
        }
        router.replace({
          pathname: "/screens/payment-summary",
          params: {
            totalAmount: totalCartPrice.toFixed(2),
            paymentMethod: selectedPaymentMethod.icp_paymentmodename,
            deliveryAddress: JSON.stringify(selectedAddress),
            basketHeader: JSON.stringify(payload.hbasket),
            checkoutModel: JSON.stringify(inCheckoutModel)
          },
        });
      } else showSnackBarMsg("Failed to place order");
    } catch (error) {
      showSnackBarMsg("Server error. Please check your internet connection.");
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const sections = [
    { key: "deliveryAddress" },
    { key: "shippingMethod" },
    { key: "paymentMethod" },
    { key: "cartSummary" },
  ];

  const renderItem = ({ item }: { item: { key: string } }) => {
    switch (item.key) {
      case "deliveryAddress":
        return <DeliveryAddressSelector selectedAddress={selectedAddress} onSelectAddress={setSelectedAddress} />;
      case "shippingMethod":
        return <ShippingMethodSelector selectedShippingMethod={selectedShippingMethod} setSelectedShippingMethod={setSelectedShippingMethod} />;
      case "paymentMethod":
        return <PaymentMethodSelector selectedPaymentMethod={selectedPaymentMethod} setSelectedPaymentMethod={handlePaymentMethodChange} />;
      case "cartSummary":
        return <CartSummary cartItems={cartItems} totalPrice={totalCartPrice} onApplyVoucher={handleApplyVoucher} isApplyingVoucher={isCheckingVoucher} />;
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingBottom: insets.bottom, backgroundColor: theme.screenBackground }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ padding: 15 }}
      />

      <Pressable
        style={[
          styles.proceedButton,
          { backgroundColor: theme.secondary, shadowColor: theme.secondary },
          isProcessingCheckout && { opacity: 0.6 },
        ]}
        disabled={isProcessingCheckout}
        onPress={handleProceedToCheckout}
      >
        {isProcessingCheckout ? <ActivityIndicator color="#fff" /> : <Text style={styles.proceedButtonText}>Proceed to checkout ${totalCartPrice.toFixed(2)}</Text>}
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  proceedButton: {
    marginHorizontal: 15,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    borderRadius: 15,
  },
  proceedButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
