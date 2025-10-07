import React from "react";
import { Dimensions } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const { width } = Dimensions.get("window");
const BANNER_HEIGHT = width * 0.8;

export default function BannerShimmer() {
    return (
        <ShimmerPlaceholder
            duration={1200} // speed of animation
            shimmerWidthPercent={0.7}
            shimmerColors={["#eeeeee", "#dddddd", "#eeeeee"]}
            style={{
                width,
                height: BANNER_HEIGHT,
                borderRadius: 15,
                marginBottom: 20,
            }}
        />
    );
}
