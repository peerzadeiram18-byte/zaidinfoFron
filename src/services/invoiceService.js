// import axios from "../api/axios";

// // ==========================================
// // CREATE INVOICE
// // ==========================================

// export const createInvoice = async (orderId) => {
//   try {
//     const response = await axios.post(
//       "/invoices",
//       {
//         orderId,
//       }
//     );

//     console.log(
//       "CREATE INVOICE RESPONSE:",
//       response.data
//     );

//     return response.data;
//   } catch (error) {
//     console.error(
//       "CREATE INVOICE ERROR:",
//       error
//     );

//     console.error(
//       "CREATE INVOICE BACKEND RESPONSE:",
//       error.response?.data
//     );

//     throw error;
//   }
// };

// // ==========================================
// // GET INVOICE BY ORDER
// // ==========================================

// export const getInvoiceByOrderId =
//   async (orderId) => {
//     const response = await axios.get(
//       `/invoices/order/${orderId}`
//     );

//     return response.data;
//   };

// // ==========================================
// // GET INVOICE BY ID
// // ==========================================

// export const getInvoiceById =
//   async (invoiceId) => {
//     const response = await axios.get(
//       `/invoices/${invoiceId}`
//     );

//     return response.data;
//   };

// // ==========================================
// // GET ALL INVOICES
// // ==========================================

// export const getInvoices = async () => {
//   const response = await axios.get(
//     "/invoices"
//   );

//   console.log(
//     "GET ALL INVOICES RESPONSE:",
//     response.data
//   );

//   return response.data;
// };



// // ==========================================
// // GET MY INVOICES (logged-in user only)
// // ==========================================

// export const getMyInvoices = async () => {
//   const response = await axios.get(
//     "/invoices/my"
//   );

//   return response.data;
// };

import axios from "../api/axios";

// ==========================================
// CREATE INVOICE
// invoiceType: "GST" ya "NON_GST" (optional)
// ==========================================

export const createInvoice = async (
  orderId,
  invoiceType
) => {
  try {
    const body = { orderId };

    if (invoiceType) {
      body.invoiceType = invoiceType;
    }

    const response = await axios.post(
      "/invoices",
      body
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
// params: { invoiceType: "GST" | "NON_GST" }
// ==========================================

export const getInvoices = async (
  params = {}
) => {
  const response = await axios.get(
    "/invoices",
    { params }
  );

  console.log(
    "GET ALL INVOICES RESPONSE:",
    response.data
  );

  return response.data;
};

// ==========================================
// GET MY INVOICES (logged-in user only)
// ==========================================

export const getMyInvoices = async () => {
  const response = await axios.get(
    "/invoices/my"
  );

  return response.data;
};

// ==========================================
// UPDATE INVOICE
// PUT /invoices/:id
// ==========================================

export const updateInvoice = async (
  invoiceId,
  data
) => {
  const response = await axios.put(
    `/invoices/${invoiceId}`,
    data
  );

  return response.data;
};

// ==========================================
// DELETE INVOICE (soft delete)
// DELETE /invoices/:id
// ==========================================

export const deleteInvoice = async (
  invoiceId
) => {
  const response = await axios.delete(
    `/invoices/${invoiceId}`
  );

  return response.data;
};