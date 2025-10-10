import { defaultConfig as config } from "@/config/config";
import { AddressModel, EmailModel, InCheckoutModel, PaymentMethod, ShippingMethod, WalletItem } from "../types";
import { BasketBody } from "../types/basketModel";

/**
 * Fetches available shipping methods for a given company.
 * @param cmp_id The ID of the company.
 * @returns A promise that resolves to an array of ShippingMethod objects.
 */
export const fetchShippingMethods = async (
  cmp_id: string
): Promise<ShippingMethod[]> => {
  console.log(`API: Fetching shipping methods : ${cmp_id}`);
  try {
    const response = await fetch(
      `${config.baseUrl}/in_online/shippingMethod?cmp_id=${cmp_id}`
    );

    if (!response.ok) {
      const errorBody = await response.json();
      console.error(
        `HTTP error fetching shipping methods: ${response.status} -`,
        errorBody
      );
      throw new Error(
        errorBody.message ||
        `Failed to fetch shipping methods with status: ${response.status}`
      );
    }

    const responseData = await response.json();
    const shippingMethod: ShippingMethod[] = responseData.data;
    return shippingMethod;
  } catch (error) {
    console.error("Error in fetchShippingMethods:", error);
    return [];
  }
};

/**
 * Fetches available payment methods for a given company.
 * @param cmp_id The ID of the company.
 * @returns A promise that resolves to an array of PaymentMethod objects.
 */
export const fetchPaymentMethods = async (
  cmp_id: string
): Promise<PaymentMethod[]> => {
  console.log(`API: Fetching payment methods for company ID: ${cmp_id}`);
  try {
    const response = await fetch(
      `${config.baseUrl}/in_online/paymentMethods?cmp_id=${cmp_id}`
    );

    if (!response.ok) {
      const errorBody = await response.json();
      console.error(
        `HTTP error fetching payment methods: ${response.status} -`,
        errorBody
      );
      throw new Error(
        errorBody.message ||
        `Failed to fetch payment methods with status: ${response.status}`
      );
    }

    const responseData = await response.json();
    const paymentMethods: PaymentMethod[] = responseData.data;
    return paymentMethods;
  } catch (error) {
    console.error("Error in fetchPaymentMethods:", error);
    return [];
  }
};

/**
 * Fetches available Delivery Addresses for a given registration id.
 * @param reg_id The ID of the registration.
 * @returns A promise that resolves to an array of AddressModel objects.
 */
export const fetchDeliveryAddresses = async (
  reg_id: string
): Promise<AddressModel[]> => {
  console.log(`API: Fetching delivery addresses for reg ID: ${reg_id}`);
  try {
    const response = await fetch(
      `${config.baseUrl}/in_online/in_deliveryaddress?da_ireg_id=${reg_id}`
    );

    if (!response.ok) {
      const errorBody = await response.json();
      console.error(
        `HTTP error fetching delivery addresses: ${response.status} -`,
        errorBody
      );
      throw new Error(
        errorBody.message ||
        `Failed to fetch delivery addresses with status: ${response.status}`
      );
    }

    const responseData = await response.json();
    const AddressModels: AddressModel[] = responseData.data;
    return AddressModels;
  } catch (error) {
    console.error("Error in fetchDeliveryAddresses:", error);
    return [];
  }
};

/**
 * Add/update Delivery Address for a registered user.
 * @param address The Address Model.
 * @returns Api response status
 */
