import { ItemModelDetails } from "../types";
import { CategoryModel, FamilyModel } from "../types/familyModel";
import { ItemModel } from "../types/itemModel";
import { SectionModel } from "../types/sectionModel";

export function groupItemsByFamily(items: ItemModel[]): SectionModel[] {
  const groups: Record<string, SectionModel> = {};

  for (const item of items) {
    if (!groups[item.fa_name]) {
      groups[item.fa_name] = {
        fa_name: item.fa_name,
        fa_parent: item.fa_parent,
        fa_group: item.fa_group,
        fa_newname: item.fa_newname,
        fa_cmp_id: item.fa_cmp_id,
        items: [],
      };
    }

    groups[item.fa_name].items.push(item);
  }

  return Object.values(groups);
}

/**
 * Helper function to transform RawOnlineItem into your app's Product interface.
 * Now extracts all available image URLs.
 */
export function getImagesList(rawItem: ItemModel | null): ItemModelDetails {
  if (rawItem == null) {
    return {
      id: "",
      item_id: "~",
      name: "Unknown",
      code: "~",
      category: "",
      price: 0.0,
      discount: 0,
      discountedPrice: 0,
      ioi_remqty: 0,
      imageUrl: "",
      imageUrls: [],
      description: "",
    };
  }
  const allImageUrls: string[] = [];
  // Collect all ioi_photo properties if they are valid URLs
  if (rawItem.ioi_photo1) allImageUrls.push(rawItem.ioi_photo1);
  if (rawItem.ioi_photo2) allImageUrls.push(rawItem.ioi_photo2);
  if (rawItem.ioi_photo3) allImageUrls.push(rawItem.ioi_photo3);
  if (rawItem.ioi_photo4) allImageUrls.push(rawItem.ioi_photo4);
  if (rawItem.ioi_photo5) allImageUrls.push(rawItem.ioi_photo5);
  if (rawItem.ioi_photo6) allImageUrls.push(rawItem.ioi_photo6);
  if (rawItem.ioi_photo7) allImageUrls.push(rawItem.ioi_photo7);
  if (rawItem.ioi_photo8) allImageUrls.push(rawItem.ioi_photo8);
  if (rawItem.ioi_photo9) allImageUrls.push(rawItem.ioi_photo9);

  // Use the first image as the primary imageUrl, or a fallback
  const primaryImageUrl =
    allImageUrls.length > 0
      ? allImageUrls[0]
      : "https://placehold.co/150x150/cccccc/000000?text=No+Image";

  const originalPrice = rawItem.ioi_unitprice ?? 0;
  const discountPercentage = rawItem.ioi_disc ?? 0;
  const finalPrice =
    discountPercentage > 0
      ? originalPrice * (1 - discountPercentage / 100)
      : originalPrice;

  return {
    id: rawItem.ioi_id,
    item_id: rawItem.it_id,
    name: rawItem.ioi_name,
    code: rawItem.it_code ?? "",
    category: rawItem.fa_newname,
    price: originalPrice,
    tax: rawItem.ioi_tax || 0,
    tax1: rawItem.it_tax1,
    tax2: rawItem.it_tax2,
    discount: discountPercentage,
    discountedPrice: finalPrice,
    ioi_remqty: rawItem.ioi_remqty,
    imageUrl: primaryImageUrl, // The first image is used for lists/thumbnails
    imageUrls: allImageUrls, // All images for the detail page carousel
    description: concatenateDescriptions(
      rawItem.ioi_desc,
      rawItem.ioi_desc1,
      rawItem.ioi_desc2,
      rawItem.ioi_desc3,
      rawItem.ioi_desc4,
      "\n\n"
    ),
  };
}

/**
 * Transforms a flat list of FamilyModel into a hierarchical (tree) structure of Category.
 * Each Category now includes its raw FamilyModel data.
 */
export function buildCategoryTree(rawFamilies: FamilyModel[]): CategoryModel[] {
  const categoryMap = new Map<string, CategoryModel>();
  const rootCategories: CategoryModel[] = [];

  // First pass: create Category objects and map them by ID (fa_name)
  rawFamilies.forEach((family) => {
    const category: CategoryModel = {
      rawFamilyModel: family, // Store the entire raw FamilyModel object
      subcategories: [], // Initialize subcategories array
    };
    categoryMap.set(category.rawFamilyModel.fa_name, category);
  });

  // Second pass: build the tree structure
  categoryMap.forEach((category) => {
    if (category.rawFamilyModel.fa_parent) {
      const parent = categoryMap.get(category.rawFamilyModel.fa_parent);
      if (parent) {
        parent.subcategories?.push(category);
      } else {
        // If parent not found (e.g., parent ID points to non-existent category),
        // treat this category as a root category.
        console.warn(
          `[CategoryTree] Parent with ID '${category.rawFamilyModel.fa_parent}' not found for category '${category.rawFamilyModel.fa_newname}'. Treating as root.`
        );
        rootCategories.push(category);
      }
    } else {
      // Top-level category (fa_parent is null or empty string)
      rootCategories.push(category);
    }
  });

  // Sort categories and their subcategories by name for consistent display
  const sortCategories = (cats: CategoryModel[]) => {
    cats.sort((a, b) =>
      a.rawFamilyModel.fa_newname.localeCompare(b.rawFamilyModel.fa_newname)
    );
    cats.forEach((cat) => {
      if (cat.subcategories && cat.subcategories.length > 0) {
        sortCategories(cat.subcategories);
      }
    });
  };

  sortCategories(rootCategories);

  return rootCategories;
}

/**
 * Concatenates up to five description strings, including only those that are
 * not null or undefined.
 *
 * @param desc1 - The first description string.
 * @param desc2 - The second description string.
 * @param desc3 - The third description string.
 * @param desc4 - The fourth description string.
 * @param desc5 - The fifth description string.
 * @param separator - The string to use between concatenated descriptions (default: ' ').
 * @returns A single string with valid descriptions joined by the separator.
 */
function concatenateDescriptions(
  desc1?: string | null,
  desc2?: string | null,
  desc3?: string | null,
  desc4?: string | null,
  desc5?: string | null,
  separator: string = " "
): string {
  const validDescriptions: string[] = [];

  // Check each description and add to the array if it's a non-empty string
  if (desc1) {
    // Checks for non-null, non-undefined, and non-empty string
    validDescriptions.push(desc1);
  }
  if (desc2) {
    validDescriptions.push(desc2);
  }
  if (desc3) {
    validDescriptions.push(desc3);
  }
  if (desc4) {
    validDescriptions.push(desc4);
  }
  if (desc5) {
    validDescriptions.push(desc5);
  }

  // Join the valid descriptions with the specified separator
  return validDescriptions.join(separator);
}

export function parseItem(item: string | undefined): ItemModel | null {
  try {
    if (item) {
      return JSON.parse(item);
    }
    return null;
  } catch (e) {
    return null;
  }
}

export function parseSection(section: string | undefined): SectionModel | null {
  try {
    if (section) {
      return JSON.parse(section);
    }
    return null;
  } catch (e) {
    return null;
  }
}
