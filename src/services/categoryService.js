// import api from "../api/axios";

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


import api from "../api/axios";

// =====================================================
// CREATE CATEGORY / SUBCATEGORY
// =====================================================

export const createCategory = async (formData) => {
  const token = localStorage.getItem("token");

  return await api.post(
    "/categories",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};


// =====================================================
// GET ALL CATEGORIES
// =====================================================

export const getCategories = async () => {
  const token = localStorage.getItem("token");

  return await api.get(
    "/categories",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


// =====================================================
// GET CATEGORY BY ID
// =====================================================

export const getCategoryById = async (id) => {
  const token = localStorage.getItem("token");

  return await api.get(
    `/categories/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


// =====================================================
// UPDATE CATEGORY
// =====================================================

export const updateCategory = async (
  id,
  formData
) => {
  const token = localStorage.getItem("token");

  return await api.put(
    `/categories/${id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};


// =====================================================
// DELETE CATEGORY
// =====================================================

export const deleteCategory = async (id) => {
  const token = localStorage.getItem("token");

  return await api.delete(
    `/categories/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};