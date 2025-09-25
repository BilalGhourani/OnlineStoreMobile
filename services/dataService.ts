import { defaultConfig as config } from "@/config/config";
import { BrandModel } from "../types/brandModel";
import { CompanyModel } from "../types/companyModel";
import { FamilyModel } from "../types/familyModel";
import { ItemModel } from "../types/itemModel";

/**
 * Fetches company details based on the company name.
 * In a real API, this would be an endpoint like /companies?name=E-Commerce%20Hub
 */
export const fetchCompanyDetailsByName = async (
  companyName: string
): Promise<CompanyModel | undefined> => {
  var url = `${config.baseUrl}/in_online/companybyname?storename=${encodeURIComponent(
    companyName
  )}`;
  console.log(`API: Fetching company details from ${url}`);
  try {
    const response = await fetch(`${url}`);
    if (!response.ok) {
      // Handle HTTP errors (e.g., 404 Not Found, 500 Internal Server Error)
      const errorBody = await response.text(); // Get raw text for more info
      console.error(
        `HTTP error fetching company details: ${response.status} - ${errorBody}`
      );
      throw new Error(
        `Failed to fetch company details: ${response.statusText || "Unknown error"
        }`
      );
    }
    const resp = await response.json();
    const company = resp.data;
    return company;
  } catch (error) {
    console.error("Error in fetchCompanyDetailsByName:", error);
    // Re-throw the error to be handled by the calling component/context
    throw error;
  }
};

/**
 * Fetches all families for a given company ID.
 * This is the function that uses the cmp_id.
 */
export const getAllFamilies = async (
  cmp_id: string
): Promise<FamilyModel[]> => {
  var url = `${config.baseUrl}/in_online/families?cmp_id=${cmp_id}`;
  console.log(`API: Fetching all families from ${url}`);
  try {
    const response = await fetch(`${url}`);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `HTTP error fetching families: ${response.status} - ${errorBody}`
      );
      throw new Error(
        `Failed to fetch families: ${response.statusText || "Unknown error"}`
      );
    }
    const resp = await response.json();
    const families: FamilyModel[] = resp.data;
    return families;
  } catch (error) {
    console.error("Error in getAllFamilies:", error);
    throw error;
  }
};

/**
 * Fetches top sales items for a given company ID.
 * This is the function that uses the cmp_id.
 */
export const getTopSalesitems = async (
  cmp_id: string,
  br_name: String,
  searchTerms: String = ``
): Promise<ItemModel[]> => {
  var url = `${config.baseUrl}/in_online/topSales?cmp_id=${cmp_id}&br_name=${br_name}&searchTerms=${searchTerms}`;
  console.log(`API: Fetching top sales items from ${url}`);
  try {
    const response = await fetch(`${url}`);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `HTTP error fetching items: ${response.status} - ${errorBody}`
      );
      throw new Error(
        `Failed to fetch items: ${response.statusText || "Unknown error"}`
      );
    }
    const resp = await response.json();
    const items: ItemModel[] = resp.data;
    return items;
  } catch (error) {
    console.error("Error in getAllFamilies:", error);
    throw error;
  }
};

/**
 * Fetches top 10 items by family for a given company ID.
 * This is the function that uses the cmp_id.
 */
export const getTop10itemsbyfamily = async (
  cmp_id: string,
  br_name: String,
  searchTerms: String = ``
): Promise<ItemModel[]> => {
  var url = `${config.baseUrl}/in_online/top10itemsbyfamily?cmp_id=${cmp_id}&br_name=${br_name}&searchTerms=${searchTerms}`;
  console.log(`API: Fetching top 10 items by family from ${url}`);
  try {
    const response = await fetch(`${url}`);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `HTTP error fetching items: ${response.status} - ${errorBody}`
      );
      throw new Error(
        `Failed to fetch items: ${response.statusText || "Unknown error"}`
      );
    }
    const resp = await response.json();
    const items: ItemModel[] = resp.data;
    return items;
  } catch (error) {
    console.error("Error in getAllFamilies:", error);
    throw error;
  }
};

/**
 * Fetches top 10 items by family for a given company ID.
 * This is the function that uses the cmp_id.
 */
export const getAllBrands = async (cmp_id: string): Promise<BrandModel[]> => {
  var url = `${config.baseUrl}/in_online/brands?cmp_id=${cmp_id}`;
  console.log(`API: Fetching all brands from ${url}`);
  try {
    const response = await fetch(`${url}`);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `HTTP error fetching items: ${response.status} - ${errorBody}`
      );
      throw new Error(
        `Failed to fetch items: ${response.statusText || "Unknown error"}`
      );
    }
    const resp = await response.json();
    const brands: BrandModel[] = resp.data;
    return brands;
  } catch (error) {
    console.error("Error in getAllFamilies:", error);
    throw error;
  }
};

/**
 * Fetches all item models (RawOnlineItem) for a specific category ID with pagination.
 * @param categoryId The ID of the category (e.g., fa_name).
 * @param cmp_id The company ID.
 * @param page The current page number (1-indexed).
 * @param limit The number of items per page.
 * @returns A promise that resolves to an object containing RawOnlineItem[] and total_items.
 */
export const fetchItemsByCategoryId = async (
  familyName: string,
  cmp_id: string,
  page: number = 1,
  limit: number = 10
): Promise<{ data: ItemModel[]; total_pages: number }> => {
  var url = `${config.baseUrl}/in_online/onlineitemsByFamily?items_per_page=${limit}&page_number=${page}&cmp_id=${cmp_id}&br_name=&fa_name=${familyName}&searchTerms=`;
  console.log(`API: Fetching items by family from ${url}`);
  try {
    const response = await fetch(`${url}`);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `HTTP error fetching items: ${response.status} - ${errorBody}`
      );
      throw new Error(
        `Failed to fetch items: ${response.statusText || "Unknown error"}`
      );
    }
    const resp = await response.json();
    const items: ItemModel[] = resp.data;
    return { data: items, total_pages: resp.count };
  } catch (error) {
    console.error("Error in getAllFamilies:", error);
    throw error;
  }
};
