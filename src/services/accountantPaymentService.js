
// import axios from "axios";

// // API base URL sirf .env se aayega (VITE_API_URL)
// const API_URL = import.meta.env.VITE_API_URL || "";

// const getToken = () =>
//   localStorage.getItem("token") ||
//   localStorage.getItem("accessToken");

// const getConfig = () => ({
//   headers: {
//     Authorization: `Bearer ${getToken()}`,
//   },
// });

// // ============================================
// // GET ALL PAYMENTS
// // GET /api/payments
// // ============================================

// export const getAllPayments = async () => {
//   const response = await axios.get(
//     `${API_URL}/payments`,
//     getConfig()
//   );

//   return response.data;
// };

// // ============================================
// // GET PAYMENT BY ID
// // ============================================

// export const getPaymentById = async (id) => {
//   const response = await axios.get(
//     `${API_URL}/payments/${id}`,
//     getConfig()
//   );

//   return response.data;
// };

// // ============================================
// // MARK PAYMENT SUCCESS
// // PATCH /api/payments/:id/success
// // ============================================

// export const markPaymentSuccess = async (
//   id,
//   data = {}
// ) => {
//   const response = await axios.patch(
//     `${API_URL}/payments/${id}/success`,
//     data,
//     getConfig()
//   );

//   return response.data;
// };

// // ============================================
// // MARK PAYMENT FAILED
// // ============================================

// export const markPaymentFailed = async (
//   id,
//   data = {}
// ) => {
//   const response = await axios.patch(
//     `${API_URL}/payments/${id}/failed`,
//     data,
//     getConfig()
//   );

//   return response.data;
// };

// // ============================================
// // REFUND PAYMENT
// // PATCH /api/payments/:id/refund
// // ============================================

// export const refundPayment = async (
//   id,
//   data
// ) => {
//   const response = await axios.patch(
//     `${API_URL}/payments/${id}/refund`,
//     data,
//     getConfig()
//   );

//   return response.data;
// };


import axios from "axios";

// =====================================================
// API BASE
// =====================================================

const rawBase =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

const normalizedBase = rawBase.replace(/\/+$/, "");

const API_BASE = normalizedBase.endsWith("/api")
  ? normalizedBase
  : `${normalizedBase}/api`;

const PAYMENT_API = `${API_BASE}/payments`;

// =====================================================
// AUTH HEADERS
// =====================================================

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken");

  return {
    Authorization: token
      ? `Bearer ${token}`
      : "",
    "Content-Type": "application/json",
  };
};

// =====================================================
// RESPONSE HELPER
// =====================================================

const handleResponse = (response) => response.data;

// =====================================================
// GET ALL PAYMENTS
// GET /api/payments
// =====================================================

export const getAllPayments = async () => {
  const response = await axios.get(PAYMENT_API, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
};

// =====================================================
// MARK SUCCESS
// PATCH /api/payments/:id/success
// =====================================================

export const markPaymentSuccess = async (
  paymentId,
  payload
) => {
  const response = await axios.patch(
    `${PAYMENT_API}/${paymentId}/success`,
    payload,
    {
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
};

// =====================================================
// MARK FAILED
// PATCH /api/payments/:id/failed
// =====================================================

export const markPaymentFailed = async (
  paymentId,
  payload
) => {
  const response = await axios.patch(
    `${PAYMENT_API}/${paymentId}/failed`,
    payload,
    {
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
};

// =====================================================
// REFUND PAYMENT
// PATCH /api/payments/:id/refund
// =====================================================

export const refundPayment = async (
  paymentId,
  payload
) => {
  const response = await axios.patch(
    `${PAYMENT_API}/${paymentId}/refund`,
    payload,
    {
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
};

// =====================================================
// GET PAYMENT BY ID
// =====================================================

export const getPaymentById = async (paymentId) => {
  const response = await axios.get(
    `${PAYMENT_API}/${paymentId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
};
