import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface SearchBarProps {
    query: string;
    setQuery: (v: string) => void;
    onSubmit: (v: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = React.memo(
    ({ query, setQuery, onSubmit }) => {
        return (
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Search products..."
                    placeholderTextColor="#888"
                    value={query}
                    onChangeText={setQuery}
                    style={styles.searchInput}
                    autoCorrect={false}
                    autoCapitalize="none"
                    returnKeyType="search"
                    onSubmitEditing={() => onSubmit(query)} // 👈 trigger search on submit
                />
            </View>
        );
    }
);

const styles = StyleSheet.create({
    searchContainer: {
        margin: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    searchInput: {
        fontSize: 16,
        color: "#333",
    },
});

export default SearchBar;
