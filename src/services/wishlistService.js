import axios from "axios";

// =====================================================
// API
// =====================================================

const API_URL =
  import.meta.env.VITE_API_URL;

// =====================================================
// ENV VALIDATION
// =====================================================

if (!API_URL) {
  console.error(
    "VITE_API_URL is not configured in .env"
  );
}

// =====================================================
// WISHLIST API
// =====================================================

const API =
  `${API_URL?.replace(/\/$/, "")}/wishlist`;

// =====================================================
// TOKEN
// =====================================================

const getToken = () => {
  return localStorage.getItem("token");
};

// =====================================================
// AUTH HEADERS
// =====================================================

const getHeaders = () => {

  const token =
    getToken();

  return {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };
};

// =====================================================
// GET WISHLIST
// =====================================================

export const getWishlist = async () => {

  return await axios.get(
    API,
    getHeaders()
  );

};

// =====================================================
// ADD TO WISHLIST
// =====================================================

export const addToWishlist = async (
  productId
) => {

  if (!productId) {
    throw new Error(
      "Product ID is required"
    );
  }

  console.log(
    "===================================="
  );

  console.log(
    "ADDING PRODUCT TO WISHLIST"
  );

  console.log(
    "Product ID:",
    productId
  );

  console.log(
    "Wishlist API:",
    `${API}/add`
  );

  console.log(
    "===================================="
  );

  return await axios.post(
    `${API}/add`,
    {
      productId: productId,
    },
    getHeaders()
  );

};

// =====================================================
// REMOVE FROM WISHLIST
// =====================================================

export const removeFromWishlist = async (
  productId
) => {

  if (!productId) {
    throw new Error(
      "Product ID is required"
    );
  }

  return await axios.delete(
    `${API}/remove/${productId}`,
    getHeaders()
  );

};