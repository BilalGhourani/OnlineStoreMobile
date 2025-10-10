import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/theme/ThemeProvider";
import { CategoryModel, FamilyModel } from "@/types/familyModel";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
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
    const { theme } = useTheme();
    const tabBarHeight = useBottomTabBarHeight();
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
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded((prev) =>
            prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        );
    };

    const navigateToCategory = (family: FamilyModel) => {
        router.push({
            pathname: "/screens/SectionProducts",
            params: { id: family.fa_name, name: family.fa_newname },
        });
    };

    if (loading) return <Text style={[styles.infoText, { color: theme.text }]}>Loading categories...</Text>;
    if (error) return <Text style={[styles.errorText]}>{error}</Text>;
    if (!categories.length) return <Text style={[styles.infoText, { color: theme.text }]}>No categories available.</Text>;

    const renderParentCategory = ({ item }: { item: CategoryModel }) => {
        const isExpanded = expanded.includes(item.rawFamilyModel.fa_name);

        return (
            <View style={[styles.card, { backgroundColor: theme.CetegoryExpandableCellBg, borderColor: theme.border }]}>
                {/* Parent Header */}
                <TouchableOpacity
                    style={styles.parentHeader}
                    onPress={() => toggleExpand(item.rawFamilyModel.fa_name)}
                >
                    <Text style={[styles.parentName, { color: theme.text }]}>
                        {item.rawFamilyModel.fa_newname}
                    </Text>
                    <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={22}
                        color={theme.text}
                        style={{ marginRight: 8 }}
                    />
                </TouchableOpacity>

                {/* Expandable Subcategories */}
                {isExpanded && (
                    <View style={[styles.subcategoriesContainer, { backgroundColor: theme.CetegorySubCellBg }]}>
                        {item.subcategories?.map((sub) => (
                            <Pressable
                                key={sub.rawFamilyModel.fa_name}
                                style={[
                                    styles.subcategoryBox,
                                    { backgroundColor: theme.screenBackground, borderColor: theme.border },
                                ]}
                                onPress={() => navigateToCategory(sub.rawFamilyModel)}
                            >
                                <Text style={[styles.subcategoryText, { color: theme.text }]}>
                                    {sub.rawFamilyModel.fa_newname}
                                </Text>
                                <Ionicons
                                    name="chevron-forward"
                                    size={18}
                                    color={theme.text}
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
        <View style={[styles.container, { backgroundColor: theme.screenBackground, paddingBottom: tabBarHeight }]}>
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
    container: { flex: 1 },

    card: {
        borderRadius: 12,
        marginBottom: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        overflow: "hidden",
        borderWidth: 1,
    },

    parentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
    },

    parentName: { fontSize: 18, fontWeight: "600" },

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
        borderRadius: 10,
        paddingVertical: 16,
        paddingHorizontal: 20,
        minWidth: "90%",
        justifyContent: "space-between",
    },

    subcategoryText: {
        fontSize: 16,
        fontWeight: "500",
    },

    infoText: {
        fontSize: 16,
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
