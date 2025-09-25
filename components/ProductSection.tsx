import { Link } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ItemModel } from "../types/itemModel";
import ProductCard from "./ProductCard";

interface ProductSectionProps {
  title: string;
  items: ItemModel[];
  onSeeAllPress?: (category: string) => void;
  category?: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  items,
  category,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Link href={`/screens/sections/${category}`} asChild>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <FlatList
        data={items}
        renderItem={({ item }) => <ProductCard itemModel={item} />}
        keyExtractor={(item) => item.it_id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  seeAllText: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 7, // To compensate for ProductCard's marginHorizontal
  },
});

export default ProductSection;
