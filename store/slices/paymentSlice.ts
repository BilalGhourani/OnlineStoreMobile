import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchPaymentMethods,
  fetchShippingMethods,
  getInWallet,
} from "../../services/paymentService";
import { PaymentMethod, ShippingMethod, WalletItem } from "../../types";

interface PaymentState {
  shippingMethods: ShippingMethod[];
  paymentMethods: PaymentMethod[];
  wallet: WalletItem | null;
}

const initialState: PaymentState = {
  shippingMethods: [],
  paymentMethods: [],
  wallet: null,
};

export const fetchPayments = createAsyncThunk(
  "payment/fetchPayments",
  async (cmpId: string) => {
    const shipping = await fetchShippingMethods(cmpId);
    const payment = await fetchPaymentMethods(cmpId);
    return { shipping, payment };
  }
);

export const fetchWallet = createAsyncThunk(
  "payment/fetchWallet",
  async (userId: string) => {
    const wallet = await getInWallet(userId);
    return { wallet };
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchPayments.fulfilled, (state, action) => {
        state.shippingMethods = action.payload.shipping;
        state.paymentMethods = action.payload.payment;
      }
    ).addCase(
      fetchWallet.fulfilled, (state, action) => {
        state.wallet = action.payload.wallet;
      }
    );
  },
});

export default paymentSlice.reducer;
