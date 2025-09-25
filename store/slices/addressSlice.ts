import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AddressModel } from "../../types";

interface AddressState {
  userAddresses: AddressModel[];
}

const initialState: AddressState = {
  userAddresses: [],
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setUserAddresses(state: AddressState, action: PayloadAction<AddressModel[]>) {
      state.userAddresses = action.payload;
    },
  },
});

export const { setUserAddresses } = addressSlice.actions;
export default addressSlice.reducer;
