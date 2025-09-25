export interface FamilyModel {
  fa_name: string;
  fa_parent: string;
  fa_group: string;
  fa_numberofyears: number | null;
  fa_codelen: number | null;
  fa_purchacc: string | null;
  fa_depacc: string | null;
  fa_depchargeacc: string | null;
  fa_salesacc: string | null;
  fa_costoffasoldacc: string | null;
  fa_periodicityofprovision: string | null;
  fa_newname: string;
  fa_cmp_id: string;
  ifa_id: string | null;
  ifa_fa_name: string | null;
  ifa_order: number | null;
}

// Updated: Category interface now includes rawFamilyData and supports hierarchy
export interface CategoryModel {
  rawFamilyModel: FamilyModel; // New: Store the original FamilyModel data for this category
  subcategories?: CategoryModel[]; // Nested subcategories (still Category objects for recursion)
}
