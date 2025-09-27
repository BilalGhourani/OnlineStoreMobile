import { defaultConfig as config } from "@/config/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCompaniesByName, getCompanyById } from "../../services/dataService";
import { Banner } from "../../types";
import { CompanyModel } from "../../types/companyModel";

interface CompanyState {
  companies: CompanyModel[];
  companyModel: CompanyModel | null;
  banners: Banner[];
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  companyModel: null,
  banners: [],
  loading: false,
  error: null,
};

// 🔹 Search companies
export const searchForCompany = createAsyncThunk(
  "company/searchForCompany",
  async (name: string, { rejectWithValue }) => {
    try {
      const companies = await fetchCompaniesByName(name || config.companyName);
      if (!companies) throw new Error("No companies found");

      return companies;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Fetch single company by id
export const fetchCompanyById = createAsyncThunk(
  "company/fetchCompanyById", // <-- FIXED unique action type
  async (id: string, { rejectWithValue }) => {
    try {
      const company = await getCompanyById(id);
      if (!company) throw new Error("Company not found");

      const banners: Banner[] = [];
      if (company.ioe_image1)
        banners.push({ id: "banner1", imageUrl: company.ioe_image1, note: company.ioe_note1 ?? undefined });
      if (company.ioe_image2)
        banners.push({ id: "banner2", imageUrl: company.ioe_image2, note: company.ioe_note2 ?? undefined });
      if (company.ioe_image3)
        banners.push({ id: "banner3", imageUrl: company.ioe_image3, note: company.ioe_note3 ?? undefined });

      return { company, banners };
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
      // 🔹 Search companies
      .addCase(searchForCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchForCompany.fulfilled, (state, action) => {
        state.companies = action.payload;
        state.loading = false;
      })
      .addCase(searchForCompany.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // 🔹 Fetch company by ID
      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.companyModel = action.payload.company;
        state.banners = action.payload.banners;
        state.loading = false;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default companySlice.reducer;
