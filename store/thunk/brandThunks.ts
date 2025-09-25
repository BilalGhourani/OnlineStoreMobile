import { AppThunk, RootState } from "../../store";
import { setSelectedBrandFilters } from "../slices/brandSlice";
import { fetchItems } from "../slices/itemSlice";

export const applyBrandFilters =
  (filters: string[]): AppThunk =>
    (dispatch, getState) => {
      dispatch(setSelectedBrandFilters(filters));

      const cmpId = (getState() as RootState).company.companyModel?.cmp_id;
      if (cmpId) {
        dispatch(fetchItems({ cmpId, brandIds: filters }));
      }
    };
