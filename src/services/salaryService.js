import api from "../api/axios";

// ==========================================
// GET ALL EMPLOYEES SALARY
// ==========================================

export const getAllSalaryData = async () => {
  const response = await api.get("/salary/all-summary");

  return response.data;
};


// ==========================================
// GET SINGLE EMPLOYEE SALARY
// ==========================================

export const getEmployeeSalary = async (employeeId) => {
  const response = await api.get(
    `/salary/${employeeId}`
  );

  return response.data;
};


// ==========================================
// GET SINGLE EMPLOYEE BANK DETAILS
// ==========================================

export const getEmployeeBankDetails = async (
  employeeId
) => {
  const response = await api.get(
    `/salary/${employeeId}`
  );

  return response.data;
};


// ==========================================
// CONFIGURE / UPDATE SALARY
// ==========================================

export const configSalaryDetails = async (
  employeeId,
  data
) => {
  const response = await api.post(
    `/salary/config/${employeeId}`,
    data
  );

  return response.data;
};


// ==========================================
// UPDATE / RECORD SALARY PAYMENT
// ==========================================

export const updateSalaryPayment = async (
  employeeId,
  data
) => {
  const response = await api.put(
    `/salary/pay/${employeeId}`,
    data
  );

  return response.data;
};


// ==========================================
// GET SALARY SUMMARY
// ==========================================

export const getSalarySummary = async (
  employeeId
) => {
  const response = await api.get(
    `/salary/summary/${employeeId}`
  );

  return response.data;
};


// ==========================================
// EXPORT SALARY EXCEL
// ==========================================

export const exportSalaryExcel = async () => {
  const response = await api.get(
    "/salary/export",
    {
      responseType: "blob",
    }
  );

  const blob = new Blob(
    [response.data],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "salary-report.xlsx";

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};