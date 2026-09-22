import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ======================================================
// RESPONSE UNWRAPPER
// ======================================================

const unwrap = (response) => {
  const data = response?.data;

  // { success: true, data: [...] }
  if (data?.data !== undefined) {
    return data.data;
  }

  // Direct response
  return data;
};

// ======================================================
// EXPENSE API
// ======================================================

export const expenseApi = {
  list: async (params = {}) => {
    const response = await api.get("/expenses", {
      params,
    });

    return unwrap(response);
  },

  get: async (id) => {
    const response = await api.get(
      `/expenses/${id}`
    );

    return unwrap(response);
  },

  create: async (payload) => {
    const response = await api.post(
      "/expenses",
      payload
    );

    return unwrap(response);
  },

  update: async (id, payload) => {
    const response = await api.put(
      `/expenses/${id}`,
      payload
    );

    return unwrap(response);
  },

  remove: async (id) => {
    const response = await api.delete(
      `/expenses/${id}`
    );

    return unwrap(response);
  },
};

// ======================================================
// PURCHASE API
// IMPORTANT:
// Backend uses /api/purchase
// NOT /api/purchases
// ======================================================

export const purchaseApi = {
  // GET /api/purchase
  list: async (params = {}) => {
    const response = await api.get(
      "/purchase",
      {
        params,
      }
    );

    return unwrap(response);
  },

  // GET /api/purchase/:id
  get: async (id) => {
    const response = await api.get(
      `/purchase/${id}`
    );

    return unwrap(response);
  },

  // POST /api/purchase
  create: async (payload) => {
    const response = await api.post(
      "/purchase",
      payload
    );

    return unwrap(response);
  },

  // PUT /api/purchase/:id/verify
  verify: async (id) => {
    const response = await api.put(
      `/purchase/${id}/verify`
    );

    return unwrap(response);
  },

  // PUT /api/purchase/:id/payment
  pay: async (id, payload) => {
    const response = await api.put(
      `/purchase/${id}/payment`,
      payload
    );

    return unwrap(response);
  },

  // GET /api/purchase/pending-payments
  pendingPayments: async () => {
    const response = await api.get(
      "/purchase/pending-payments"
    );

    return unwrap(response);
  },

  // DELETE /api/purchase/:id
  remove: async (id) => {
    const response = await api.delete(
      `/purchase/${id}`
    );

    return unwrap(response);
  },
};

// ======================================================
// FINANCIAL REPORT API
// ======================================================

export const financialReportApi = {
  daily: async () => {
    const response = await api.get(
      "/financial-reports/daily"
    );

    return unwrap(response);
  },

  monthly: async () => {
    const response = await api.get(
      "/financial-reports/monthly"
    );

    return unwrap(response);
  },

  summary: async (from, to) => {
    const response = await api.get(
      "/financial-reports/summary",
      {
        params: {
          from,
          to,
        },
      }
    );

    return unwrap(response);
  },

  sales: async (from, to) => {
    const response = await api.get(
      "/financial-reports/sales",
      {
        params: {
          from,
          to,
        },
      }
    );

    return unwrap(response);
  },

  repair: async (from, to) => {
    const response = await api.get(
      "/financial-reports/repair",
      {
        params: {
          from,
          to,
        },
      }
    );

    return unwrap(response);
  },

  rental: async (from, to) => {
    const response = await api.get(
      "/financial-reports/rental",
      {
        params: {
          from,
          to,
        },
      }
    );

    return unwrap(response);
  },

  vendorPayments: async (from, to) => {
    const response = await api.get(
      "/financial-reports/vendor-payments",
      {
        params: {
          from,
          to,
        },
      }
    );

    return unwrap(response);
  },

  pendingPayments: async () => {
    const response = await api.get(
      "/financial-reports/pending-payments"
    );

    return unwrap(response);
  },

  paymentMethods: async (from, to) => {
    const response = await api.get(
      "/financial-reports/payment-methods",
      {
        params: {
          from,
          to,
        },
      }
    );

    return unwrap(response);
  },

  profitLoss: async (from, to) => {
    const response = await api.get(
      "/financial-reports/profit-loss",
      {
        params: {
          from,
          to,
        },
      }
    );

    return unwrap(response);
  },
};

// ======================================================
// ERROR HELPER
// ======================================================

export const getApiError = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong"
  );
};

// ======================================================
// DEFAULT API
// ======================================================

export default api;