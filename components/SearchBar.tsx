import React from "react";
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface SearchBarProps {
    query: string;
    setQuery: (v: string) => void;
    onSubmit: (v: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = React.memo(
    ({ query, setQuery, onSubmit }) => {
        return (
            <View style={styles.searchContainer}>
                {/* Leading search icon */}
                <Ionicons
                    name="search-outline"
                    size={20}
                    color="#888"
                    style={styles.leadingIcon}
                />

                <TextInput
                    placeholder="Search products..."
                    placeholderTextColor="#888"
                    value={query}
                    onChangeText={setQuery}
                    style={styles.searchInput}
                    autoCorrect={false}
                    autoCapitalize="none"
                    returnKeyType="search"
                    onSubmitEditing={() => onSubmit(query)}
                />

                {/* Clear icon */}
                {query.length > 0 && (
                    <TouchableOpacity onPress={() => setQuery("")} style={styles.clearIcon}>
                        <Ionicons name="close-circle" size={18} color="#888" />
                    </TouchableOpacity>
                )}
            </View>
        );
    }
);

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        margin: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    leadingIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    clearIcon: {
        marginLeft: 8,
    },
});

export default SearchBar;
