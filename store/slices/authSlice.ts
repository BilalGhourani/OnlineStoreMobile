import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "../../types";

const USER_STORAGE_KEY = "@ShopPulse:userProfile";
const COMPANY_ID_KEY = "@ShopPulse:companyId";

interface AuthState {
  userProfile: UserProfile | null;
  companyId: string | null,
}

const initialState: AuthState = {
  userProfile: null,
  companyId: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadCompanyId(state: AuthState, action: PayloadAction<{ cmpId: string; save: boolean }>) {
      state.companyId = action.payload.cmpId;
      if (action.payload.save) {
        if (action.payload) {
          AsyncStorage.setItem(COMPANY_ID_KEY, action.payload.cmpId).catch(console.error);
        } else {
          AsyncStorage.removeItem(COMPANY_ID_KEY).catch(console.error);
        }
      }
    },
    loadUserProfile(state: AuthState, action: PayloadAction<UserProfile | null>) {
      state.userProfile = action.payload;
    },
    signIn(state: AuthState, action: PayloadAction<UserProfile>) {
      state.userProfile = action.payload;
      AsyncStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(action.payload)
      ).catch(console.error);
    },
    signOut(state: AuthState) {
      state.userProfile = null;
      AsyncStorage.removeItem(USER_STORAGE_KEY).catch(console.error);
    },
  },
});

export const { signIn, signOut, loadUserProfile, loadCompanyId } = authSlice.actions;
export default authSlice.reducer;
