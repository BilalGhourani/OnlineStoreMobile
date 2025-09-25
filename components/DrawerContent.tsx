import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { useAppSelector } from "../store/hooks";
import { signOut } from "../store/slices/authSlice";
import { applyBrandFilters } from "../store/thunk/brandThunks";
import { BrandModel } from "../types/brandModel";
import { CategoryModel } from "../types/familyModel";

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface CustomDrawerContentProps {
  navigation: any;
  state: any;
  descriptors: any;
}

const DrawerContent: React.FC<CustomDrawerContentProps> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const isLoggedIn = userProfile != null;
  const categories = useAppSelector((state) => state.family.categories);
  const brands = useAppSelector((state) => state.brand.brands);
  const brandFilters = useAppSelector(
    (state) => state.brand.selectedBrandFilters
  );
  const loading = useAppSelector((state) => state.company.loading);
  const error = useAppSelector((state) => state.company.error);

  // State for expanding/collapsing global sections (e.g., 'categories', 'brands')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  // State for expanding/collapsing individual categories (nested)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const toggleSection = (sectionKey: string) => {
    LayoutAnimation.easeInEaseOut();
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionKey)) {
        newSet.delete(sectionKey);
      } else {
        newSet.add(sectionKey);
      }
      return newSet;
    });
  };

  const toggleCategory = (categoryId: string) => {
    LayoutAnimation.easeInEaseOut();
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const navigateToCategory = (categoryId: string, categoryName: string) => {
    props.navigation.closeDrawer(); // Close the drawer first
    // Navigate to the ONLY category listing screen, which is the paginated /all view
    toggleCategory(categoryId);
    router.push(`/screens/sections/${categoryName}`);
  };

  // Recursive function to render categories and subcategories
  const renderCategory = (category: CategoryModel, level: number = 0) => {
    // Assuming Category type has 'id' and 'name' directly, as transformed by buildCategoryTree
    const isExpanded = expandedCategories.has(category.rawFamilyModel.fa_name);
    const hasSubcategories =
      category.subcategories && category.subcategories.length > 0;
    const paddingLeft = 15 + level * 20;

    return (
      <View key={category.rawFamilyModel.fa_name}>
        <Pressable
          style={[styles.categoryItem, { paddingLeft: paddingLeft }]}
          onPress={() =>
            hasSubcategories
              ? toggleCategory(category.rawFamilyModel.fa_name)
              : navigateToCategory(
                category.rawFamilyModel.fa_name,
                category.rawFamilyModel.fa_newname
              )
          }
        >
          <Text style={styles.categoryText}>
            {category.rawFamilyModel.fa_newname}
          </Text>
          {hasSubcategories && (
            <Ionicons
              name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
              size={18}
              color="#555"
            />
          )}
        </Pressable>
        {isExpanded && hasSubcategories && (
          <View style={styles.subcategoriesContainer}>
            {category.subcategories?.map((subCat) =>
              renderCategory(subCat, level + 1)
            )}
          </View>
        )}
      </View>
    );
  };

  const toggleBrandSelection = useCallback(
    (brandId: string) => {
      let newSelectedBrands: string[];
      if (brandFilters.includes(brandId)) {
        console.log(`Remove brandId ${brandId}`);
        newSelectedBrands = brandFilters.filter((id) => id !== brandId);
      } else {
        console.log(`Add brandId ${brandId}`);
        newSelectedBrands = [...brandFilters, brandId];
      }
      dispatch(applyBrandFilters(newSelectedBrands));
    },
    [brandFilters, applyBrandFilters]
  );

  const renderBrandItem = (brand: BrandModel) => {
    const isChecked = brandFilters.includes(brand.br_name);
    return (
      <Pressable
        key={brand.br_name}
        style={styles.brandItem}
        onPress={() => toggleBrandSelection(brand.br_name)}
      >
        <Ionicons
          name={isChecked ? "checkbox-outline" : "square-outline"}
          size={24}
          color={isChecked ? "#007bff" : "#555"}
          style={styles.checkboxIcon}
        />
        <Text style={styles.brandText}>{brand.br_newname}</Text>
      </Pressable>
    );
  };

  const handleLogout = () => {
    dispatch(signOut());
    console.log("You have been logged out.");
    props.navigation.closeDrawer();
  };

  // Helper to render expandable sections
  const renderExpandableSection = (
    key: string,
    title: string,
    content: React.ReactNode
  ) => {
    const isSectionExpanded = expandedSections.has(key);
    return (
      <View style={styles.expandableSectionContainer}>
        <Pressable
          style={styles.expandableSectionHeader}
          onPress={() => toggleSection(key)}
        >
          <Text style={styles.expandableSectionTitle}>{title}</Text>
          <Ionicons
            name={
              isSectionExpanded ? "chevron-up-outline" : "chevron-down-outline"
            }
            size={24}
            color="#333"
          />
        </Pressable>
        {isSectionExpanded && (
          <View style={styles.expandableSectionContent}>{content}</View>
        )}
      </View>
    );
  };

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      {/* User Header Section */}
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={60} color="#333" />
        <Text style={styles.userName}>
          {isLoggedIn
            ? `${userProfile?.ireg_firstname} ${userProfile?.ireg_lastname}`
            : "Guest User"}
        </Text>
        <Text style={styles.userEmail}>
          {isLoggedIn ? userProfile?.ireg_email : "Not logged in"}
        </Text>
      </View>

      {/* Default Drawer Items (e.g., Home, Cart) */}
      <DrawerItemList {...props} />

      {/* Categories Expandable Section */}
      {renderExpandableSection(
        "categories",
        "Shop By Category",
        loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007bff" />
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Error loading categories: {error}
            </Text>
          </View>
        ) : categories.length > 0 ? (
          categories.map((cat) => renderCategory(cat))
        ) : (
          <Text style={styles.noItemsText}>No categories available.</Text>
        )
      )}

      {/* Brands Expandable Section */}
      {renderExpandableSection(
        "brands",
        "Filter by Brand",
        loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007bff" />
            <Text style={styles.loadingText}>Loading brands...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error loading brands: {error}</Text>
          </View>
        ) : brands.length > 0 ? ( // Use brands directly from context
          brands.map((brand) => renderBrandItem(brand))
        ) : (
          <Text style={styles.noItemsText}>No brands available.</Text>
        )
      )}

      {/* Login/Logout Button */}
      {isLoggedIn ? (
        <DrawerItem
          label="Logout"
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          )}
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      ) : (
        <DrawerItem
          label="Login"
          icon={({ color, size }) => (
            <Ionicons name="log-in-outline" size={size} color={color} />
          )}
          onPress={() => {
            props.navigation.closeDrawer();
            router.push("/screens/login");
          }}
          style={styles.loginButton}
        />
      )}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  // New styles for expandable sections
  expandableSectionContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  expandableSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#f0f0f0", // Light background for header
    borderRadius: 5,
    marginBottom: 5,
  },
  expandableSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  expandableSectionContent: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "#f8f8f8", // Slightly different background for content
  },
  // Existing category styles
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingRight: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  categoryText: {
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
  },
  subcategoriesContainer: {
    backgroundColor: "#f0f0f0",
  },
  noItemsText: {
    // Renamed from noCategoriesText to be more generic
    paddingHorizontal: 15,
    color: "#777",
    fontSize: 14,
    paddingVertical: 10,
  },
  // New styles for brands
  brandItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  checkboxIcon: {
    marginRight: 10,
  },
  brandText: {
    fontSize: 16,
    color: "#555",
  },
  // Loading/Error styles
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#555",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  // Login/Logout styles
  logoutButton: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  loginButton: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
});

export default DrawerContent;
