import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken");

const config = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// ============================================
// GET ALL INVOICES
// ============================================

export const getAllInvoices = async () => {
  const response = await axios.get(
    `${API_URL}/invoices`,
    config()
  );

  return response.data;
};

// ============================================
// GET INVOICE BY ID
// ============================================

export const getInvoiceById = async (id) => {
  const response = await axios.get(
    `${API_URL}/invoices/${id}`,
    config()
  );

  return response.data;
};

// ============================================
// GET INVOICE BY ORDER
// ============================================

export const getInvoiceByOrderId = async (
  orderId
) => {
  const response = await axios.get(
    `${API_URL}/invoices/order/${orderId}`,
    config()
  );

  return response.data;
};

