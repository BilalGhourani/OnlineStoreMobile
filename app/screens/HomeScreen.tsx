import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";

import SearchBar from "@/components/SearchBar";
import AnimatedText from "../../components/home/AnimatedText";
import BannerCarousel from "../../components/home/BannerCarousel";
import ProductSection from "../../components/home/ProductSection";
import TopSalesSection from "../../components/home/TopSalesSection";

import BannerShimmer from "@/components/shimmers/BannerShimmer";
import ProductSectionShimmer from "@/components/shimmers/ProductSectionShimmer";
import TopSalesShimmer from "@/components/shimmers/TopSalesShimmer";

import { useTheme } from "@/theme/ThemeProvider";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchBrands } from "../../store/slices/brandSlice";
import { fetchCompanyById } from "../../store/slices/companySlice";
import { fetchFamilies } from "../../store/slices/familySlice";
import { fetchItems } from "../../store/slices/itemSlice";
import { showSnackbar } from "../../store/slices/snackbarSlice";
import { useDebounce } from "../../store/useDebounce";

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const { theme, isDarkTheme } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();

  const companyId = useAppSelector((state) => state.auth.companyId);
  const companyModel = useAppSelector((state) => state.company.companyModel);
  const banners = useAppSelector((state) => state.company.banners);
  const topSales = useAppSelector((state) => state.item.topSales);
  const sections = useAppSelector((state) => state.item.sections);
  const filters = useAppSelector((state) => state.brand.selectedBrandFilters);

  const companyLoading = useAppSelector((state) => state.company.loading);
  const itemLoading = useAppSelector((state) => state.item.loading);

  const error = useAppSelector((state) => state.company.error);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  useFocusEffect(
    useCallback(() => {
      // Set status bar to transparent when entering the screen

      StatusBar.setBackgroundColor('transparent');
      StatusBar.setBarStyle(isDarkTheme() ? 'light-content' : 'dark-content');

      // Optional: return a cleanup function to reset when leaving
      return () => {
        StatusBar.setBackgroundColor(theme.statusBarBackground); // default app theme color
        StatusBar.setBarStyle(isDarkTheme() ? 'light-content' : 'dark-content'); // default style
      };
    }, [])
  );

  // Fetch company and data
  useEffect(() => {
    if (companyId) {
      dispatch(fetchCompanyById(companyId));
      dispatch(fetchItems({ cmpId: companyId, brandIds: filters, searchKey: `` }));
      dispatch(fetchFamilies(companyId));
      dispatch(fetchBrands(companyId));
    }
  }, [companyId]);

  // Fetch items on search
  useEffect(() => {
    if (companyId) {
      dispatch(
        fetchItems({
          cmpId: companyId,
          brandIds: filters,
          searchKey: debouncedSearch,
        })
      );
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (error) {
      dispatch(
        showSnackbar({
          message: "An error has occurred while loading your items...",
          isError: true,
        })
      );
    }
  }, [error]);

  // Build FlatList rows
  const flatListData = useMemo(() => {
    const data: { type: string;[key: string]: any }[] = [];

    data.push({ type: "banner" });

    if (companyModel?.ioe_headermessage) {
      data.push({ type: "headerMessage", message: companyModel.ioe_headermessage });
    }

    data.push({ type: "searchBar" });

    if (topSales.length > 0 || itemLoading) {
      data.push({ type: "topSales", items: topSales });
    }

    if (sections.length > 0 || itemLoading) {
      sections.forEach((section, index) => {
        data.push({
          type: "section",
          id: section.fa_name,
          title: section.fa_newname,
          items: section.items,
          key: section.fa_name || `section-${index}`,
        });
      });
    }

    if (companyModel?.ioe_footermessage) {
      data.push({ type: "footerMessage", message: companyModel.ioe_footermessage });
    }

    return data;
  }, [companyModel, banners, topSales, sections, itemLoading]);

  // Render each row depending on loading state
  const renderItem = ({ item }: any) => {
    switch (item.type) {
      case "banner":
        return companyLoading ? <BannerShimmer /> : <BannerCarousel banners={banners} />;

      case "headerMessage":
        return (
          <AnimatedText
            message={item.message}
            speed={0.05}
            style={[styles.headerBlock, { backgroundColor: theme.card }]}
            textStyle={[styles.headerText, { color: theme.text }]}
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
        return itemLoading ? (
          <TopSalesShimmer />
        ) : (
          <TopSalesSection title="Top Sales" items={item.items} />
        );

      case "section":
        return itemLoading ? (
          <ProductSectionShimmer />
        ) : (
          <ProductSection
            id={item.id}
            key={item.key}
            title={item.title}
            items={item.items}
            category={item.title}
          />
        );

      case "footerMessage":
        return (
          <View style={[styles.footerBlock, { backgroundColor: theme.homeFooterMessageBg }]}>
            <Text style={[styles.footerText, { color: theme.white }]}>{item.message}</Text>
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
      style={[styles.container, { backgroundColor: theme.screenBackground }]}
      contentContainerStyle={{ paddingBottom: 10 + tabBarHeight }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  footerText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default HomeScreen;
