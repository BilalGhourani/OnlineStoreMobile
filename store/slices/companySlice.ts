import { defaultConfig as config } from "@/config/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCompanyDetailsByName } from "../../services/dataService";
import { Banner } from "../../types";
import { CompanyModel } from "../../types/companyModel";

interface CompanyState {
  companyModel: CompanyModel | null;
  banners: Banner[];
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  companyModel: null,
  banners: [],
  loading: false,
  error: null,
};

export const fetchCompany = createAsyncThunk(
  "company/fetchCompany",
  async (_, { rejectWithValue }) => {
    try {
      const company = await fetchCompanyDetailsByName(config.companyName);
      if (!company) throw new Error("Company not found");

      const banners: Banner[] = [];
      if (company.ioe_image1)
        banners.push({ id: "banner1", imageUrl: company.ioe_image1 });
      if (company.ioe_image2)
        banners.push({ id: "banner2", imageUrl: company.ioe_image2 });
      if (company.ioe_image3)
        banners.push({ id: "banner3", imageUrl: company.ioe_image3 });

      return { company: company, banners: banners };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.companyModel = action.payload.company;
        state.banners = action.payload.banners;
        state.loading = false;
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default companySlice.reducer;
