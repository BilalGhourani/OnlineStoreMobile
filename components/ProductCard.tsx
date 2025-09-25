import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ItemModel } from "../types/itemModel";
import { Link } from "expo-router";

interface ProductCardProps {
  itemModel: ItemModel;
}

const ProductCard: React.FC<ProductCardProps> = ({ itemModel }) => {
  const originalPrice = itemModel.ioi_unitprice ?? 0;
  const discountPercentage = itemModel.ioi_disc ?? 0;
  const discountedPrice =
    discountPercentage > 0
      ? originalPrice * (1 - discountPercentage / 100)
      : originalPrice;

  return (
    <Link
      href={`/screens/products/${encodeURIComponent(
        JSON.stringify(itemModel)
      )}`}
      asChild
    >
      <TouchableOpacity style={styles.card}>
        {/* Top content group */}
        <View style={styles.topContent}>
          {itemModel.ioi_photo1 ? (
            <Image
              source={{ uri: itemModel.ioi_photo1 }}
              style={styles.image}
            />
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
        <View style={styles.priceContainer}>
          {/* Real/Discounted Price */}
          <Text style={styles.price}>${discountedPrice.toFixed(2)}</Text>

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{itemModel.ioi_disc}%</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 180, // Fixed width for horizontal scroll
    marginHorizontal: 8,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topContent: {
    alignItems: "center", // Keep top content centered horizontally
    flex: 1, // Optional: if you want top content to take up remaining space
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
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  discountBadge: {
    backgroundColor: "#fff",
    borderColor: "#E74C3C",
    borderWidth: 1,
    borderRadius: 5,
    marginStart: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    fontSize: 16,
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
