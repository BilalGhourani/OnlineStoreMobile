import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { CartItem } from "../types/index";

interface CartItemRowProps {
  cartItem: CartItem;
  onRemove: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  cartItem,
  onRemove,
  onUpdateQuantity,
}) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.itemContent}>
        <Image
          source={{ uri: cartItem.ioi_photo1 ?? "" }}
          style={styles.itemImage}
          resizeMode="cover"
        />

        <View style={styles.textContainer}>
          <View style={styles.topRow}>
            <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={2}>
              {cartItem.ioi_name}
            </Text>
            <Pressable
              onPress={() => onRemove(cartItem.ioi_id)}
              style={styles.removeButton}
            >
              <Ionicons name="trash-outline" size={20} color="red" />
            </Pressable>
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.quantityControls}>
              <Pressable
                onPress={() =>
                  onUpdateQuantity(cartItem.ioi_id, cartItem.amount - 1)
                }
                style={[styles.quantityButton, { backgroundColor: theme.primary }]}
                disabled={cartItem.amount <= 1}
              >
                <Text style={[styles.quantityButtonText, { color: theme.text }]}>-</Text>
              </Pressable>
              <Text style={[styles.quantityText, { color: theme.text }]}>{cartItem.amount}</Text>
              <Pressable
                onPress={() =>
                  onUpdateQuantity(cartItem.ioi_id, cartItem.amount + 1)
                }
                style={[styles.quantityButton, { backgroundColor: theme.primary }]}
              >
                <Text style={[styles.quantityButtonText, { color: theme.text }]}>+</Text>
              </Pressable>
            </View>
            <Text style={styles.itemPrice}>
              ${((cartItem.ioi_unitprice * (1 - cartItem.ioi_disc / 100) * cartItem.amount)).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemContent: {
    flexDirection: "row", // Arrange image and text horizontally
    alignItems: "flex-start", // Align items to the top
  },
  itemImage: {
    width: 80, // Fixed width for the image
    height: 80, // Fixed height for the image
    borderRadius: 8, // Rounded corners for the image
    marginRight: 15, // Space between image and text
  },
  textContainer: {
    flex: 1, // Allows text content to take up remaining space
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5, // Reduced margin to bring closer to image
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginRight: 10,
  },
  removeButton: {
    padding: 5,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5, // Space between item name and quantity/price
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#eee",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 18,
    color: "#007bff",
    fontWeight: "bold",
    textAlign: "right",
  },
});

export default CartItemRow;
