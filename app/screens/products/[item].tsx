import { useTheme } from "@/theme/ThemeProvider";
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
import { useDispatch, useSelector } from "react-redux";
import ImageViewerModal from "../../../components/ImageViewerModal";
import PaginationDots from "../../../components/PaginationDots";
import { RootState } from "../../../store";
import { addToCart } from "../../../store/slices/cartSlice";
import { showSnackbar } from "../../../store/slices/snackbarSlice";
import { ItemModelDetails } from "../../../types";
import { getImagesList, parseItem } from "../../../utils/Utils";

const { width } = Dimensions.get("window");
const IMAGE_CAROUSEL_HEIGHT = width * 0.8; // Height for the image carousel

const ProductDetailScreen: React.FC = () => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { item } = useLocalSearchParams();
  const itemStr = typeof item === "string" ? item : undefined;
  const productModel = parseItem(itemStr);

  const companyModel = useSelector((state: RootState) => state.company.companyModel);

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
      showSnackBarMsg(`${product?.name} has been added to your cart.`, false);
    } else {
      showSnackBarMsg("Product details are unavailable.");
    }
  };

  useEffect(() => {
    setProduct(getImagesList(productModel));
  }, [itemStr]);

  // Auto-scroll images
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
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [activeImageIndex, product?.imageUrls.length]);

  // Quantity rules
  const qty = product?.ioi_remqty ?? 0;
  let qtyText: string | null = null;
  let isOutOfStockMsg = false;

  if (companyModel?.ioi_showremqty) {
    if (qty > 0) {
      qtyText = `Quantity: ${qty}`;
    } else if (qty == 0 && companyModel.ioi_hidezeroqty) {
      qtyText = null;
    } else if (qty == 0 && companyModel.ioi_showmsgzeroqty) {
      qtyText = companyModel.ioi_showmsgzeroqty;
      isOutOfStockMsg = true;
    } else {
      qtyText = `Qty: ${qty}`;
    }
  }

  // If no product
  if (!product) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>
          Product details could not be displayed.
        </Text>
      </View>
    );
  }

  // Prepare images for viewer
  const viewerImages = product.imageUrls.map((url) => ({ url }));

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.screenBackground }]}>
      {/* Image Carousel */}
      <View style={styles.imageCarouselWrapper}>
        {product.imageUrls.length > 0 ? (
          <FlatList
            ref={imageCarouselRef}
            data={product.imageUrls}
            renderItem={({ item, index }) => (
              <Pressable
                style={styles.carouselImageContainer}
                onPress={() => {
                  setCurrentImageIndex(index);
                  setIsImageViewerVisible(true);
                }}
              >
                <Image
                  source={{ uri: item }}
                  style={styles.carouselImage}
                  resizeMode="contain"
                />
              </Pressable>
            )}
            keyExtractor={(item, index) => `product-image-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={({ viewableItems }) => {
              if (viewableItems.length > 0) {
                setActiveImageIndex(viewableItems[0].index);
              }
            }}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          />
        ) : (
          <View style={styles.noImagesContainer}>
            <Text style={styles.noImagesText}>No images available.</Text>
          </View>
        )}

        {/* Pagination Dots */}
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

      <View style={[styles.detailsCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.productName, { color: theme.text }]}>{product.name}</Text>
        <Text style={[styles.productCode, { color: theme.text }]}>Code: {product.code}</Text>
        <Text style={[styles.productCategory, { color: theme.text }]}>Category: {product.category}</Text>

        {/* Price + Discount */}
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: theme.secondary }]}>
            Price: ${product.discountedPrice.toFixed(2)}
          </Text>
          {product.discount > 0 && (
            <View style={[styles.discountBadge, { backgroundColor: theme.screenBackground }]}>
              <Text style={styles.discountText}>-{product.discount}%</Text>
            </View>
          )}
        </View>

        {/* Quantity */}
        {qtyText && (
          <Text
            style={[
              styles.qty,
              { color: theme.text },
              isOutOfStockMsg && { color: "red", fontWeight: "bold" },
            ]}
          >
            {qtyText}
          </Text>
        )}

        {product.description && (
          <Text style={styles.productDescription}>{product.description}</Text>
        )}

        {/* Add to Cart */}
        <Pressable
          onPress={handleAddToCart}
          disabled={qty <= 0}
          style={({ pressed }) => [
            styles.addToCartButton,
            {
              opacity: qty <= 0 ? 0.4 : pressed ? 0.7 : 1,
              marginBottom: insets.bottom,
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
          onClose={() => setIsImageViewerVisible(false)}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: { fontSize: 18, color: "red", textAlign: "center" },
  imageCarouselWrapper: {
    height: IMAGE_CAROUSEL_HEIGHT,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  carouselImageContainer: {
    width: width,
    height: IMAGE_CAROUSEL_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImage: { width: "100%", height: "100%" },
  noImagesContainer: {
    width: width,
    height: IMAGE_CAROUSEL_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  noImagesText: { color: "#666", fontSize: 16 },
  imagePaginationDots: { position: "absolute", bottom: 10 },
  imageDotStyle: {
    backgroundColor: "rgba(0,0,0,.2)",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  imageActiveDotStyle: { backgroundColor: "#007bff" },
  detailsCard: { backgroundColor: "#fff", margin: 5, borderRadius: 10, padding: 10 },
  productName: { fontSize: 24, fontWeight: "bold", color: "#333" },
  productCode: { fontSize: 18, fontWeight: "bold", color: "#333" },
  productCategory: { fontSize: 16, color: "#777" },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 15,
  },
  discountBadge: {
    backgroundColor: "#fff",
    borderColor: "#E74C3C",
    borderWidth: 1,
    borderRadius: 5,
    marginStart: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: { fontSize: 20, fontWeight: "bold", color: "#E74C3C" },
  price: { fontSize: 20, fontWeight: "bold", color: "#28a745" },
  qty: { fontSize: 16, marginBottom: 10, color: "#444" },
  productDescription: { fontSize: 16, color: "#555", lineHeight: 24 },
  addToCartButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default ProductDetailScreen;
