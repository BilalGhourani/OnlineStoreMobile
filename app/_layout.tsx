import BackButton from "@/components/BackButton";
import DrawerContent from "@/components/DrawerContent";
import HeaderIcons from "@/components/HeaderIcons";
import SnackbarWithProgress from "@/components/SnackbarWithProgress";
import ReduxPersistProvider from "@/store/ReduxPersistProvider";
import { setBackgroundColorAsync, setButtonStyleAsync } from "expo-navigation-bar";
import Drawer from "expo-router/drawer";
import { useEffect } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";
import store from "../store";
import { useAppSelector } from "../store/hooks";
import { hideSnackbar } from "../store/slices/snackbarSlice";

export default function RootLayout() {
  useEffect(() => {
    StatusBar.setBarStyle("dark-content");

    // Android bottom nav bar
    const setNavBar = async () => {
      await setBackgroundColorAsync("#000"); // black background
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

// This component is responsible for displaying the loader or the main app stack
const AppContent = () => {
  const dispatch = useDispatch();
  const showSnackbar = useAppSelector((state) => state.snackbar.show);
  const showAsError = useAppSelector((state) => state.snackbar.isError);
  const snackbarMessage = useAppSelector((state) => state.snackbar.message);
  return (
    <GestureHandlerRootView style={styles.container}>
      <Drawer
        screenOptions={{
          headerShown: true,
        }}
        drawerContent={(props) => <DrawerContent {...props} />}
      >

        <Drawer.Screen
          name="screens/HomeScreen"
          options={{
            title: "Online Store",
            headerRight: () => (<HeaderIcons />)
          }}
        />

        <Drawer.Screen
          name="index"
          options={{ drawerItemStyle: { display: "none" }, title: "Online Store" }}
        />

        <Drawer.Screen
          name="screens/profile"
          options={{ drawerItemStyle: { display: "none" }, title: "Profile", headerLeft: () => <BackButton /> }}
        />

        <Drawer.Screen
          name="screens/products/[item]"
          options={{
            drawerItemStyle: { display: "none" },
            headerLeft: () => <BackButton />,
            title: "Product Details",
            headerRight: () => (<HeaderIcons />)
          }}
        />
        <Drawer.Screen
          name="screens/sections/[name]"
          options={({ route }) => ({
            drawerItemStyle: { display: "none" },
            headerLeft: () => <BackButton />,
            headerTitle: route.params?.name ?? "Section",
            headerRight: () => (<HeaderIcons />)
          })}
        />
        <Drawer.Screen
          name="screens/cart"
          options={{
            drawerItemStyle: { display: "none" },
            title: "Carts",
            headerLeft: () => <BackButton />
          }}
        />
        <Drawer.Screen
          name="screens/checkout"
          options={{
            drawerItemStyle: { display: "none" },
            title: "Checkout",
            headerLeft: () => <BackButton />
          }}
        />
        <Drawer.Screen
          name="screens/addresses/index"
          options={{
            drawerItemStyle: { display: "none" },
            title: "Addresses",
            headerLeft: () => <BackButton />
          }}
        />
        <Drawer.Screen
          name="screens/addresses/form"
          options={{
            drawerItemStyle: { display: "none" },
            title: "Manage Address",
            headerLeft: () => <BackButton />
          }}
        />
        <Drawer.Screen
          name="screens/payment-summary"
          options={{
            drawerItemStyle: { display: "none" },
            title: "Payment Summary",
            headerLeft: () => <BackButton />
          }}
        />
        <Drawer.Screen
          name="screens/login"
          options={{
            drawerItemStyle: { display: "none" },
            title: "Login",
            headerLeft: () => (<BackButton />)
          }}
        />
        <Drawer.Screen
          name="screens/register"
          options={{
            drawerItemStyle: { display: "none" },
            title: "Register",
            headerLeft: () => <BackButton />
          }}
        />
      </Drawer>

      {
        showSnackbar && (
          <SnackbarWithProgress
            message={snackbarMessage}
            duration={3000}
            progressColor={showAsError ? "#ff000dff" : "#00ff88"}
            onClose={() => dispatch(hideSnackbar())}
          />
        )
      }
    </GestureHandlerRootView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
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
});

