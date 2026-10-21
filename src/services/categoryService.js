// import api from "../api/axios";

// // =====================================================
// // CREATE CATEGORY / SUBCATEGORY
// // =====================================================

// export const createCategory = async (formData) => {
//   const token = localStorage.getItem("token");

//   return await api.post(
//     "/categories",
//     formData,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "multipart/form-data",
//       },
//     }
//   );
// };


// // =====================================================
// // GET ALL CATEGORIES
// // =====================================================

// export const getCategories = async () => {
//   const token = localStorage.getItem("token");

//   return await api.get(
//     "/categories",
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
// };


// // =====================================================
// // GET CATEGORY BY ID
// // =====================================================

// export const getCategoryById = async (id) => {
//   const token = localStorage.getItem("token");

//   return await api.get(
//     `/categories/${id}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
// };


// // =====================================================
// // UPDATE CATEGORY
// // =====================================================

// export const updateCategory = async (
//   id,
//   formData
// ) => {
//   const token = localStorage.getItem("token");

//   return await api.put(
//     `/categories/${id}`,
//     formData,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "multipart/form-data",
//       },
//     }
//   );
// };


// // =====================================================
// // DELETE CATEGORY
// // =====================================================

// export const deleteCategory = async (id) => {
//   const token = localStorage.getItem("token");

//   return await api.delete(
//     `/categories/${id}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
// };



import api from "../api/axios";

// ======================================================
// AUTH HEADERS
// ======================================================

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

// ======================================================
// PREPARE FORM DATA
// ======================================================

const prepareFormData = (data) => {
  const formData = new FormData();

  // Existing FormData ko bhi validate karo
  const entries =
    data instanceof FormData
      ? Array.from(data.entries())
      : Object.entries(data || {});

  entries.forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    // ----------------------------------------------
    // IMAGE: ONLY REAL FILE / BLOB
    // ----------------------------------------------

    if (key === "image") {
      if (value instanceof Blob) {
        formData.append(
          "image",
          value,
          value.name || "category-image"
        );
      }

      // Existing image URL or {} should not be
      // uploaded as a new file.
      return;
    }

    // ----------------------------------------------
    // PARENT CATEGORY
    // ----------------------------------------------

    if (key === "parentCategory") {
      if (typeof value === "object") {
        formData.append(
          key,
          value._id || value.id || ""
        );
      } else {
        formData.append(key, String(value));
      }

      return;
    }

    // ----------------------------------------------
    // OTHER FIELDS
    // ----------------------------------------------

    if (typeof value === "object") {
      // Avoid sending [object Object]
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
};

// ======================================================
// CREATE CATEGORY / SUBCATEGORY
// ======================================================

export const createCategory = async (data) => {
  try {
    const payload = prepareFormData(data);

    const response = await api.post(
      "/categories",
      payload,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": undefined,
        },
      }
    );

    return response;
  } catch (error) {
    console.error(
      "CREATE CATEGORY ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ======================================================
// GET ALL CATEGORIES
// ======================================================

export const getCategories = async () => {
  try {
    return await api.get("/categories", {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error(
      "GET CATEGORIES ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ======================================================
// GET CATEGORY BY ID
// ======================================================

export const getCategoryById = async (id) => {
  try {
    if (!id) {
      throw new Error("Category ID is required.");
    }

    return await api.get(
      `/categories/${encodeURIComponent(id)}`,
      {
        headers: getAuthHeaders(),
      }
    );
  } catch (error) {
    console.error(
      "GET CATEGORY ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ======================================================
// UPDATE CATEGORY / SUBCATEGORY
// ======================================================

export const updateCategory = async (id, data) => {
  try {
    if (!id) {
      throw new Error("Category ID is required.");
    }

    const payload = prepareFormData(data);

    // Debug: Check actual data being sent
    for (const [key, value] of payload.entries()) {
      console.log("CATEGORY UPDATE FIELD:", key, value);
    }

    const response = await api.put(
      `/categories/${encodeURIComponent(id)}`,
      payload,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": undefined,
        },
      }
    );

    return response;
  } catch (error) {
    console.error(
      "UPDATE CATEGORY ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ======================================================
// DELETE CATEGORY / SUBCATEGORY
// ======================================================

export const deleteCategory = async (id) => {
  try {
    if (!id) {
      throw new Error("Category ID is required.");
    }

    return await api.delete(
      `/categories/${encodeURIComponent(id)}`,
      {
        headers: getAuthHeaders(),
      }
    );
  } catch (error) {
    console.error(
      "DELETE CATEGORY ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};
