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
  const companyModel = useAppSelector((state: RootState) => state.company.companyModel);

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
    <TouchableOpacity style={styles.card}
      onPress={() => router.push(`/screens/products/${encodeURIComponent(JSON.stringify(itemModel))}`)}>
      {/* Top content group */}
      <View style={styles.topContent}>
        {itemModel.ioi_photo1 ? (
          <Image source={{ uri: itemModel.ioi_photo1 }} style={styles.image} />
        ) : (
          <View style={[styles.image, { backgroundColor: "#ccc" }]} />
        )}
        <Text style={styles.name} numberOfLines={2}>
          {itemModel.ioi_name}
        </Text>
        <Text style={styles.code} numberOfLines={1}>
          {itemModel.it_code}
        </Text>
      </View>

      {/* Price + Discount */}
      <View style={styles.priceWrapper}>
        <View>
          {discountPercentage > 0 && (
            <Text style={styles.originalPrice}>${originalPrice.toFixed(2)}</Text>
          )}
          <Text style={styles.price}>${discountedPrice.toFixed(2)}</Text>
          {/* {discountPercentage > 0 && (
              <Text style={styles.discountBelow}>-{discountPercentage}% OFF</Text>
            )} */}
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
            isOutOfStockMsg && { color: "red", fontWeight: "bold" },
          ]}
        >
          {qtyText}
        </Text>
      )}
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
    padding: 10,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topContent: {
    alignItems: "center",
    flex: 1,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 5,
    marginBottom: 8,
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
  discountBelow: {
    fontSize: 13,
    color: "#E74C3C",
    marginTop: 2,
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
