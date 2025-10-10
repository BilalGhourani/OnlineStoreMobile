import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { StyleSheet, View } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const shimmerCount = 3;

export default function ProductSectionShimmer() {
    const { theme } = useTheme();
    return (
        <View style={styles.sectionContainer}>
            <ShimmerPlaceholder style={styles.sectionTitle} />
            <View style={styles.sectionItems}>
                {Array.from({ length: shimmerCount }).map((_, j) => (
                    <ShimmerPlaceholder key={j} style={[styles.productItem, { backgrounColor: theme.shimmerFirstColor }]} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionContainer: { marginTop: 20, paddingHorizontal: 10 },
    sectionTitle: { height: 20, width: "40%", borderRadius: 6, marginBottom: 5 },
    sectionItems: { flexDirection: "row", marginTop: 20 },
    productItem: {
        width: 180,
        height: 220,
        borderRadius: 10,
        marginEnd: 12,
    },
});
