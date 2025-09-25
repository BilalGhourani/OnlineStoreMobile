import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { ItemModel } from "../types/itemModel";
import TopSaleItemCard from "./TopSaleItemCard";

interface TopSalesSectionProps {
  title: string;
  items: ItemModel[];
}

const TopSalesSection: React.FC<TopSalesSectionProps> = ({ title, items }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <FlatList
        data={items}
        renderItem={({ item }) => <TopSaleItemCard itemModel={item} />}
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
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  listContent: {
    paddingHorizontal: 7, // To compensate for ProductCard's marginHorizontal
  },
});

export default TopSalesSection;
