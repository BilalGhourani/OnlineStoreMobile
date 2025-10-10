import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { Dimensions } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const { width } = Dimensions.get("window");
const BANNER_HEIGHT = width * 0.8;

export default function BannerShimmer() {
    const { theme } = useTheme();
    return (
        <ShimmerPlaceholder
            duration={1200} // speed of animation
            shimmerWidthPercent={0.7}
            shimmerColors={[theme.shimmerFirstColor, theme.shimmerSecondColor, theme.shimmerFirstColor]}
            style={{
                width,
                height: BANNER_HEIGHT,
                borderRadius: 15,
                marginBottom: 20,
            }}
        />
    );
}
