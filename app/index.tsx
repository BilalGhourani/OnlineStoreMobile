// app/index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function Index() {
    const companyId = useSelector((state: RootState) => state.auth.companyId);
    const [hasStore, setHasStore] = useState<boolean | null>(null);

    useEffect(() => {
        const checkStoreKey = async () => {
            try {
                const savedCompanyId =
                    companyId || (await AsyncStorage.getItem("companyId"));
                setHasStore(!!savedCompanyId);
            } catch (e) {
                setHasStore(false);
            }
        };
        checkStoreKey();
    }, [companyId]);

    if (hasStore === null) {
        return null; // loading state
    }

    return hasStore ? (
        <Redirect href="/(tabs)/HomeTab" />
    ) : (
        <Redirect href="/screens/StoreSearchScreen" />
    );
}
