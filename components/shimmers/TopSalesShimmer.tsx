import React from "react";
import { StyleSheet, View } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const topSaleShimmerCount = 6;

export default function TopSalesShimmer() {
    return (
        <View style={styles.container}>
            <ShimmerPlaceholder style={styles.sectionTitle} />
            <View style={styles.items}>
                {Array.from({ length: topSaleShimmerCount }).map((_, i) => (
                    <ShimmerPlaceholder key={i} style={styles.item} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginTop: 20, paddingHorizontal: 10 },
    sectionTitle: { height: 20, width: "40%", borderRadius: 6, marginBottom: 5 },
    items: { flexDirection: "row", marginTop: 20 },
    item: {
        height: 80,
        width: 80,
        borderRadius: 40,
        marginEnd: 5,
        backgroundColor: "#ddd",
    },
});
