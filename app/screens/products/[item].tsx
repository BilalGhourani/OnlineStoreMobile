import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import ImageViewerModal from "../../../components/ImageViewerModal";
import PaginationDots from "../../../components/PaginationDots";
import { addToCart } from "../../../store/slices/cartSlice";
import { showSnackbar } from "../../../store/slices/snackbarSlice";
import { ItemModelDetails } from "../../../types";
import { getImagesList, parseItem } from "../../../utils/Utils";

const { width } = Dimensions.get("window");
const IMAGE_CAROUSEL_HEIGHT = width * 0.8; // Height for the image carousel

const ProductDetailScreen: React.FC = () => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets()
  const { item } = useLocalSearchParams();
  const itemStr = typeof item === "string" ? item : undefined;
  const productModel = parseItem(itemStr);

  const [product, setProduct] = useState<ItemModelDetails>();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // State for the image viewer modal
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Ref for FlatList to enable snapping
  const imageCarouselRef = useRef<FlatList>(null);

  const showSnackBarMsg = (message: string, isError: boolean = true) => {
    dispatch(showSnackbar({ message, isError }));
  };

  const handleAddToCart = () => {
    if (productModel) {
      dispatch(addToCart({ item: productModel, amount: 1 }));
      showSnackBarMsg(`${product.name} has been added to your cart.`, false);
    } else {
      showSnackBarMsg("Product details are unavailable.");
    }
  };

  useEffect(() => {
    //setProduct(undefined)
    setProduct(getImagesList(productModel))
  }, [itemStr])

  // Handle automatic scrolling for images (optional, similar to home screen banners)
  useEffect(() => {
    if (product && product.imageUrls.length > 1) {
      const interval = setInterval(() => {
        const nextIndex = (activeImageIndex + 1) % product.imageUrls.length;
        if (imageCarouselRef.current) {
          imageCarouselRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
      }, 5000); // Scroll every 5 seconds

      return () => clearInterval(interval);
    }
  }, [activeImageIndex, product?.imageUrls.length]);

  // Function to open the image viewer modal
  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageViewerVisible(true);
  };

  // Function to close the image viewer modal
  const closeImageViewer = () => {
    setIsImageViewerVisible(false);
  };

  // Render item for the FlatList image carousel
  const renderImageItem = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => (
    <Pressable
      style={styles.carouselImageContainer}
      onPress={() => openImageViewer(index)}
    >
      <Image
        source={{ uri: item }}
        style={styles.carouselImage}
        resizeMode="contain"
      />
    </Pressable>
  );

  // Handle scroll events for FlatList to update active dot
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveImageIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  // If we reach here, product should be available
  if (!product) {
    // Fallback for unexpected null product after loading/error checks
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>
          Product details could not be displayed.
        </Text>
      </View>
    );
  }

  // Prepare images for the ImageViewer (it expects { url: string } objects)
  const viewerImages = product.imageUrls.map((url) => ({ url }));

  return (
    <ScrollView style={styles.container}>
      {/* Image Carousel */}
      <View style={styles.imageCarouselWrapper}>
        {product.imageUrls.length > 0 ? (
          <FlatList
            ref={imageCarouselRef}
            data={product.imageUrls}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => `product-image-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            initialScrollIndex={0}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
          />
        ) : (
          <View style={styles.noImagesContainer}>
            <Text style={styles.noImagesText}>No images available.</Text>
            <Image
              source={{
                uri: "https://placehold.co/600x360/cccccc/000000?text=No+Image",
              }}
              style={styles.carouselImage}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Pagination Dots for Images */}
        {product.imageUrls.length > 1 && (
          <PaginationDots
            totalDots={product.imageUrls.length}
            activeIndex={activeImageIndex}
            style={styles.imagePaginationDots}
            dotStyle={styles.imageDotStyle}
            activeDotStyle={styles.imageActiveDotStyle}
          />
        )}
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productCode}>Code: {product.code}</Text>
        <Text style={styles.productCategory}>Category: {product.category}</Text>
        <View style={styles.priceContainer}>
          {/* Real/Discounted Price */}
          <Text style={styles.price}>
            Price: ${product.discountedPrice.toFixed(2)}
          </Text>

          {/* Discount Badge */}
          {product.discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{product.discount}%</Text>
            </View>
          )}
        </View>
        {product.description && (
          <Text style={styles.productDescription}>{product.description}</Text>
        )}
        <Pressable
          onPress={handleAddToCart}
          style={({ pressed }) => [
            styles.addToCartButton,
            {
              opacity: pressed ? 0.7 : 1,
              marginBottom: insets.bottom
            },
          ]}
        >
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
        </Pressable>
      </View>

      {/* Image Viewer Modal */}
      {isImageViewerVisible && (
        <ImageViewerModal
          isVisible={isImageViewerVisible}
          imageUrls={viewerImages}
          initialIndex={currentImageIndex}
          onClose={closeImageViewer}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginHorizontal: 20,
  },
  retryButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageCarouselWrapper: {
    height: IMAGE_CAROUSEL_HEIGHT,
    marginBottom: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  carouselImageContainer: {
    width: width,
    height: IMAGE_CAROUSEL_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  noImagesContainer: {
    width: width,
    height: IMAGE_CAROUSEL_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  noImagesText: {
    color: "#666",
    fontSize: 16,
    marginBottom: 10,
  },
  imagePaginationDots: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  imageDotStyle: {
    backgroundColor: "rgba(0,0,0,.2)",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  imageActiveDotStyle: {
    backgroundColor: "#007bff",
  },
  detailsCard: {
    backgroundColor: "#fff",
    margin: 5,
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  productCode: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  productCategory: {
    fontSize: 16,
    color: "#777",
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: "row", // This is the magic! It lays out children horizontally
    alignItems: "center", // This aligns items vertically in the center of the row
    marginTop: 5,
    marginBottom: 15,
  },
  discountBadge: {
    backgroundColor: "#fff", // Light green background for the badge
    borderColor: "#E74C3C", // Green border
    borderWidth: 1,
    borderRadius: 5,
    marginStart: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E74C3C",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#28a745",
  },
  productDescription: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    marginBottom: 20,
  },
  addToCartButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProductDetailScreen;
