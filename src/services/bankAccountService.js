// // import axios from "axios";

// // const API = import.meta.env.VITE_API_URL;

// // // Helper to get token
// // const getAuthHeaders = () => {
// //     const token = localStorage.getItem("token");
// //     return {
// //         headers: {
// //             Authorization: `Bearer ${token}`,
// //         },
// //     };
// // };

// // // GET all bank accounts for a customer
// // export const getCustomerBankAccounts = async (customerId) => {
// //     const response = await axios.get(
// //         `${API}/users/${customerId}/bank-accounts`, // Adjust route prefix if your route is mounted under /api/customers or /api/users
// //         getAuthHeaders()
// //     );
// //     return response.data;
// // };

// // // GET a specific bank account by ID
// // export const getCustomerBankAccountById = async (customerId, accountId) => {
// //     const response = await axios.get(
// //         `${API}/users/${customerId}/bank-accounts/${accountId}`,
// //         getAuthHeaders()
// //     );
// //     return response.data;
// // };

// // export const updateCustomerBankDetails = async (customerId, bankDetails) => {
// //     const response = await axios.patch(
// //         `${API}/customer/${customerId}/bank-details`,
// //         bankDetails,
// //         getAuthHeaders()
// //     );
// //     return response.data;
// // }


// import axios from "axios";

// const API = import.meta.env.VITE_API_URL;

// export const getAuthHeaders = () => {
//     const token = localStorage.getItem("token");

//     return {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     };
// };

// export const getCustomerBankAccounts = async (customerId) => {
//     const response = await axios.get(
//         `${API}/users/${customerId}/bank-accounts`,
//         getAuthHeaders()
//     );

//     return response.data;
// };

// export const getCustomerBankAccountById = async (customerId, accountId) => {
//     const response = await axios.get(
//         `http://localhost:5000/api/users/${customerId}/bank-accounts/${accountId}`,
//         getAuthHeaders()
//     );

//     return response.data;
// };

// // export const updateCustomerBankDetails = async (customerId, bankDetails) => {
// //     const response = await axios.patch(
// //         `http://localhost:5000/api/users/customer/${customerId}/bank-details`,
// //         bankDetails,
// //         getAuthHeaders()
// //     );

// //     return response.data;
// // };

// // export const updateCustomerBankDetails = async (accountId, bankDetails) => {
// //     const response = await axios.patch(
// //         `http://localhost:5000/api/users/bank-details/${accountId}`,
// //         bankDetails,
// //         getAuthHeaders()
// //     );

// //     return response.data;
// // };

// export const updateCustomerBankDetails = async (customerId, accountId, bankDetails) => {
//     const response = await axios.patch(
//         `http://localhost:5000/api/users/customer/${customerId}/bank-details/${accountId}`,
//         bankDetails,
//         getAuthHeaders()
//     );

//     return response.data;
// };



import axios from "axios";

// =====================================================
// API BASE URL
// =====================================================
const API_URL = import.meta.env.VITE_API_URL;

// =====================================================
// AUTH HEADERS
// =====================================================
const getAuthHeaders = () => {
    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

    return {
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "application/json",
        },
    };
};

// =====================================================
// UPDATE CUSTOMER BANK DETAILS
// PATCH
// /api/users/customer/:customerId/bank-details/:accountId
// =====================================================
export const updateCustomerBankDetails = async (
    customerId,
    accountId,
    bankDetails
) => {
    try {
        const response = await axios.patch(
            `${API_URL}/users/customer/${customerId}/bank-details/${accountId}`,
            bankDetails,
            getAuthHeaders()
        );

        return response.data;
    } catch (error) {
        console.error(
            "Update customer bank details error:",
            error.response?.data || error.message
        );

        throw error;
    }
};