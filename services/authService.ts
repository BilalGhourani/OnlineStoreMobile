import { defaultConfig as config } from "@/config/config";
import { UserProfile } from "../types";

/**
 * Registers a new user with the backend API.
 * @param userData An object containing user registration details.
 * @returns A promise that resolves to the API response data (e.g., user profile).
 */
export const registerUser = async (userData: UserProfile): Promise<any> => {
  console.log(
    "API: Attempting to register user:",
    userData.ireg_email || userData.ireg_username
  );
  try {
    const response = await fetch(`${config.baseUrl}/in_online/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const responseData = await response.json(); // Always parse to get success/message

    if (!response.ok || responseData.success !== 1) {
      console.error(
        `HTTP error during registration: ${response.status} -`,
        responseData
      );
      // Throw an error with a more specific message from the API if available
      throw new Error(
        responseData.message ||
        `Registration failed with status: ${response.status}`
      );
    }

    console.log("Registration successful. Response data:", responseData);
    return responseData; // Return the full response data including the 'data' object
  } catch (error) {
    console.error("Error in registerUser:", error);
    throw error; // Re-throw the error for the calling component to handle
  }
};

/**
 * Authenticates a user with email and password.
 * @param username The user's email or username.
 * @param password The user's password.
 * @returns A promise that resolves to the API response data (e.g., user token, user info).
 */
export const loginUser = async (
  username: string,
  password: string
): Promise<any> => {
  console.log(`API: Attempting to log in user: ${username}`);
  try {
    const response = await fetch(`${config.baseUrl}/in_online/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json(); // Assuming error response is JSON
      console.error(`HTTP error during login: ${response.status} -`, errorBody);
      // Throw an error with a more specific message from the API if available
      throw new Error(
        errorBody.message || `Login failed with status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("Login successful. Response data:", data);
    return data;
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw error; // Re-throw the error for the calling component to handle
  }
};
