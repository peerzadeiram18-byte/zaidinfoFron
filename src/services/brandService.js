// import api from "../api/axios";

// export const createBrand = async (formData) => {

//     const token = localStorage.getItem("token");

//     return await api.post(

//         "/brands",

//         formData,

//         {

//             headers: {

//                 Authorization: `Bearer ${token}`,

//                 "Content-Type":"multipart/form-data"

//             }

//         }

//     );

// };

// export const getBrands = async () => {

//     const token = localStorage.getItem("token");

//     return await api.get(

//         "/brands",

//         {

//             headers: {

//                 Authorization:`Bearer ${token}`

//             }

//         }

//     );

// };


import api from "../api/axios";

// ======================================================
// HEADERS
// ======================================================

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

const getMultipartHeaders = () => ({
  ...getAuthHeaders(),
  "Content-Type": "multipart/form-data",
});

// ======================================================
// PREPARE BRAND FORM DATA
// ======================================================

const prepareBrandFormData = (data) => {
  const formData = new FormData();

  const entries =
    data instanceof FormData
      ? Array.from(data.entries())
      : Object.entries(data || {});

  entries.forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    // Only upload a real image file.
    if (key === "logo") {
      if (value instanceof Blob) {
        formData.append(
          "logo",
          value,
          value.name || "brand-logo"
        );
      }
      return;
    }

    // Category may be an ID or populated object.
    if (key === "category") {
      const categoryId =
        typeof value === "object"
          ? value?._id || value?.id || ""
          : value;

      formData.append("category", String(categoryId));
      return;
    }

    if (typeof value === "object") {
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
};

// ======================================================
// CREATE BRAND
// POST /brands
// ======================================================

export const createBrand = async (data) => {
  try {
    return await api.post(
      "/brands",
      prepareBrandFormData(data),
      { headers: getMultipartHeaders() }
    );
  } catch (error) {
    console.error(
      "CREATE BRAND ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ======================================================
// GET ALL BRANDS
// GET /brands
// ======================================================

export const getBrands = async () => {
  try {
    return await api.get("/brands", {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error(
      "GET BRANDS ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ======================================================
// GET BRAND BY ID
// GET /brands/:id
// ======================================================

export const getBrandById = async (id) => {
  if (!id) {
    throw new Error("Brand ID is required.");
  }

  return await api.get(
    `/brands/${encodeURIComponent(id)}`,
    { headers: getAuthHeaders() }
  );
};

// ======================================================
// UPDATE BRAND
// PUT /brands/:id
// ======================================================

export const updateBrand = async (id, data) => {
  if (!id) {
    throw new Error("Brand ID is required.");
  }

  try {
    return await api.put(
      `/brands/${encodeURIComponent(id)}`,
      prepareBrandFormData(data),
      { headers: getMultipartHeaders() }
    );
  } catch (error) {
    console.error(
      "UPDATE BRAND ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ======================================================
// DELETE BRAND
// DELETE /brands/:id
// ======================================================

export const deleteBrand = async (id) => {
  if (!id) {
    throw new Error("Brand ID is required.");
  }

  try {
    return await api.delete(
      `/brands/${encodeURIComponent(id)}`,
      { headers: getAuthHeaders() }
    );
  } catch (error) {
    console.error(
      "DELETE BRAND ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};