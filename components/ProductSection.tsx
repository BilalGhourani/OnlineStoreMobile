import { router } from "expo-router";
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
  id: string;
  title: string;
  items: ItemModel[];
  onSeeAllPress?: (category: string) => void;
  category?: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  id,
  title,
  items,
  category,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={() => {
          router.push({
            pathname: "/screens/SectionProducts",
            params: { id: id, name: category },
          });
        }}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
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
