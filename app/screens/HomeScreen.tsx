import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View
} from "react-native";

import AnimatedText from "../../components/AnimatedText";
import BannerCarousel from "../../components/BannerCarousel";
import ProductSection from "../../components/ProductSection";
import HomeShimmer from "../../components/shimmers/HomeShimmer";
import TopSalesSection from "../../components/TopSalesSection";

import SearchBar from "@/components/SearchBar";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchBrands } from "../../store/slices/brandSlice";
import { fetchCompanyById } from "../../store/slices/companySlice";
import { fetchFamilies } from "../../store/slices/familySlice";
import { fetchItems } from "../../store/slices/itemSlice";
import { showSnackbar } from "../../store/slices/snackbarSlice";
import { useDebounce } from "../../store/useDebounce";

const HomeScreen = () => {
  const dispatch = useAppDispatch();

  const companyId = useAppSelector((state) => state.auth.companyId);
  const companyModel = useAppSelector((state) => state.company.companyModel);
  const banners = useAppSelector((state) => state.company.banners);
  const topSales = useAppSelector((state) => state.item.topSales);
  const sections = useAppSelector((state) => state.item.sections);
  const filters = useAppSelector((state) => state.brand.selectedBrandFilters);
  const loading = useAppSelector((state) => state.company.loading);
  const error = useAppSelector((state) => state.company.error);

  // 🔎 Search State
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Initial fetch
  useEffect(() => {
    if (companyId) {
      dispatch(fetchCompanyById(companyId));
      dispatch(fetchItems({ cmpId: companyId, brandIds: filters, searchKey: `` }));
      dispatch(fetchFamilies(companyId));
      dispatch(fetchBrands(companyId));
    }
  }, [companyId]);

  // Fetch on search
  useEffect(() => {
    if (companyId) {
      dispatch(
        fetchItems({
          cmpId: companyId,
          brandIds: filters,
          searchKey: debouncedSearch
        })
      );
    }
  }, [debouncedSearch]);

  if (loading || error) {
    if (error) {
      dispatch(
        showSnackbar({
          message: "An error has occurred while loading your items...",
          isError: true,
        })
      );
    }
    return <HomeShimmer />;
  }

  // Build FlatList data structure
  const flatListData = useMemo(() => {
    const data: { type: string;[key: string]: any }[] = [];

    // Banner
    data.push({ type: "banner" });

    // Header message
    if (companyModel?.ioe_headermessage) {
      data.push({ type: "headerMessage", message: companyModel.ioe_headermessage });
    }

    // 🔎 Search bar as an item
    data.push({ type: "searchBar" });

    // Top sales
    if (topSales.length > 0) {
      data.push({ type: "topSales", items: topSales });
    }

    // Sections
    sections.forEach((section, index) => {
      data.push({
        type: "section",
        title: section.fa_newname,
        items: section.items,
        key: section.fa_name || `section-${index}`,
      });
    });

    // Footer message
    if (companyModel?.ioe_footermessage) {
      data.push({ type: "footerMessage", message: companyModel.ioe_footermessage });
    }

    return data;
  }, [companyModel, banners, topSales, sections, searchQuery]);

  const renderItem = ({ item }: any) => {
    switch (item.type) {
      case "banner":
        return <BannerCarousel banners={banners} />;
      case "headerMessage":
        return (
          <AnimatedText
            message={item.message}
            speed={0.05}
            style={styles.headerBlock}
            textStyle={styles.headerText}
          />
        );
      case "searchBar":
        return (
          <SearchBar
            query={searchQuery}
            setQuery={setSearchQuery}
            onSubmit={setSearchQuery}
          />
        );
      case "topSales":
        return <TopSalesSection title="Top Sales" items={item.items} />;
      case "section":
        return (
          <ProductSection
            key={item.key}
            title={item.title}
            items={item.items}
            category={item.title}
          />
        );
      case "footerMessage":
        return (
          <View style={styles.footerBlock}>
            <Text style={styles.footerText}>{item.message}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <FlatList
      data={flatListData}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.type + index}
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  searchContainer: {
    margin: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  headerBlock: {
    backgroundColor: "#e5e7eb",
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  headerText: {
    color: "#120e0e",
    fontSize: 16,
    fontWeight: "600",
  },
  footerBlock: {
    height: 50,
    backgroundColor: "#222222",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  footerText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default HomeScreen;
