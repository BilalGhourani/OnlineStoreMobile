import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllFamilies } from "../../services/dataService";
import { CategoryModel, FamilyModel } from "../../types/familyModel";
import { buildCategoryTree } from "../../utils/Utils";

interface State {
  families: FamilyModel[];
  categories: CategoryModel[];
}

const initialState: State = {
  families: [],
  categories: [],
};

export const fetchFamilies = createAsyncThunk(
  "family/fetchFamilies",
  async (cmpId: string) => {
    const families = await getAllFamilies(cmpId);
    const categories = buildCategoryTree(families);
    return { families, categories };
  }
);

const familySlice = createSlice({
  name: "family",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFamilies.fulfilled, (state, action) => {
      state.families = action.payload.families;
      state.categories = action.payload.categories;
    });
  },
});

export default familySlice.reducer;
