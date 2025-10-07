// app/screens/profile/branding.tsx
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { applyBrandFilters } from "@/store/thunk/brandThunks";
import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BrandingScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const brands = useAppSelector((state) => state.brand.brands);
  const brandFilters = useAppSelector((state) => state.brand.selectedBrandFilters);
  const loading = useAppSelector((state) => state.company.loading);
  const error = useAppSelector((state) => state.company.error);
  const dispatch = useAppDispatch();

  // Local state mirrors redux filters initially
  const [localFilters, setLocalFilters] = useState<string[]>(brandFilters);

  // Keep in sync when redux updates (in case of navigation back/forward)
  useEffect(() => {
    setLocalFilters(brandFilters);
  }, [brandFilters]);

  const toggleBrandSelection = (brandId: string) => {
    setLocalFilters((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const renderBrandItem = (brand: { br_name: string; br_newname: string }) => {
    const isChecked = localFilters.includes(brand.br_name);
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

  const handleSave = () => {
    dispatch(applyBrandFilters(localFilters));
    console.log("Saved brand filters:", localFilters);
    router.back();
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom, backgroundColor: theme.background }]}>
      <Text style={styles.title}>Filter by Brand</Text>

      {loading && <Text style={styles.infoText}>Loading brands...</Text>}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {brands.length > 0 ? (
          brands.map((brand) => renderBrandItem(brand))
        ) : (
          <Text style={styles.infoText}>No brands available.</Text>
        )}
      </ScrollView>



      <Pressable style={styles.button} onPress={handleSave} >
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  scrollContainer: { paddingBottom: 20 },
  brandItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  checkboxIcon: { marginRight: 10 },
  brandText: { fontSize: 16, color: "#333" },
  infoText: { fontSize: 14, color: "#666", marginTop: 10 },
  errorText: { fontSize: 14, color: "red", marginTop: 10 },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  }
});
