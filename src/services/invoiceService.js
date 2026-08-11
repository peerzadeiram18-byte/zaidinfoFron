import axios from "../api/axios";

// ==========================================
// CREATE INVOICE
// ==========================================

export const createInvoice = async (orderId) => {
  try {
    const response = await axios.post(
      "/invoices",
      {
        orderId,
      }
    );

    console.log(
      "CREATE INVOICE RESPONSE:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "CREATE INVOICE ERROR:",
      error
    );

    console.error(
      "CREATE INVOICE BACKEND RESPONSE:",
      error.response?.data
    );

    throw error;
  }
};

// ==========================================
// GET INVOICE BY ORDER
// ==========================================

export const getInvoiceByOrderId =
  async (orderId) => {
    const response = await axios.get(
      `/invoices/order/${orderId}`
    );

    return response.data;
  };

// ==========================================
// GET INVOICE BY ID
// ==========================================

export const getInvoiceById =
  async (invoiceId) => {
    const response = await axios.get(
      `/invoices/${invoiceId}`
    );

    return response.data;
  };

// ==========================================
// GET ALL INVOICES
// ==========================================

export const getInvoices = async () => {
  const response = await axios.get(
    "/invoices"
  );

  console.log(
    "GET ALL INVOICES RESPONSE:",
    response.data
  );

  return response.data;
};