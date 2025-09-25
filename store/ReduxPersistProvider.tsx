import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loadCompanyId, loadUserProfile } from "../store/slices/authSlice";
import { loadCartItems } from "../store/slices/cartSlice";

const COMPANY_ID_KEY = "@ShopPulse:companyId";
const USER_STORAGE_KEY = "@ShopPulse:userProfile";
const CART_STORAGE_KEY = "@ShopPulse:cart";

interface Props {
  children: ReactNode;
}

const ReduxPersistProvider: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadStorage() {
      try {
        const storedCompanyId = await AsyncStorage.getItem(COMPANY_ID_KEY);
        if (storedCompanyId) {
          dispatch(loadCompanyId({ cmpId: storedCompanyId, save: false }));
        }
        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          dispatch(loadUserProfile(JSON.parse(storedUser)));
        } else {
          dispatch(loadUserProfile(null));
        }

        const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          dispatch(loadCartItems(JSON.parse(storedCart)));
        } else {
          dispatch(loadCartItems([]));
        }
      } catch (error) {
        console.error("Failed to load stored auth/cart data", error);
      } finally {
        setIsReady(true);
      }
    }

    loadStorage();
  }, [dispatch]);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
};

export default ReduxPersistProvider;
