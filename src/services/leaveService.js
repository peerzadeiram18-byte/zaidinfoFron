import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// ======================================================
// AUTH CONFIG
// ======================================================

const authConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// ======================================================
// APPLY LEAVE
// POST /api/leaves
// ======================================================

export const applyLeave = async (leaveData) => {
  const response = await axios.post(
    `${API_URL}/leaves`,
    leaveData,
    authConfig()
  );

  return response.data;
};

// ======================================================
// MY LEAVES
// GET /api/leaves/my
// ======================================================

export const getMyLeaves = async () => {
  const response = await axios.get(
    `${API_URL}/leaves/my`,
    authConfig()
  );

  return response.data;
};

// ======================================================
// GET ALL LEAVES
// GET /api/leaves
// ======================================================

export const getAllLeaves = async () => {
  const response = await axios.get(
    `${API_URL}/leaves`,
    authConfig()
  );

  return response.data;
};

// ======================================================
// GET SINGLE LEAVE
// GET /api/leaves/:id
// ======================================================

export const getLeaveById = async (
  leaveId
) => {
  const response = await axios.get(
    `${API_URL}/leaves/${leaveId}`,
    authConfig()
  );

  return response.data;
};

// ======================================================
// CANCEL LEAVE
// PATCH /api/leaves/:id/cancel
// ======================================================

export const cancelLeave = async (
  leaveId
) => {
  const response = await axios.patch(
    `${API_URL}/leaves/${leaveId}/cancel`,
    {},
    authConfig()
  );

  return response.data;
};

// ======================================================
// APPROVE LEAVE
// PATCH /api/leaves/:id/approve
// ======================================================

export const approveLeave = async (
  leaveId,
  adminRemark = ""
) => {
  const response = await axios.patch(
    `${API_URL}/leaves/${leaveId}/approve`,
    {
      adminRemark,
    },
    authConfig()
  );

  return response.data;
};

// ======================================================
// REJECT LEAVE
// PATCH /api/leaves/:id/reject
// ======================================================

export const rejectLeave = async (
  leaveId,
  adminRemark = ""
) => {
  const response = await axios.patch(
    `${API_URL}/leaves/${leaveId}/reject`,
    {
      adminRemark,
    },
    authConfig()
  );

  return response.data;
};

// ======================================================
// CREATE LEAVE POLICY
// POST /api/leaves/policies
// ======================================================

export const createLeavePolicy = async (
  policyData
) => {
  const response = await axios.post(
    `${API_URL}/leaves/policies`,
    policyData,
    authConfig()
  );

  return response.data;
};

// ======================================================
// GET LEAVE POLICIES
// IMPORTANT:
// GET /api/leaves/policies/all
// ======================================================

export const getLeavePolicies = async () => {
  const response = await axios.get(
    `${API_URL}/leaves/policies/all`,
    authConfig()
  );

  return response.data;
};

// ======================================================
// UPDATE LEAVE POLICY
// IMPORTANT:
// PATCH /api/leaves/policies/:id
// ======================================================

export const updateLeavePolicy = async (
  policyId,
  policyData
) => {
  const response = await axios.patch(
    `${API_URL}/leaves/policies/${policyId}`,
    policyData,
    authConfig()
  );

  return response.data;
};

// ======================================================
// CREATE HOLIDAY
// POST /api/leaves/holidays
// ======================================================

export const createHoliday = async (
  holidayData
) => {
  const response = await axios.post(
    `${API_URL}/leaves/holidays`,
    holidayData,
    authConfig()
  );

  return response.data;
};

// ======================================================
// GET HOLIDAYS
// GET /api/leaves/holidays
// ======================================================

export const getHolidays = async (
  startDate = "",
  endDate = ""
) => {
  let url =
    `${API_URL}/leaves/holidays`;

  if (startDate && endDate) {
    url +=
      `?startDate=${encodeURIComponent(
        startDate
      )}` +
      `&endDate=${encodeURIComponent(
        endDate
      )}`;
  }

  const response = await axios.get(
    url,
    authConfig()
  );

  return response.data;
};

// ======================================================
// GET SINGLE HOLIDAY
// GET /api/leaves/holidays/:id
// ======================================================

export const getHolidayById = async (
  holidayId
) => {
  const response = await axios.get(
    `${API_URL}/leaves/holidays/${holidayId}`,
    authConfig()
  );

  return response.data;
};

// ======================================================
// UPDATE HOLIDAY
// PUT /api/leaves/holidays/:id
// ======================================================

export const updateHoliday = async (
  holidayId,
  holidayData
) => {
  const response = await axios.put(
    `${API_URL}/leaves/holidays/${holidayId}`,
    holidayData,
    authConfig()
  );

  return response.data;
};

// ======================================================
// DELETE HOLIDAY
// DELETE /api/leaves/holidays/:id
// ======================================================

export const deleteHoliday = async (
  holidayId
) => {
  const response = await axios.delete(
    `${API_URL}/leaves/holidays/${holidayId}`,
    authConfig()
  );

  return response.data;
};