import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Text style={styles.detail}>Name: John Doe</Text>
      <Text style={styles.detail}>Email: john.doe@example.com</Text>
      <Text style={styles.detail}>Address: 123 Main St, Anytown</Text>
      <Button
        title="Edit Profile"
        onPress={() => alert("Edit profile functionality")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
  },
});

export default ProfileScreen;
