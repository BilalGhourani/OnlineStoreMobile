import SearchBar from "@/components/SearchBar";
import { useDebounce } from "@/store/useDebounce";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import StoreCell from "../../components/StoreCell";
import { AppDispatch, RootState } from "../../store";
import { searchForCompany } from "../../store/slices/companySlice";
import type { CompanyModel } from "../../types/companyModel";

const StoreSearchScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const insets = useSafeAreaInsets();
    const { companies = [], loading = false, error = null } = useSelector(
        (state: RootState) => state.company
    );

    const [search, setSearch] = useState<string>("");
    const [searched, setSearched] = useState<boolean>(false);

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        const q = debouncedSearch.trim();
        if (q.length > 0) {
            dispatch(searchForCompany(q));
            setSearched(true);
        } else {
            setSearched(false);
        }
    }, [debouncedSearch, dispatch]);

    return (
        <KeyboardAvoidingView
            style={[styles.container, { paddingBottom: insets.bottom }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <SearchBar
                query={search}
                setQuery={setSearch}
                onSubmit={(val) => {
                    const q = val.trim();
                    if (q.length > 0) {
                        dispatch(searchForCompany(q));
                        setSearched(true);
                        Keyboard.dismiss();
                    }
                }}
            />

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" />
                </View>
            ) : !error && companies.length === 0 ? (
                <View style={styles.centered}>
                    <Image
                        source={require("../../assets/images/store-illustration.png")}
                        style={{ width: 200, height: 200 }}
                        resizeMode="contain"
                    />
                    <Text style={[styles.infoText, { color: "#777" }]}>
                        {!searched && search.length === 0
                            ? "Start typing to search stores"
                            : searched
                                ? "No stores found"
                                : ""}
                    </Text>
                </View>
            ) : null}



            {!loading && !error && companies.length > 0 && (
                <FlatList
                    data={companies}
                    keyExtractor={(item, index) => item.cmp_id ?? index.toString()}
                    renderItem={({ item }: { item: CompanyModel }) => <StoreCell company={item} />}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </KeyboardAvoidingView>
    );
};

export default StoreSearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    infoText: {
        marginTop: 12,
        fontSize: 16,
        color: "#777",
    },
});
