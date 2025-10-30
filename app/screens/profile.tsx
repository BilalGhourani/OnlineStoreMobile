import CompanyMenuItem from "@/components/CompanyMenuItem";
import MenuItem from "@/components/MenuItem";
import ThemeBottomSheet from "@/components/ThemeBottomSheet";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import { signOut } from "../../store/slices/authSlice";
import { useTheme } from "../../theme/ThemeProvider";

export default function ProfileScreen() {
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const companyModel = useAppSelector((state) => state.company.companyModel);
  const cartCount = useAppSelector((state) => state.cart.cartItems.length)
  const isLoggedIn = userProfile != null;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const tabBarHeight = useBottomTabBarHeight();
  const { theme, colorScheme, setTheme, isDarkTheme } = useTheme();
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(colorScheme);

  const handleLogout = () => dispatch(signOut());
  const handleLogin = () => router.push("/screens/login");
  const handleChangeStore = () => router.push("/screens/StoreSearchScreen");

  const openThemeModal = () => setShowThemeModal(true);
  const closeThemeModal = () => setShowThemeModal(false);

  let currentThemeLabel = "System Default";

  if (selectedTheme === "light") {
    currentThemeLabel = "Light";
  } else if (selectedTheme === "dark") {
    currentThemeLabel = "Dark";
  }

  let website = companyModel?.cmp_web ?? `https://web.gridsweb.com:9008/?store=${companyModel?.ioe_storename}`

  useEffect(() => {
    StatusBar.setBarStyle(isDarkTheme() ? "light-content" : "dark-content");
    StatusBar.setBackgroundColor(theme.statusBarBackground, true); // true = animated on Android
  }, [theme, colorScheme]);

  const applyTheme = () => {
    setTheme(selectedTheme);
    closeThemeModal();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.screenBackground }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: tabBarHeight, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={require("../../assets/images/profile-placeholder.png")}
            style={styles.profileImage}
          />
          <Text style={[styles.name, { color: theme.text }]}>
            {isLoggedIn
              ? `${userProfile?.ireg_firstname} ${userProfile?.ireg_lastname}`
              : "Guest User"}
          </Text>
          <Text style={[styles.email, { color: theme.text }]}>
            {isLoggedIn ? userProfile?.ireg_email : "guest@example.com"}
          </Text>
        </View>

        {/* Menu Card */}
        <View style={[styles.menuCard, { backgroundColor: theme.ProfileMenuCellBg, shadowColor: theme.ProfileMenuCellBg, borderColor: theme.menuBorder }]}>
          <CompanyMenuItem
            storeName={companyModel?.cmp_name}
            address={companyModel?.cmp_address}
            phone={companyModel?.cmp_phone}
            email={companyModel?.cmp_email}
            web={website}
          />
          <MenuItem
            icon="storefront-outline"
            label="Change Store"
            rightLabel={companyModel?.ioe_storename ?? "No Store"}
            color={theme.text}
            onPress={handleChangeStore}
            showSeparator={true}
          />
          <MenuItem
            icon="cart-outline"
            label="Carts"
            rightLabel={`${cartCount} item${cartCount !== 1 ? "s" : ""}`}
            color={theme.text}
            onPress={() => router.push("/screens/cart")}
            showSeparator={true}
          />
          <MenuItem
            icon="pricetags-outline"
            label="Brands"
            color={theme.text}
            onPress={() => router.push("/screens/BrandingScreen")}
            showSeparator={true}
          />
          {/* Theme toggle */}
          <MenuItem
            icon="color-palette-outline"
            label="Theme"
            rightLabel={currentThemeLabel}
            color={theme.text}
            onPress={openThemeModal}
            showSeparator={true}
          />
          {isLoggedIn ? (
            <MenuItem
              icon="log-out-outline"
              label="Log out"
              onPress={handleLogout}
              color={theme.text}
              showSeparator={false}
            />
          ) : (
            <MenuItem
              icon="log-in-outline"
              label="Login"
              onPress={handleLogin}
              color={theme.text}
              showSeparator={false}
            />
          )}
        </View>
      </ScrollView>


      {/* Theme Bottom Sheet */}
      <ThemeBottomSheet
        visible={showThemeModal}
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
        onApply={applyTheme}
        onClose={closeThemeModal}
      />
    </View >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10, paddingHorizontal: 10 },
  profileSection: { alignItems: "center", marginBottom: 30 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 20, fontWeight: "600" },
  email: { fontSize: 14, marginTop: 4 },
  menuCard: {
    borderRadius: 12,
    elevation: 10,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderWidth: 1,
    overflow: "hidden",
  },
  bottomIconsRow: {
    position: "absolute",
    bottom: 0,
    end: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    gap: 24,
    paddingVertical: 16,
  },
  storeName: {
    fontSize: 12,
    fontWeight: "600",
    flexShrink: 1, // in case the name is long 
  },
});
