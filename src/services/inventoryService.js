import axios from "axios";

const API = "http://localhost:5000/api/inventory";

const token = localStorage.getItem("token");

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

// =========================
// Get Inventory List
// =========================

export const getInventory = async () => {
  return await axios.get(API, config);
};

// =========================
// Add Stock
// =========================

export const addStock = async (data) => {
  return await axios.patch(
    `${API}/add-stock`,
    data,
    config
  );
};

// =========================
// Remove Stock
// =========================

export const removeStock = async (data) => {
  return await axios.patch(
    `${API}/remove-stock`,
    data,
    config
  );
};

// =========================
// Return Stock
// =========================

export const returnStock = async (data) => {
  return await axios.patch(
    `${API}/return-stock`,
    data,
    config
  );
};

// =========================
// Stock History
// =========================

export const getStockHistory = async (productId) => {

  return await axios.get(

    `http://localhost:5000/api/stock-transactions/product/${productId}`,

    config

  );

};