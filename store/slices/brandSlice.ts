import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllBrands } from "../../services/dataService";
import { BrandModel } from "../../types/brandModel";

interface BrandState {
  brands: BrandModel[];
  selectedBrandFilters: string[];
}

const initialState: BrandState = {
  brands: [],
  selectedBrandFilters: [],
};

export const fetchBrands = createAsyncThunk(
  "brand/fetchBrands",
  async (cmpId: string) => {
    return await getAllBrands(cmpId);
  }
);

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setSelectedBrandFilters(state, action: PayloadAction<string[]>) {
      state.selectedBrandFilters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBrands.fulfilled, (state, action) => {
      state.brands = action.payload;
    });
  },
});

export const { setSelectedBrandFilters } = brandSlice.actions;
export default brandSlice.reducer;
