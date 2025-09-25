// src/app/login.tsx

import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { loginUser } from "../../services/authService";
import { useAppSelector } from "../../store/hooks";
import { signIn } from "../../store/slices/authSlice";
import { showSnackbar } from "../../store/slices/snackbarSlice";

export default function LoginScreen() {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);

  const isLoggedIn = useAppSelector((state) => state.auth.userProfile != null);

  const showSnackBarMsg = (message: string, isError: boolean = true) => {
    dispatch(showSnackbar({ message, isError }));
  };

  // Effect to navigate away if already logged in (e.g., after successful login)
  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/screens/HomeScreen");
    }
  }, [isLoggedIn, router]);

  const handleLogin = async () => {
    setLocalError(null); // Clear previous local errors
    if (!email || !password) {
      setLocalError("Please enter both email and password.");
      showSnackBarMsg("Please enter both email and password.");
      return;
    }

    try {
      setLoadingAuth(true);
      const response = await loginUser(email, password);
      setLoadingAuth(false);
      const loggedUser = response.data;
      if (response.success == 1 && loggedUser != null && loggedUser) {
        dispatch(signIn(loggedUser));
        showSnackBarMsg("Logged in successfully!", false);
        router.back(); // Go back to the previous screen (e.g., Home)
      } else {
        showSnackBarMsg(`Failed to Login: ${response.message.error}`);
      }
    } catch (error) {
      // Errors are caught and set in AuthCartContext, which then updates authError and localError.
      setLoadingAuth(false);
      showSnackBarMsg("Something went wrong,Please try again later.");
      console.error("Login attempt failed in LoginScreen:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingBottom: insets.bottom }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>Welcome Back!</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!loadingAuth} // Disable input during loading
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loadingAuth} // Disable input during loading
      />

      {localError && <Text style={styles.errorText}>{localError}</Text>}

      <Pressable
        style={({ pressed }) => [
          styles.button,
          {
            opacity: pressed ? 0.7 : 1, // Fade out slightly when pressed
          },
        ]}
        onPress={handleLogin}
        disabled={loadingAuth} // Disable button during loading
      >
        {loadingAuth ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </Pressable>

      {/* <TouchableOpacity
        onPress={() =>
          showSnackBarMsg(
            "Forgot Password functionality coming soon!"
          )
        }
      >
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity> */}

      <TouchableOpacity onPress={() => router.push("/screens/register")}>
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center", // Center content horizontally
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#333",
  },
  input: {
    width: "100%", // Take full width
    maxWidth: 400, // Max width for larger screens
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    width: "100%", // Take full width
    maxWidth: 400, // Max width for larger screens
    height: 50,
    backgroundColor: "#007bff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPassword: {
    marginTop: 20,
    textAlign: "center",
    color: "#007bff",
    fontSize: 16,
  },
  signUpText: {
    marginTop: 15,
    textAlign: "center",
    color: "#007bff",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
    fontSize: 14,
  },
});
