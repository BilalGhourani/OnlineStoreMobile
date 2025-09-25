import { Link } from "expo-router"; // For navigation
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { ItemModel } from "../types/itemModel"; // Assuming ItemModel is correctly defined

const CARD_MARGIN = 10;
const CARD_WIDTH = 80;
const IMAGE_SIZE = CARD_WIDTH - 5;
const BADGE_SIZE = 30;

interface TopSaleItemCardProps {
  itemModel: ItemModel;
}

const TopSaleItemCard: React.FC<TopSaleItemCardProps> = ({ itemModel }) => {
  const imageUrl =
    itemModel.ioi_photo1 ||
    "https://placehold.co/150x150/cccccc/000000?text=No+Image";
  const discountPercentage = itemModel.ioi_disc ?? 0;

  return (
    <Link
      href={`/screens/products/${encodeURIComponent(
        JSON.stringify(itemModel)
      )}`}
      asChild
    >
      <TouchableOpacity style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>
        {discountPercentage !== undefined && discountPercentage > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountPercentage}%</Text>
          </View>
        )}
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    backgroundColor: "#00000000",
    borderRadius: CARD_WIDTH / 2,
    marginHorizontal: CARD_MARGIN / 2,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#a19b9bff",
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2, // Makes the image container circular
    overflow: "hidden", // Ensures image is clipped to the circle
    backgroundColor: "#f0f0f0", // Placeholder background
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // For absolute positioning of badge
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  discountBadge: {
    position: "absolute",
    top: 0, // Position at top
    right: 0, // Position at right
    backgroundColor: "#E74C3C", // Red color for discount
    borderRadius: BADGE_SIZE / 2, // Makes it circular
    width: BADGE_SIZE, // Size of the badge
    height: BADGE_SIZE, // Size of the badge
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensure it's above the image
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default TopSaleItemCard;
