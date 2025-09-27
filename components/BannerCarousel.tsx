import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import PaginationDots from "../components/PaginationDots";
import { Banner } from "../types";

const { width } = Dimensions.get("window");
const BANNER_HEIGHT = width * 0.6;

interface BannerCarouselProps {
  banners: Banner[];
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const carouselRef = useRef<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeBannerIndex + 1) % banners.length;
      if (carouselRef.current) {
        carouselRef.current?.snapToItem(nextIndex);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeBannerIndex, banners.length]);

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
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
          parallaxAdjacentItemScale: 0.8,
        }}
        width={width}
        height={BANNER_HEIGHT}
        data={banners}
        scrollAnimationDuration={800}
        onSnapToItem={(index) => setActiveBannerIndex(index)}
        renderItem={renderBannerItem}
      />

      <PaginationDots
        totalDots={banners.length}
        activeIndex={activeBannerIndex}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    height: BANNER_HEIGHT + 30,
    marginBottom: 20,
    backgroundColor: "#f8f8f8",
  },
  noBannersContainer: {
    height: BANNER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
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
    borderRadius: 8,
  },
  noteContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent black
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