export const addAddress = async (data: AddressModel): Promise<any> => {
  const url = `${config.baseUrl}/in_online/addin_deliveryaddress`;
  const bodyObj = JSON.stringify({ data });
  try {
    console.log(`API: add/update address: ${url}`, bodyObj);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyObj,
    });

    if (!response.ok) {
      const errorBody = await response.json(); // Assuming error response is JSON
      console.error(
        `HTTP error during add/update address: ${response.status} -`,
        errorBody
      );
      // Throw an error with a more specific message from the API if available
      throw new Error(
        errorBody.message ||
        `add/update address failed with status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("add/update address successful. Response data:", data);
    return data;
  } catch (error) {
    console.error("Error in add/update address:", error);
    return undefined;
  }
};

/**
 * delete Delivery Address for a registered user.
 * @param addressid The Address Model id.
 * @returns Api response status
 */
export const deleteAddress = async (addressId: string): Promise<any> => {
  try {
    var url = `${config.baseUrl}/in_online/in_deletedeliveryaddress?da_id=${addressId}`;
    console.log(`API: delete address: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      const errorBody = await response.json(); // Assuming error response is JSON
      console.error(
        `HTTP error during delete address: ${response.status} -`,
        errorBody
      );
      // Throw an error with a more specific message from the API if available
      throw new Error(
        errorBody.message ||
        `delete address failed with status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in delete address:", error);
    return undefined;
  }
};

/**
 * Add Basket for a registered user.
 * @param basket The Basket Model.
 * @returns Api response status
 */
export const addBasket = async (data: BasketBody): Promise<any> => {
  const url = `${config.baseUrl}/in_online/add_basket`;
  const bodyObj = JSON.stringify(data);
  try {
    console.log(`API: add Basket: ${url}`, bodyObj);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyObj,
    });

    if (!response.ok) {
      const errorBody = await response.json(); // Assuming error response is JSON
      console.error(
        `HTTP error during add Basket: ${response.status} -`,
        errorBody
      );
      // Throw an error with a more specific message from the API if available
      throw new Error(
        errorBody.message || `add Basket failed with status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("add Basket successful. Response data:", data);
    return data;
  } catch (error) {
    console.error("Error in add Basket:", error);
    return undefined
  }
};

/**
 * Check Voucher for a registered user.
 * @param cmp_id company id.
 * @param ivo_code vouncher number.
 * @param cmp_id user id.
 * @returns Api response status
 */
export const checkVoucher = async (cmp_id: String, ivo_code: string, user: String): Promise<any> => {
  const url = `${config.baseUrl}/in_voucher/check_voucher`;
  const bodyObj = JSON.stringify({
    cmp_id: cmp_id,
    ivo_code: ivo_code,
    user: user
  });
  try {
    console.log(`API: check Voucher: ${url}`, bodyObj);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyObj,
    });

    if (!response.ok) {
      const errorBody = await response.json(); // Assuming error response is JSON
      console.error(
        `HTTP error during check Voucher: ${response.status} -`,
        errorBody
      );
      // Throw an error with a more specific message from the API if available
      throw new Error(
        errorBody.message || `check Voucher failed with status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("check Voucher successful. Response data:", data);
    return data;
  } catch (error) {
    console.error("Error in check Voucher:", error);
    return undefined;
  }
};

/**
 * Get In Wallet for a given reg.
 * @param iwa_ireg_id The ID of the registered user.
 * @returns A promise that resolves to an array of ShippingMethod objects.
 */
export const getInWallet = async (
  iwa_ireg_id: string
): Promise<WalletItem> => {
  console.log(`API: Fetching wallets : ${iwa_ireg_id}`);
  try {
    const response = await fetch(
      `${config.baseUrl}/in_online/in_wallet?iwa_ireg_id=${iwa_ireg_id}`
    );

    if (!response.ok) {
      const errorBody = await response.json();
      console.error(
        `HTTP error fetching shipping methods: ${response.status} -`,
        errorBody
      );
      throw new Error(
        errorBody.message ||
        `Failed to fetch shipping methods with status: ${response.status}`
      );
    }

    const responseData = await response.json();
    const wallets: WalletItem = responseData.data;
    return wallets;
  } catch (error) {
    console.error("Error in fetchShippingMethods:", error);
    throw error;
  }
};

/**
 * Checkout.
 * @param body InCheckoutModel.
 * @returns Api response status
 */
export const checkout = async (body: InCheckoutModel): Promise<any> => {
  const url = `${config.baseUrl}/in_online/in_checkout`;
  const bodyObj = JSON.stringify(body);
  try {
    console.log(`API: checkout: ${url}`, bodyObj);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyObj,
    });

    if (!response.ok) {
      const errorBody = await response.json(); // Assuming error response is JSON
      console.error(
        `HTTP error during checkout: ${response.status} -`,
        errorBody
      );
      // Throw an error with a more specific message from the API if available
      throw new Error(
        errorBody.message || `checkout failed with status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("checkout successful. Response data:", data);
    return data;
  } catch (error) {
    console.error("Error in checkout:", error);
    return undefined;
  }
};


/**
 * sendemail.
 * @param body emailModel.
 * @returns Api response status
 */
export const sendEmail = async (body: EmailModel): Promise<any> => {
  const url = `${config.baseUrl}/nodemailer/sendemail`;
  const bodyObj = JSON.stringify(body);
  try {
    console.log(`API: sendemail: ${url}`, bodyObj);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyObj,
    });

    if (!response.ok) {
      const errorBody = await response.json(); // Assuming error response is JSON
      console.error(
        `HTTP error during sendemail: ${response.status} -`,
        errorBody
      );
      // Throw an error with a more specific message from the API if available
      throw new Error(
        errorBody.message || `sendemail failed with status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("sendemail successful. Response data:", data);
    return data;
  } catch (error) {
    console.error("Error in sendemail:", error);
    return undefined;
  }
};