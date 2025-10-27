import MenuItem from "@/components/MenuItem";
import ThemeBottomSheet from "@/components/ThemeBottomSheet";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import { signOut } from "../../store/slices/authSlice";
import { useTheme } from "../../theme/ThemeProvider";

export default function ProfileScreen() {
  const userProfile = useAppSelector((state) => state.auth.userProfile);
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

  useEffect(() => {
    StatusBar.setBarStyle(isDarkTheme() ? "light-content" : "dark-content");
    StatusBar.setBackgroundColor(theme.statusBarBackground, true); // true = animated on Android
  }, [theme, colorScheme]);

  const applyTheme = () => {
    setTheme(selectedTheme);
    closeThemeModal();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.screenBackground, paddingBottom: tabBarHeight }]}>
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
      <View style={[styles.menuCard, { backgroundColor: theme.ProfileMenuCellBg, shadowColor: theme.ProfileMenuCellBg }]}>
        <MenuItem
          icon="cart-outline"
          label="Carts"
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
        <MenuItem
          icon="storefront-outline"
          label="Change Store"
          color={theme.text}
          onPress={handleChangeStore}
          showSeparator={true}
        />
        {/* Theme toggle */}
        <MenuItem
          icon="color-palette-outline"
          label="Theme"
          color={theme.text}
          onPress={openThemeModal}
          showSeparator={true}
        />
        {isLoggedIn ? (
          <MenuItem
            icon="log-out-outline"
            label="Log out"
            onPress={handleLogout}
            color="red"
            showSeparator={false}
          />
        ) : (
          <MenuItem
            icon="log-in-outline"
            label="Login"
            onPress={handleLogin}
            color="#007bff"
            showSeparator={false}
          />
        )}
      </View>

      {/* Theme Bottom Sheet */}
      <ThemeBottomSheet
        visible={showThemeModal}
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
        onApply={applyTheme}
        onClose={closeThemeModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 16 },
  profileSection: { alignItems: "center", marginBottom: 30 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 20, fontWeight: "600" },
  email: { fontSize: 14, marginTop: 4 },
  menuCard: {
    borderRadius: 12,
    elevation: 4,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    overflow: "hidden",
  }
});
