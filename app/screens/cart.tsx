import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import CartItemRow from "../../components/CartItemRow";

import { useTheme } from "@/theme/ThemeProvider";
import { useAppSelector } from "../../store/hooks";
import {
  clearCart,
  removeFromCart,
  updateCartItemQuantity,
} from "../../store/slices/cartSlice";

export default function CartScreen() {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const isLoggedIn = useAppSelector((state) => state.auth.userProfile != null);
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const totalCartPrice = useAppSelector((state) => state.cart.totalCartPrice);

  const handleProceedToCheckout = () => {
    if (isLoggedIn) {
      router.push("/screens/checkout");
    } else {
      router.push("/screens/login");
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    dispatch(
      updateCartItemQuantity({ productId: itemId, amount: newQuantity })
    );
  };

  const handleRemove = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.screenBackground }]}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyCartText}>Your cart is empty.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.ioi_id}
            renderItem={({ item }) => (
              <CartItemRow
                cartItem={item}
                onRemove={handleRemove}
                onUpdateQuantity={handleUpdateQuantity}
              />
            )}
            contentContainerStyle={styles.itemList}
          />

          {/* ✅ Summary + Buttons in one container */}
          <View
            style={[
              styles.summaryContainer,
              { paddingBottom: insets.bottom, borderTopColor: theme.border, backgroundColor: theme.card },
            ]}
          >
            <Text style={[styles.totalText, { color: theme.text }]}>
              Total Items:{" "}
              {cartItems.reduce((acc, item) => acc + item.amount, 0)}
            </Text>
            <Text style={[styles.totalPriceText, { color: theme.primary }]}>
              Total Price: ${totalCartPrice.toFixed(2)}
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                { opacity: pressed ? 0.7 : 1, backgroundColor: theme.primary },
              ]}
              onPress={handleProceedToCheckout}
            >
              <Text style={styles.buttonText}>
                Proceed to checkout ${totalCartPrice.toFixed(2)} USD
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                {
                  opacity: pressed ? 0.7 : 1,
                  marginTop: 10,
                  backgroundColor: theme.redButton,
                  shadowColor: theme.shadow
                },
              ]}
              onPress={handleClearCart}
            >
              <Text style={styles.buttonText}>Clear Cart</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingBottom: 0,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
  },
  emptyCartText: {
    fontSize: 18,
    color: "#666",
    marginTop: 10,
  },
  itemList: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
    elevation: 10,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 5,
    color: "#333",
    paddingHorizontal: 10
  },
  totalPriceText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 15,
    color: "#007bff",
    paddingHorizontal: 10
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 18,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    borderRadius: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
