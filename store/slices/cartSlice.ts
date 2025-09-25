import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../../types";
import { ItemModel } from "../../types/itemModel";

const CART_STORAGE_KEY = "@ShopPulse:cart";

interface CartState {
  cartItems: CartItem[];
  totalCartPrice: number;
}

const initialState: CartState = {
  cartItems: [],
  totalCartPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loadCartItems(state, action: PayloadAction<CartItem[]>) {
      state.cartItems = action.payload;
      state.totalCartPrice = action.payload.reduce(
        (sum, item) => sum + (item.ioi_unitprice * (1 - item.ioi_disc / 100) * item.amount),
        0
      );
    },
    addToCart(
      state,
      action: PayloadAction<{ item: ItemModel; amount?: number }>
    ) {
      const { item, amount = 1 } = action.payload;
      const existingItem = state.cartItems.find((ci) => ci.ioi_id === item.ioi_id);
      if (existingItem) {
        existingItem.amount += amount;
      } else {
        state.cartItems.push({ ...item, amount });
      }
      state.totalCartPrice = state.cartItems.reduce(
        (sum, item) => sum + (item.ioi_unitprice * (1 - item.ioi_disc / 100) * item.amount),
        0
      );
      AsyncStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(state.cartItems)
      ).catch(console.error);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter(
        (item) => item.ioi_id !== action.payload
      );
      state.totalCartPrice = state.cartItems.reduce(
        (sum, item) => sum + (item.ioi_unitprice * (1 - item.ioi_disc / 100) * item.amount),
        0
      );
      AsyncStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(state.cartItems)
      ).catch(console.error);
    },
    clearCart(state) {
      state.cartItems = [];
      state.totalCartPrice = 0;
      AsyncStorage.removeItem(CART_STORAGE_KEY).catch(console.error);
    },
    updateCartItemQuantity(
      state,
      action: PayloadAction<{ productId: string; amount: number }>
    ) {
      const { productId, amount } = action.payload;
      if (amount <= 0) {
        state.cartItems = state.cartItems.filter(
          (item) => item.ioi_id !== productId
        );
      } else {
        const item = state.cartItems.find((ci) => ci.ioi_id === productId);
        if (item) item.amount = amount;
      }
      state.totalCartPrice = state.cartItems.reduce(
        (sum, item) => sum + (item.ioi_unitprice * (1 - item.ioi_disc / 100) * item.amount),
        0
      );
      AsyncStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(state.cartItems)
      ).catch(console.error);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  updateCartItemQuantity,
  loadCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;
