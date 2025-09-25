import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ProductCard from "../../../components/ProductCard";
import { fetchItemsByCategoryId } from "../../../services/dataService"; // Import the new API function
import { useAppSelector } from "../../../store/hooks";
import { ItemModel } from "../../../types/itemModel";

const ITEMS_PER_PAGE = 10; // Define how many items to load per page

const SectionProductsScreen: React.FC = () => {
  const { name } = useLocalSearchParams();
  const sectionName = typeof name === "string" ? name : "Category Products";

  const companyModel = useAppSelector((state) => state.company.companyModel);
  const sections = useAppSelector((state) => state.item.sections);

  const [items, setItems] = useState<ItemModel[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true); // For initial load
  const [loadingMore, setLoadingMore] = useState(false); // For loading subsequent pages
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Indicates if there are more pages to load

  const loadSectionItems = useCallback(
    async (page: number) => {
      if (!companyModel) {
        // Wait for companyDetails to be loaded from context
        // This also covers the case where companyDetails is null initially
        return;
      }
      if (!companyModel.cmp_id) {
        setError("Section ID or Company ID is missing.");
        setLoadingInitial(false);
        setLoadingMore(false);
        return;
      }

      try {
        if (page === 1) {
          setLoadingInitial(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const response = await fetchItemsByCategoryId(
          sectionName,
          companyModel.cmp_id,
          page,
          ITEMS_PER_PAGE
        );
        const transformedItems = response.data;

        setItems((prevItems) =>
          page === 1 ? transformedItems : [...prevItems, ...transformedItems]
        );
        setHasMore(page < response.total_pages);
      } catch (err) {
        console.error("Error fetching items by section:", err);
        setError(
          `Failed to load products for ${sectionName}: ${err.message || "Unknown error"
          }`
        );
      } finally {
        setLoadingInitial(false);
        setLoadingMore(false);
      }
    },
    [sectionName, companyModel, items.length]
  );

  // Effect to trigger initial load
  useEffect(() => {
    setCurrentPage(1); // Reset page to 1 on sectionId or companyDetails change
    // Attempt to find the product in the globally loaded products array
    const foundProduct = sections.find(
      (p) => p.fa_newname.trimEnd() === sectionName
    );
    if (foundProduct) {
      setItems(foundProduct.items);
      setLoadingInitial(false);
    } else {
      setItems([]);
      loadSectionItems(1);
    }
    setHasMore(true);
  }, [sectionName, companyModel]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
      console.log(`handleLoadMore ${currentPage + 1}`);
      loadSectionItems(currentPage + 1);
    }
  };
  const renderFooter = () => {
    if (!loadingMore && !hasMore)
      return (
        <View style={styles.endOfListContainer}>
          <Text style={styles.endOfListText}>No more products.</Text>
        </View>
      );
    if (!loadingMore) return null; // Only show loader if actually loading

    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color="#007bff" />
        <Text style={styles.loadingMoreText}>Loading more products...</Text>
      </View>
    );
  };

  if (loadingInitial) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>
          Loading products for {sectionName}...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => loadSectionItems(1)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={({ item }) => <ProductCard itemModel={item} />}
          keyExtractor={(item) => item.ioi_id}
          numColumns={2} // Display in a 2-column grid
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={true} // Show scroll indicator
          onEndReached={handleLoadMore} // Trigger load more when scroll reaches end
          onEndReachedThreshold={0.5} // When 50% from end, trigger
          ListFooterComponent={renderFooter} // Component to show at the bottom (loader/end message)
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No products found for {sectionName}.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  gridContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  loadingMoreText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#555",
  },
  endOfListContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  endOfListText: {
    fontSize: 14,
    color: "#777",
  },
});

export default SectionProductsScreen;
