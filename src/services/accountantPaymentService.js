import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken");

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// ============================================
// GET ALL PAYMENTS
// GET /api/payments
// ============================================

export const getAllPayments = async () => {
  const response = await axios.get(
    `${API_URL}/payments`,
    getConfig()
  );

  return response.data;
};

// ============================================
// GET PAYMENT BY ID
// ============================================

export const getPaymentById = async (id) => {
  const response = await axios.get(
    `${API_URL}/payments/${id}`,
    getConfig()
  );

  return response.data;
};

// ============================================
// MARK PAYMENT SUCCESS
// PATCH /api/payments/:id/success
// ============================================

export const markPaymentSuccess = async (
  id,
  data = {}
) => {
  const response = await axios.patch(
    `${API_URL}/payments/${id}/success`,
    data,
    getConfig()
  );

  return response.data;
};

// ============================================
// MARK PAYMENT FAILED
// ============================================

export const markPaymentFailed = async (
  id,
  data = {}
) => {
  const response = await axios.patch(
    `${API_URL}/payments/${id}/failed`,
    data,
    getConfig()
  );

  return response.data;
};

// ============================================
// REFUND PAYMENT
// PATCH /api/payments/:id/refund
// ============================================

export const refundPayment = async (
  id,
  data
) => {
  const response = await axios.patch(
    `${API_URL}/payments/${id}/refund`,
    data,
    getConfig()
  );

  return response.data;
};

