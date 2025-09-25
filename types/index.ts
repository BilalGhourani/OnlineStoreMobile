import { ItemModel } from "./itemModel";

// Updated: Product interface to include an array of image URLs
export interface ItemModelDetails {
  id: string; // Maps to ioi_id
  item_id: string;
  name: string; // Maps to ioi_name
  code: string; // Maps to it_code
  category: string; // Maps to fa_newname
  price: number; // Maps to ioi_unitprice
  tax: number;
  tax1: number;
  tax2: number;
  discount: number; //Maps to ioi_disc
  discountedPrice: number;
  imageUrl: string; // Maps to ioi_photo1 (primary image, for lists/thumbnails)
  imageUrls: string[]; // New: Array of all product image URLs (ioi_photo1 to ioi_photo9)
  description?: string; // Maps to ioi_desc
}

// Interface for an item in the cart
export interface CartItem extends ItemModel {
  amount: number;
}

export interface Banner {
  id: string;
  imageUrl: string;
}

interface MessageBoxProps {
  isVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

// Define the structure of the user profile data you want to store in Firestore
export interface UserProfile {
  ireg_id: string | null;
  ireg_cmp_id: string | null;
  ireg_cu_id: string | null;
  ireg_language: string | null;
  ireg_firstname: string;
  ireg_lastname: string;
  ireg_username: string;
  ireg_pass: string;
  ireg_email: string;
  ireg_emailverified: number | 0;
  ireg_phone1: string;
  ireg_phone2: string | null;
  ireg_country: string | null;
  ireg_region: string | null;
  ireg_salt: string | null;
  ireg_regcountry: string | null;
  ireg_ip: string | null;
  ireg_userstamp: string | null;
  ireg_provideruid: string | null;
  ireg_provider: string | null;
}

export interface ShippingMethod {
  hsh_id: string;
  hsh_cmp_id: string;
  hsh_name: string;
  hsh_note?: string;
}

export interface PaymentMethod {
  icp_id: string;
  icp_cmp_id: string;
  icp_paymentmodename: string;
  icp_photo?: string;
  icp_text: string;
  icp_link?: string;
  icp_inactive: boolean;
}

export interface AddressModel {
  da_id: string | null;
  da_ireg_id: string | null;
  da_contact: string;
  da_phone1: string;
  da_phone2?: string | null;
  da_phone3?: string | null;
  da_address: string | null;
  da_city: string;
  da_street?: string | null;
  da_building?: string | null;
  da_floor?: string | null;
  da_map?: string | null;
}

export interface WalletItem {
  iwal_id: string;
  iwal_amt: number;
  iwal_cmp_id: string | null;
  iwal_currency: string;
  iwal_ireg_id: string;
  iwal_timestamp: string; // or Date if you want to parse it
  iwal_userstamp: string;
}

export interface InCheckoutModel {
  ich_ireg_id: string;
  ich_cmp_id: string;
  ich_ihb_id: string;
  ich_checkoutpaymentmode: string;
  ich_total: number;
  ich_status: string;
  ich_userstamp: string;
  wallet_id: string;
  user: UserProfile;
  storename: string;
}

export interface EmailModel {
  checkoutForm: InCheckoutModel;
  cart: CartItem[];
}
