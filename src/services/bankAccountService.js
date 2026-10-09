// import axios from "axios";

// // =====================================================
// // API BASE URL
// // =====================================================
// const API_URL = import.meta.env.VITE_API_URL;

// // =====================================================
// // AUTH HEADERS
// // =====================================================
// const getAuthHeaders = () => {
//     const token =
//         localStorage.getItem("token") ||
//         localStorage.getItem("accessToken");

//     return {
//         headers: {
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//             "Content-Type": "application/json",
//         },
//     };
// };

// // =====================================================
// // UPDATE CUSTOMER BANK DETAILS
// // PATCH
// // /api/users/customer/:customerId/bank-details/:accountId
// // =====================================================
// export const updateCustomerBankDetails = async (
//     customerId,
//     accountId,
//     bankDetails
// ) => {
//     try {
//         const response = await axios.patch(
//             `${API_URL}/users/customer/${customerId}/bank-details/${accountId}`,
//             bankDetails,
//             getAuthHeaders()
//         );

//         return response.data;
//     } catch (error) {
//         console.error(
//             "Update customer bank details error:",
//             error.response?.data || error.message
//         );

//         throw error;
//     }
// };


import axios from "axios";

// API URL — localhost sirf .env mein rakhein
const API = `${import.meta.env.VITE_API_URL}/users`;

// Auth headers
const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken");

  return {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

// Get all customer bank accounts
export const getCustomerBankAccounts = async () => {
  const response = await axios.get(
    `${API}/bank-accounts`,
    getAuthHeaders()
  );

  return response.data;
};

// Get a specific customer's bank account by ID
export const getCustomerBankAccountById = async (
  customerId,
  accountId
) => {
  if (!customerId || !accountId) {
    throw new Error("Customer ID and Account ID are required");
  }

  const response = await axios.get(
    `${API}/${encodeURIComponent(customerId)}/bank-accounts/${encodeURIComponent(accountId)}`,
    getAuthHeaders()
  );

  return response.data;
};

// Update customer bank details
export const updateCustomerBankDetails = async (
  accountId,
  bankDetails
) => {
  if (!accountId) {
    throw new Error("Bank Account ID is required");
  }

  if (!bankDetails || typeof bankDetails !== "object") {
    throw new Error("Valid bank details are required");
  }

  const response = await axios.patch(
    `${API}/bank-accounts/${encodeURIComponent(accountId)}`,
    bankDetails,
    getAuthHeaders()
  );

  return response.data;
};