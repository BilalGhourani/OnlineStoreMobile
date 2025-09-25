import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "./slices/companySlice";
import familyReducer from "./slices/familySlice";
import brandReducer from "./slices/brandSlice";
import itemReducer from "./slices/itemSlice";
import addressReducer from "./slices/addressSlice";
import paymentReducer from "./slices/paymentSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import snackbarReducer from "./slices/snackbarSlice";

const store = configureStore({
  reducer: {
    company: companyReducer,
    family: familyReducer,
    brand: brandReducer,
    item: itemReducer,
    address: addressReducer,
    payment: paymentReducer,
    auth: authReducer,
    cart: cartReducer,
    snackbar: snackbarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        warnAfter: 100,
      },
    }),
});

// ✅ Export RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = (
  dispatch: AppDispatch,
  getState: () => RootState
) => ReturnType;

export default store;
