import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getTop10itemsbyfamily,
  getTopSalesitems,
} from "../../services/dataService";
import { ItemModel } from "../../types/itemModel";
import { SectionModel } from "../../types/sectionModel";
import { groupItemsByFamily } from "../../utils/Utils";

interface ItemState {
  items: ItemModel[];
  topSales: ItemModel[];
  sections: SectionModel[];
  loading: boolean;
  error: string | null;
}

const initialState: ItemState = {
  items: [],
  topSales: [],
  sections: [],
  loading: false,
  error: null,
};

export const fetchItems = createAsyncThunk(
  "item/fetchItems",
  async (
    { cmpId, brandIds, searchKey }: { cmpId: string; brandIds: string[], searchKey: string },
    { rejectWithValue }
  ) => {
    try {
      const brandIdsString = brandIds.join(",");
      const filtered = brandIdsString ? `'${brandIdsString}'` : "";

      const items = await getTop10itemsbyfamily(cmpId, filtered, searchKey);
      const topSales = await getTopSalesitems(cmpId, filtered, searchKey);
      const sections = groupItemsByFamily(items);

      return { items, topSales, sections };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.topSales = action.payload.topSales;
        state.sections = action.payload.sections;
        state.loading = false;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default itemSlice.reducer;
