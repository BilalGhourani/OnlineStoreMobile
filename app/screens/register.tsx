import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { registerUser } from "../../services/authService";
import { useAppSelector } from "../../store/hooks";
import { showSnackbar } from "../../store/slices/snackbarSlice";

export default function RegisterScreen() {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState(""); // Assuming username is separate from email
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const companyModel = useAppSelector((state) => state.company.companyModel);

  const [loadingAuth, setLoadingAuth] = useState(false);

  const showSnackBarMsg = (message: string) => {
    dispatch(showSnackbar({ message, isError: true }));
  };

  const validateForm = () => {
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone
    ) {
      setLocalError("All fields are required.");
      showSnackBarMsg("Please fill in all required fields.");
      return false;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      showSnackBarMsg("Password must be at least 6 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      showSnackBarMsg("Passwords do not match.");
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError("Please enter a valid email address.");
      showSnackBarMsg("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    setLocalError(null);
    if (!validateForm()) {
      return;
    }

    const userProfileData = {
      ireg_id: null,
      ireg_cmp_id: companyModel?.cmp_id ?? null,
      ireg_cu_id: companyModel?.cur_code ?? null,
      ireg_language: "A5C1001B-886F-466C-8A84-E31187EFD8FB",
      ireg_firstname: firstName,
      ireg_lastname: lastName,
      ireg_username: username,
      ireg_pass: password,
      ireg_email: email,
      ireg_emailverified: 1,
      ireg_phone1: phone,
      ireg_phone2: null,
      ireg_country: null,
      ireg_region: null,
      ireg_salt: null,
      ireg_regcountry: null,
      ireg_ip: null,
      ireg_userstamp: null,
      ireg_provideruid: null,
      ireg_provider: null,
    };

    try {
      setLoadingAuth(true);
      const response = await registerUser(userProfileData);
      setLoadingAuth(false);
      if (response.success == 1) {
        router.back(); // Go back to the previous screen (Login)
      } else {
        showSnackBarMsg(`Failed to Register: ${response.message.error}`);
      }
    } catch (error) {
      setLoadingAuth(false);
      showSnackBarMsg("Something went wrong,Please try again later.");
      console.error("Registration attempt failed in RegisterScreen:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingBottom: insets.bottom }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create Account</Text>

        {/* First Name Input with Icon */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={24}
            color="#888"
            style={styles.icon}
          />
          <TextInput
            style={styles.inputWithIcon}
            placeholder="First Name"
            placeholderTextColor="#999"
            autoCapitalize="words"
            value={firstName}
            onChangeText={setFirstName}
            editable={!loadingAuth}
          />
        </View>

        {/* Last Name Input with Icon */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={24}
            color="#888"
            style={styles.icon}
          />
          <TextInput
            style={styles.inputWithIcon}
            placeholder="Last Name"
            placeholderTextColor="#999"
            autoCapitalize="words"
            value={lastName}
            onChangeText={setLastName}
            editable={!loadingAuth}
          />
        </View>

        {/* Username Input with Icon */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="at-outline"
            size={24}
            color="#888"
            style={styles.icon}
          />
          <TextInput
            style={styles.inputWithIcon}
            placeholder="Username"
            placeholderTextColor="#999"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
            editable={!loadingAuth}
          />
        </View>

        {/* Email Input with Icon */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={24}
            color="#888"
            style={styles.icon}
          />
          <TextInput
            style={styles.inputWithIcon}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!loadingAuth}
          />
        </View>

        {/* Phone Number Input with Icon */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="call-outline"
            size={24}
            color="#888"
            style={styles.icon}
          />
          <TextInput
            style={styles.inputWithIcon}
            placeholder="Phone Number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            editable={!loadingAuth}
          />
        </View>

        {/* Password Input with Icon */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={24}
            color="#888"
            style={styles.icon}
          />
          <TextInput
            style={styles.inputWithIcon}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loadingAuth}
          />
        </View>

        {/* Confirm Password Input with Icon */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="checkmark-circle-outline"
            size={24}
            color="#888"
            style={styles.icon}
          />
          <TextInput
            style={styles.inputWithIcon}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!loadingAuth}
          />
        </View>

        {localError && <Text style={styles.errorText}>{localError}</Text>}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            {
              opacity: pressed ? 0.7 : 1, // Fade out slightly when pressed
            },
          ]}
          onPress={handleRegister}
          disabled={loadingAuth}
        >
          {loadingAuth ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.back()}>
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  // Updated styles for input with icon
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  icon: {
    paddingLeft: 15,
    paddingRight: 10,
  },
  inputWithIcon: {
    flex: 1, // Take up remaining space
    height: "100%", // Match container height
    fontSize: 16,
    color: "#333",
    paddingRight: 15, // Ensure text doesn't go under the icon if it were on the right
  },
  // Original input style (no longer directly used for text inputs with icons)
  input: {
    width: "100%",
    maxWidth: 400,
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
    width: "100%",
    maxWidth: 400,
    height: 50,
    backgroundColor: "#28a745",
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
  loginText: {
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
    width: "100%",
    maxWidth: 400,
  },
});
