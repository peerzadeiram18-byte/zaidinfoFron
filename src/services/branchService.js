
import api from "../api/axios";

// =============================================
// AUTH HEADERS
// =============================================

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken");

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

// =============================================
// GET ALL BRANCHES
// GET /branches
// =============================================

export const getAllBranches = async () => {
  try {
    const response = await api.get("/branches", {
      headers: getAuthHeaders(),
    });

    return response;
  } catch (error) {
    console.error(
      "GET ALL BRANCHES ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =============================================
// GET ACTIVE BRANCHES
// GET /branches?status=ACTIVE
// =============================================

export const getActiveBranches = async () => {
  try {
    const response = await api.get("/branches", {
      headers: getAuthHeaders(),
      params: {
        status: "ACTIVE",
      },
    });

    return response;
  } catch (error) {
    console.error(
      "GET ACTIVE BRANCHES ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =============================================
// GET BRANCH BY ID
// GET /branches/:id
// =============================================

export const getBranchById = async (id) => {
  if (!id) {
    throw new Error("Branch ID is required.");
  }

  try {
    return await api.get(
      `/branches/${encodeURIComponent(id)}`,
      {
        headers: getAuthHeaders(),
      }
    );
  } catch (error) {
    console.error(
      "GET BRANCH BY ID ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export default {
  getAllBranches,
  getActiveBranches,
  getBranchById,
};
