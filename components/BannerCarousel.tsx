import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Banner } from "../types";

const { width } = Dimensions.get("window");
const BANNER_HEIGHT = width * 0.8;

interface BannerCarouselProps {
  banners: Banner[];
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
  // const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const renderBannerItem = ({ item }: { item: Banner }) => (
    <Pressable
      key={item.id}
      style={styles.page}
      onPress={() => console.log(`Banner ${item.id} pressed!`)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.bannerImage} />
      {/* Note overlay */}
      {item.note && item.note != "" ? (
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>{item.note}</Text>
        </View>
      ) : null}
    </Pressable>
  );

  if (!banners || banners.length === 0) {
    return (
      <View style={styles.noBannersContainer}>
        <Text style={styles.noBannersText}>No banners to display.</Text>
      </View>
    );
  }

  return (
    <View style={styles.bannerContainer}>
      <Carousel
        loop
        autoPlay
        autoPlayInterval={3000}
        mode="horizontal-stack"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
          parallaxAdjacentItemScale: 0.8,
        }}
        width={width}
        height={BANNER_HEIGHT}
        data={banners}
        scrollAnimationDuration={800}
        // onSnapToItem={(index) => setActiveBannerIndex(index)}
        renderItem={renderBannerItem}
      />

      {/* <PaginationDots
        totalDots={banners.length}
        activeIndex={activeBannerIndex}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    height: BANNER_HEIGHT,
    backgroundColor: "#f8f8f8",
  },
  noBannersContainer: {
    height: BANNER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  noBannersText: {
    color: "#666",
    fontSize: 16,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImage: {
    width: width,
    height: BANNER_HEIGHT,
    resizeMode: "cover",
  },
  noteContainer: {
    position: "absolute",
    bottom: 5,
    left: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  noteText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default BannerCarousel;
