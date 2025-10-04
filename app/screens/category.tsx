import { useAppSelector } from "@/store/hooks";
import { CategoryModel } from "@/types/familyModel";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    LayoutAnimation,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CategoryScreen() {
    const categories = useAppSelector((state) => state.family.categories);
    const loading = useAppSelector((state) => state.company.loading);
    const error = useAppSelector((state) => state.company.error);
    const router = useRouter();
    const [expanded, setExpanded] = useState<string[]>([]);

    useEffect(() => {
        if (categories.length > 0) {
            setExpanded(categories.slice(0, 3).map((c) => c.rawFamilyModel.fa_name));
        }
    }, [categories]);

    const toggleExpand = (name: string) => {
        // Animate layout changes
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        setExpanded((prev) =>
            prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        );
    };

    const navigateToCategory = (categoryName: string) => {
        router.push(`/screens/sections/${categoryName}`);
    };

    if (loading) return <Text style={styles.infoText}>Loading categories...</Text>;
    if (error) return <Text style={styles.errorText}>{error}</Text>;
    if (!categories.length)
        return <Text style={styles.infoText}>No categories available.</Text>;

    const renderParentCategory = ({ item }: { item: CategoryModel }) => {
        const isExpanded = expanded.includes(item.rawFamilyModel.fa_name);

        return (
            <View style={styles.card}>
                {/* Parent Header */}
                <TouchableOpacity
                    style={styles.parentHeader}
                    onPress={() => toggleExpand(item.rawFamilyModel.fa_name)}
                >
                    <Text style={styles.parentName}>{item.rawFamilyModel.fa_newname}</Text>
                    <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={22}
                        color="#fff"
                        style={{ marginRight: 8 }}
                    />
                </TouchableOpacity>

                {/* Expandable Subcategories */}
                {isExpanded && (
                    <View style={styles.subcategoriesContainer}>
                        {item.subcategories?.map((sub) => (
                            <Pressable
                                key={sub.rawFamilyModel.fa_name}
                                style={styles.subcategoryBox}
                                onPress={() => navigateToCategory(sub.rawFamilyModel.fa_newname)}
                            >
                                <Text style={styles.subcategoryText}>
                                    {sub.rawFamilyModel.fa_newname}
                                </Text>
                                <Ionicons
                                    name="chevron-forward"
                                    size={18}
                                    color="#333"
                                    style={{ marginLeft: 6 }}
                                />
                            </Pressable>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={categories}
                renderItem={renderParentCategory}
                keyExtractor={(item) => item.rawFamilyModel.fa_name}
                contentContainerStyle={{ padding: 15 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    card: {
        backgroundColor: "#205454ff",
        borderRadius: 12,
        marginBottom: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        overflow: "hidden",
    },

    parentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
    },

    parentName: { fontSize: 18, fontWeight: "600", color: "#fff" },

    subcategoriesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 12,
        gap: 12,
    },

    subcategoryBox: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#205454ff",
        borderRadius: 10,
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: "#f8fafc",
        minWidth: "90%",
        justifyContent: 'space-between'
    },

    subcategoryText: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },

    infoText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginTop: 20,
    },
    errorText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
});
