import React from "react";
import { ScrollView, StyleSheet, View, Dimensions } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const { width } = Dimensions.get("window");
const BANNER_HEIGHT = width * 0.6;
const topSaleShimmerCount = 6;
const shimmerCount = 3;

export default function HomeShimmer() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Banner Shimmer */}
      <ShimmerPlaceholder style={styles.banner} />

      {/* Header Message Shimmer */}
      <ShimmerPlaceholder style={styles.headerMessage} />

      {/* Top Sales Items */}
      <View key={`topsales`} style={styles.topSaleContainer}>
          <ShimmerPlaceholder style={styles.sectionTitle} />
          <View key={`topsalesitems`} style={styles.topSaleItems}>
          {Array.from({ length: topSaleShimmerCount }).map((_, j) => (
           <ShimmerPlaceholder key={`topSale-${j}`} style={styles.topSaleItem} />
          ))}
          </View>
        </View>

      {/* Multiple Product Sections */}
      {Array.from({ length: shimmerCount }).map((_, i) => (
        <View key={`section-${i}`} style={styles.sectionContainer}>
          <ShimmerPlaceholder style={styles.sectionTitle} />
          <View key={`sectionitems-${i}`} style={styles.sectionItems}>
          {Array.from({ length: shimmerCount }).map((_, j) => (
            <ShimmerPlaceholder
              key={`section-${i}-item-${j}`}
              style={styles.productItem}
            />
          ))}
          </View>
        </View>
      ))}

      {/* Footer Shimmer */}
      <ShimmerPlaceholder style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  contentContainer: {
    paddingTop: 20,
  },
  banner: {
    width: width,
    height: BANNER_HEIGHT,
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  headerMessage: {
    height: 30,
    width: "100%",
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    height: 20,
    width: "40%",
    borderRadius: 6,
    marginBottom: 5,
  },
   topSaleContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  topSaleItems: {
    flexDirection:"row",
    marginTop: 20,
  },
  topSaleItem: {
    height: 80,
    width:80,
    borderRadius: 40,
    marginEnd: 5,
    backgroundColor: "#ddd",
  },
  sectionContainer: {
    marginTop: 20,
        paddingHorizontal: 10,
  },
  sectionItems: {
    flexDirection:"row",
    marginTop: 20,
  },
  productItem: {
    width: 180,
    height: 220,
    borderRadius: 10,
    marginEnd: 12,
    backgroundColor: "#ddd",
  },
  footer: {
    height: 50,
    width:'100%',
    borderRadius: 8,
    marginTop: 30,
    backgroundColor: "#ccc",
  },
});
