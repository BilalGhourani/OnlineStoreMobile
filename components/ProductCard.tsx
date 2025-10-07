import { useTheme } from "@/theme/ThemeProvider";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootState } from "../store";
import { useAppSelector } from "../store/hooks";
import { ItemModel } from "../types/itemModel";

interface ProductCardProps {
  itemModel: ItemModel;
}

const ProductCard: React.FC<ProductCardProps> = ({ itemModel }) => {
  const { theme } = useTheme();
  const companyModel = useAppSelector(
    (state: RootState) => state.company.companyModel
  );

  const originalPrice = itemModel.ioi_unitprice ?? 0;
  const discountPercentage = itemModel.ioi_disc ?? 0;
  const discountedPrice =
    discountPercentage > 0
      ? originalPrice * (1 - discountPercentage / 100)
      : originalPrice;

  // --- Quantity display rules ---
  const qty = itemModel.ioi_remqty ?? 0;
  let qtyText: string | null = null;
  let isOutOfStockMsg = false;

  if (companyModel?.ioi_showremqty) {
    if (qty > 0) {
      qtyText = `Quantity: ${qty}`;
    } else if (qty == 0 && companyModel.ioi_hidezeroqty) {
      qtyText = null; // completely hide
    } else if (qty == 0 && companyModel.ioi_showmsgzeroqty) {
      qtyText = companyModel.ioi_showmsgzeroqty; // custom msg (ex: "Out of stock")
      isOutOfStockMsg = true;
    } else {
      qtyText = `Qty: ${qty}`;
    }
  }

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card }]}
      onPress={() =>
        router.push(
          `/screens/products/${encodeURIComponent(JSON.stringify(itemModel))}`
        )
      }
    >
      {/* Image container (no padding) */}
      <View style={styles.imageContainer}>
        {itemModel.ioi_photo1 ? (
          <Image source={{ uri: itemModel.ioi_photo1 }} style={styles.image} />
        ) : (
          <View style={[styles.image, { backgroundColor: "#ccc" }]} />
        )}
      </View>

      {/* Details container */}
      <View style={styles.detailsContainer}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
          {itemModel.ioi_name}
        </Text>

        <Text style={[styles.code, { color: theme.text }]} numberOfLines={1}>
          {itemModel.it_code}
        </Text>

        {/* Price + Discount */}
        <View style={styles.priceWrapper}>
          <View>
            {discountPercentage > 0 && (
              <Text style={[styles.originalPrice, { color: theme.text }]}>
                ${originalPrice.toFixed(2)}
              </Text>
            )}
            <Text style={styles.price}>${discountedPrice.toFixed(2)}</Text>
          </View>

          {discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discountPercentage}%</Text>
            </View>
          )}
        </View>

        {/* Quantity */}
        {qtyText && (
          <Text
            style={[
              styles.qty,
              isOutOfStockMsg
                ? { color: "red", fontWeight: "bold" }
                : { color: theme.text },
            ]}
          >
            {qtyText}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 180,
    marginHorizontal: 8,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden", // ensures rounded corners clip content
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 5,
    marginBottom: 8,
  },
  detailsContainer: {
    padding: 10,
    width: "100%",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  code: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  qty: {
    fontSize: 13,
    color: "#444",
    marginTop: 4,
  },
  priceWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 5,
    width: "100%",
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },
  discountBadge: {
    backgroundColor: "#fff",
    borderColor: "#E74C3C",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  discountText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#E74C3C",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#22c55e",
  },
});

export default ProductCard;
