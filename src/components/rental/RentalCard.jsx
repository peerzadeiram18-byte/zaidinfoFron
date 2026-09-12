import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const RENTAL_BASE_URL = `${API_URL}/rentals`;

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    ""
  );
};

const rentalAxios = axios.create({
  baseURL: RENTAL_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

rentalAxios.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const handleError = (error) => {
  console.error(
    "Rental API Error:",
    error?.response?.data || error?.message || error
  );

  throw (
    error?.response?.data || {
      success: false,
      message: error?.message || "Rental API request failed",
    }
  );
};

/* =========================================================
   CUSTOMER
========================================================= */

// GET /api/rentals/products
export const getRentalProducts = async () => {
  try {
    const response = await rentalAxios.get("/products");

    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// GET /api/rentals/product/:productId
export const getRentalProduct = async (productId) => {
  try {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    const response = await rentalAxios.get(
      `/product/${productId}`
    );

    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// POST /api/rentals/
export const createRentalRequest = async (rentalData) => {
  try {
    const response = await rentalAxios.post(
      "/",
      rentalData
    );

    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// GET /api/rentals/my
export const getMyRentals = async () => {
  try {
    const response = await rentalAxios.get("/my");

    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// GET /api/rentals/:id
export const getRentalById = async (rentalId) => {
  try {
    if (!rentalId) {
      throw new Error("Rental ID is required");
    }

    const response = await rentalAxios.get(
      `/${rentalId}`
    );

    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/* =========================================================
   ADMIN / RECEPTIONIST
========================================================= */

// GET /api/rentals/
export const getAllRentals = async () => {
  try {
    const response = await rentalAxios.get("/");

    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// PATCH /api/rentals/:id/approve
export const approveRental = async (rentalId) => {
  try {
    if (!rentalId) {
      throw new Error("Rental ID is required");
    }

    const response = await rentalAxios.patch(
      `/${rentalId}/approve`
    );

    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// PATCH /api/rentals/:id/reject
export const rejectRental = async (
  rentalId,
  reason
) => {
  try {
    if (!rentalId) {
      throw new Error("Rental ID is required");
    }

    const response = await rentalAxios.patch(
      `/${rentalId}/reject`,
      {
        reason,
      }
    );

    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// PATCH /api/rentals/:id/deposit-received
export const markDepositReceived = async (
  rentalId,
  paymentId = null
) => {
  try {
    if (!rentalId) {
      throw new Error("Rental ID is required");
    }

    const response = await rentalAxios.patch(
      `/${rentalId}/deposit-received`,
      {
        paymentId,
      }
    );

    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// PATCH /api/rentals/:id/allocate
export const allocateRental = async (rentalId) => {
  try {
    if (!rentalId) {
      throw new Error("Rental ID is required");
    }

    const response = await rentalAxios.patch(
      `/${rentalId}/allocate`
    );

    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// PATCH /api/rentals/:id/return
export const markRentalReturned = async (
  rentalId,
  returnData = {}
) => {
  try {
    if (!rentalId) {
      throw new Error("Rental ID is required");
    }

    const response = await rentalAxios.patch(
      `/${rentalId}/return`,
      {
        returnCondition:
          returnData.returnCondition || "GOOD",

        damageCharges:
          Number(returnData.damageCharges || 0),

        otherDeductions:
          Number(returnData.otherDeductions || 0),
      }
    );

    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/* =========================================================
   RENTAL INVENTORY
========================================================= */

// GET /api/rentals/inventory
export const getRentalInventory = async () => {
  try {
    const response = await rentalAxios.get(
      "/inventory"
    );

    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const rentalApi = {
  getRentalProducts,
  getRentalProduct,
  createRentalRequest,
  getMyRentals,
  getRentalById,

  getAllRentals,
  approveRental,
  rejectRental,
  markDepositReceived,
  allocateRental,
  markRentalReturned,

  getRentalInventory,
};

export default rentalApi;