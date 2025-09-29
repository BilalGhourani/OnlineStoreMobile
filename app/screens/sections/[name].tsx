import SearchBar from "@/components/SearchBar";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import ProductCard from "../../../components/ProductCard";
import { fetchItemsByCategoryId } from "../../../services/dataService";
import { useAppSelector } from "../../../store/hooks";
import { useDebounce } from "../../../store/useDebounce";
import { ItemModel } from "../../../types/itemModel";

const ITEMS_PER_PAGE = 10;

const SectionProductsScreen: React.FC = () => {
  const { name } = useLocalSearchParams();
  const sectionName = typeof name === "string" ? name : "Category Products";

  const companyModel = useAppSelector((state) => state.company.companyModel);
  const sections = useAppSelector((state) => state.item.sections);

  const [items, setItems] = useState<ItemModel[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const loadSectionItems = useCallback(
    async (page: number, search: string = "") => {
      if (!companyModel?.cmp_id) {
        setError("Company ID is missing.");
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
          ITEMS_PER_PAGE,
          search
        );

        const transformedItems = response.data;

        setItems((prevItems) =>
          page === 1 ? transformedItems : [...prevItems, ...transformedItems]
        );
        setHasMore(page < response.total_pages);
      } catch (err: any) {
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
    [sectionName, companyModel]
  );

  useEffect(() => {
    console.log("[sectionName, companyModel]")
    setCurrentPage(1);
    const foundProduct = sections.find(
      (p) => p.fa_newname.trimEnd() === sectionName
    );
    if (foundProduct && !searchQuery) {
      setItems(foundProduct.items);
      setLoadingInitial(false);
    } else {
      setItems([]);
      loadSectionItems(1, debouncedSearch);
    }
    setHasMore(true);
  }, [sectionName, companyModel]);


  useEffect(() => {
    if (companyModel) {
      setCurrentPage(1);
      loadSectionItems(1, debouncedSearch);
    }
  }, [debouncedSearch]);

  const handleLoadMore = useCallback(() => {
    console.log("[handleLoadMore]")
    if (!loadingMore && hasMore) {
      setCurrentPage((prevPage) => {
        const nextPage = prevPage + 1;
        loadSectionItems(nextPage, debouncedSearch);
        return nextPage;
      });
    }
  }, [loadingMore, hasMore, debouncedSearch, loadSectionItems]);

  const renderFooter = () => {
    if (!loadingMore && !hasMore) {
      return (
        <View style={styles.endOfListContainer}>
          <Text style={styles.endOfListText}>No more products.</Text>
        </View>
      );
    }
    if (!loadingMore) return null;

    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color="#007bff" />
        <Text style={styles.loadingMoreText}>Loading more products...</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SearchBar
        query={searchQuery}
        setQuery={setSearchQuery}
        onSubmit={(val) => {
          setCurrentPage(1);
          loadSectionItems(1, val); // fetch products when user presses Enter/Search
        }}
      />

      {loadingInitial ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>
            Loading products for {sectionName}...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centeredContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => loadSectionItems(1, debouncedSearch)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={({ item }) => <ProductCard itemModel={item} />}
          keyExtractor={(item) => item.ioi_id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={true}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No products found for "{sectionName}".
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  loadingText: { marginTop: 10, fontSize: 16, color: "#555" },
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
  retryButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  gridContainer: { paddingHorizontal: 10, paddingVertical: 10 },
  emptyContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  emptyText: { fontSize: 16, color: "#777", textAlign: "center" },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  loadingMoreText: { marginLeft: 10, fontSize: 16, color: "#555" },
  endOfListContainer: { paddingVertical: 20, alignItems: "center" },
  endOfListText: { fontSize: 14, color: "#777" },
});

export default SectionProductsScreen;
