import SnackbarWithProgress from "@/components/SnackbarWithProgress";
import ReduxPersistProvider from "@/store/ReduxPersistProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setButtonStyleAsync } from "expo-navigation-bar";
import { useEffect, useState } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";
import store from "../store";
import { useAppSelector } from "../store/hooks";
import { hideSnackbar } from "../store/slices/snackbarSlice";

import CustomToolbar from "@/components/CustomToolbar";
import { Stack } from "expo-router";

export default function RootLayout() {
  useEffect(() => {
    StatusBar.setBarStyle("dark-content");
    const setNavBar = async () => {
      await setButtonStyleAsync("dark"); // light icons
    };
    setNavBar();
  }, []);

  return (
    <Provider store={store}>
      <ReduxPersistProvider>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </ReduxPersistProvider>
    </Provider>
  );
}

const AppContent = () => {
  const dispatch = useDispatch();
  const companyId = useAppSelector((state) => state.auth.companyId);
  const showSnackbar = useAppSelector((state) => state.snackbar.show);
  const showAsError = useAppSelector((state) => state.snackbar.isError);
  const snackbarMessage = useAppSelector((state) => state.snackbar.message);

  const [hasStore, setHasStore] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStoreKey = async () => {
      try {
        const savedCompanyId =
          companyId || (await AsyncStorage.getItem("companyId"));
        setHasStore(!!savedCompanyId);
      } catch (e) {
        setHasStore(false);
      }
    };
    checkStoreKey();
  }, [companyId]);

  if (hasStore === null) {
    // loading state
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {hasStore ? (
        // Main stack with Tabs + other screens
        <Stack screenOptions={{ headerShown: false, headerStyle: { height: 100 } }}>
          <Stack.Screen
            name="(tabs)" // folder for tabs
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screens/products/[item]"
            options={{
              headerShown: true,
              header: () => <CustomToolbar title="Product Details" showBack showCart titleAlign="left" />
            }}
          />
          <Stack.Screen
            name="screens/SectionProducts"
            options={({ route }) => ({
              headerShown: true,
              header: () => <CustomToolbar title={route.params?.name ?? "Section"} showBack showCart titleAlign="left" />
            })}
          />
          <Stack.Screen
            name="screens/cart"
            options={{
              headerShown: true,
              header: () => <CustomToolbar title="Carts" showBack titleAlign="left" />
            }}
          />
          <Stack.Screen
            name="screens/checkout"
            options={{
              headerShown: true,
              header: () => <CustomToolbar title="Checkout" showBack titleAlign="left" />
            }}
          />
          <Stack.Screen
            name="screens/addresses/index"
            options={{
              headerShown: true,
              header: () => <CustomToolbar title="Addresses" showBack titleAlign="left" />
            }}
          />
          <Stack.Screen
            name="screens/addresses/form"
            options={{
              headerShown: true,
              header: () => <CustomToolbar title="Manage Address" showBack titleAlign="left" />
            }}
          />
          <Stack.Screen
            name="screens/payment-summary"
            options={{
              headerShown: true,
              header: () => <CustomToolbar title="Payment Summary" showBack titleAlign="left" />
            }}
          />
          <Stack.Screen
            name="screens/login"
            options={{
              headerShown: true,
              header: () => <CustomToolbar title="Login" showBack titleAlign="left" />
            }}
          />
          <Stack.Screen
            name="screens/register"
            options={{
              headerShown: true,
              header: () => <CustomToolbar title="Register" showBack titleAlign="left" />
            }}
          />
          <Stack.Screen
            name="screens/BrandingScreen"
            options={{
              headerShown: true,
              header: () => <CustomToolbar title="Brands" showBack titleAlign="left" />
            }}
          />
          <Stack.Screen
            name="screens/StoreSearchScreen"
            options={{
              headerShown: true,
              header: () => <CustomToolbar title="Stores Center" showBack titleAlign="left" />
            }}
          />
        </Stack>
      ) : (
        // No store selected → only StoreSearch
        <Stack screenOptions={{ headerShown: true }}>
          <Stack.Screen
            name="screens/StoreSearchScreen"
            options={{
              header: () => <CustomToolbar title="Stores Center" titleAlign="center" />
            }}
          />
        </Stack>
      )}

      {showSnackbar && (
        <SnackbarWithProgress
          message={snackbarMessage}
          duration={3000}
          showProgress={showAsError != undefined}
          progressColor={showAsError ? "#ff000dff" : "#00ff88"}
          onClose={() => dispatch(hideSnackbar())}
        />
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
