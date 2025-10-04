import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { signOut } from "../../store/slices/authSlice";

export default function ProfileScreen() {
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const isLoggedIn = userProfile != null;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(signOut());
  };

  const handleLogin = () => {
    router.push("/screens/login");
  };

  const handleChangeStore = () => {
    router.push("/screens/StoreSearchScreen");
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={require("../../assets/images/profile-placeholder.png")}
          style={styles.profileImage}
        />
        <Text style={styles.name}>
          {isLoggedIn
            ? `${userProfile?.ireg_firstname} ${userProfile?.ireg_lastname}`
            : "Guest User"}
        </Text>
        <Text style={styles.email}>
          {isLoggedIn ? userProfile?.ireg_email : "guest@example.com"}
        </Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        {/* Carts */}
        <MenuItem
          icon="cart-outline"
          label="Carts"
          onPress={() => router.push("/screens/cart")}
        />

        {/* Brands */}
        <MenuItem
          icon="pricetags-outline"
          label="Brands"
          onPress={() => router.push("/screens/BrandingScreen")}
        />

        {/* Change Store */}
        <MenuItem
          icon="storefront-outline"
          label="Change Store"
          onPress={handleChangeStore}
        />

        {/* Login / Logout */}
        {isLoggedIn ? (
          <MenuItem
            icon="log-out-outline"
            label="Log out"
            onPress={handleLogout}
            color="red"
          />
        ) : (
          <MenuItem
            icon="log-in-outline"
            label="Login"
            onPress={handleLogin}
            color="#007bff"
          />
        )}
      </View>
    </View>
  );
}

function MenuItem({ icon, label, onPress, color = "#333" }) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuRow}>
        <Ionicons name={icon} size={22} color={color} style={styles.menuIcon} />
        <Text style={[styles.menuLabel, { color }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // light theme
    paddingTop: 40,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  menu: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    marginRight: 15,
  },
  menuLabel: {
    fontSize: 16,
    color: "#333",
  },
});
