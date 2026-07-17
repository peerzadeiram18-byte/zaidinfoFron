import api from "../api/axios";

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