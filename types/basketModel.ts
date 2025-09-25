
export interface BasketItem {
  iba_id: string | undefined;
  iba_it_id: string;
  iba_qty: number;
  iba_price: number;
  iba_tax1: number;
  iba_tax2: number;
  iba_total: number;
  iba_expirydate: string;
  iba_purchasedate: string;
  iba_userstamp: string | null;
  iba_pm_id: string;
}

export interface BasketHeader {
  ihb_id: string | undefined,
  ihb_ireg_id: string;
  ihb_cmp_id: string;
  ihb_date: string;
  ihb_discamt: number;
  ihb_taxamt: number;
  ihb_tax1amt: number;
  ihb_tax2amt: number;
  ihb_total: number;
  ihb_status: string;
  ihb_userstamp: string;
  ihb_hsh_id: string;
  ihb_deliveryaddress: string;
}

export interface BasketBody {
  basket: BasketItem[];
  hbasket: BasketHeader;
}
