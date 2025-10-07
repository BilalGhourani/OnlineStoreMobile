import { useTheme } from "@/theme/ThemeProvider";
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
        const { theme } = useTheme();
        return (
            <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                {/* Leading search icon */}
                <Ionicons
                    name="search-outline"
                    size={20}
                    color={theme.placeHolder}
                    style={styles.leadingIcon}
                />

                <TextInput
                    placeholder="Search products..."
                    placeholderTextColor={theme.placeHolder}
                    value={query}
                    onChangeText={setQuery}
                    style={[styles.searchInput, { color: theme.text }]}
                    autoCorrect={false}
                    autoCapitalize="none"
                    returnKeyType="search"
                    onSubmitEditing={() => onSubmit(query)}
                />

                {/* Clear icon */}
                {query.length > 0 && (
                    <TouchableOpacity onPress={() => setQuery("")} style={styles.clearIcon}>
                        <Ionicons name="close-circle" size={18} color={theme.placeHolder} />
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
