import axios from "axios";

const API_URL = String(
  import.meta.env.VITE_API_URL || ""
).replace(/\/+$/, "");

const BASE_URL = `${API_URL}/newRepair`;

const getAuthConfig = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    "";

  return {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
  };
};

// ==========================================
// TECHNICIAN LIST
// ==========================================

export const getTechnicianList = async () => {
  const res = await axios.get(
    `${BASE_URL}/technicians`,
    getAuthConfig()
  );

  const data =
    res.data?.technicians ||
    res.data?.data ||
    (Array.isArray(res.data) ? res.data : []);

  return Array.isArray(data) ? data : [];
};

// ==========================================
// TRANSFER JOB
// payload: { toTechnicianId, reason, note }
// ==========================================

export const transferRepairJob = async (
  repairId,
  payload
) => {
  const res = await axios.patch(
    `${BASE_URL}/${repairId}/transfer`,
    payload,
    getAuthConfig()
  );

  return res.data;
};

// ==========================================
// SAVE TECHNICIAN NOTES
// ==========================================

export const saveTechnicianNotes = async (
  repairId,
  technicianNotes
) => {
  const res = await axios.put(
    `${BASE_URL}/${repairId}`,
    { technicianNotes },
    getAuthConfig()
  );

  return res.data;
};

// ==========================================
// SALESPERSON NAMES (suggestions)
//
// /users/employees sirf Admin / HR ko milta hai.
// Fail ho to khaali list, aur user naam khud type kar sakta hai.
// ==========================================

export const getSalespersonNames = async () => {
  try {
    const res = await axios.get(
      `${API_URL}/users/employees`,
      getAuthConfig()
    );

    const list = Array.isArray(res.data?.data)
      ? res.data.data
      : [];

    return list
      .filter(
        (user) =>
          String(user?.role || "").toUpperCase() ===
          "SALES"
      )
      .map((user) =>
        `${user.firstName || ""} ${
          user.lastName || ""
        }`.trim()
      )
      .filter(Boolean);
  } catch {
    return [];
  }
};