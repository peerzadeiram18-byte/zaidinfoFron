import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken");

const config = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// ============================================
// ALL EMPLOYEE SALARY
// ============================================

export const getAllEmployeesSalary =
  async () => {
    const response =
      await axios.get(
        `${API_URL}/salary/all-summary`,
        config()
      );

    return response.data;
  };

// ============================================
// GET SALARY
// ============================================

export const getSalary =
  async (employeeId) => {
    const response =
      await axios.get(
        `${API_URL}/salary/${employeeId}`,
        config()
      );

    return response.data;
  };

// ============================================
// CALCULATE SALARY
// ============================================

export const calculateSalary =
  async (
    employeeId,
    month,
    year
  ) => {
    const response =
      await axios.post(
        `${API_URL}/salary/calculate/${employeeId}`,
        {
          month,
          year,
        },
        config()
      );

    return response.data;
  };

// ============================================
// PAY SALARY
// ============================================

export const paySalary =
  async (
    employeeId,
    data
  ) => {
    const response =
      await axios.put(
        `${API_URL}/salary/pay/${employeeId}`,
        data,
        config()
      );

    return response.data;
  };

// ============================================
// EXPORT
// ============================================

export const exportSalary =
  async () => {
    const response =
      await axios.get(
        `${API_URL}/salary/export`,
        {
          ...config(),
          responseType: "blob",
        }
      );

    return response.data;
  };

