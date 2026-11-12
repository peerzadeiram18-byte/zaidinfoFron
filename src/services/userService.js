// import api from "../api/axios";

// export const getUsers = () => {
//   return api.get("/users");
// };


// export const getEmployees = () => {
//   return api.get("/users/employees");
// };

import api from "../api/axios";

// ==================================================
// GET ALL USERS
// ==================================================
export const getUsers = (params = {}) => {
  return api.get("/users", { params });
};

// ==================================================
// GET ALL EMPLOYEES
// ==================================================
export const getEmployees = () => {
  return api.get("/users/employees");
};

// ==================================================
// GET EMPLOYEE BY ID
// Backend: GET /users/:id
// ==================================================
export const getEmployeeById = (id) => {
  return api.get(`/users/${id}`);
};

// ==================================================
// CREATE EMPLOYEE
// ==================================================
export const createEmployee = (data) => {
  return api.post("/users", data);
};

// ==================================================
// UPDATE EMPLOYEE
// Backend: PUT /users/:id
// ==================================================
export const updateEmployee = (id, data) => {
  return api.put(`/users/${id}`, data);
};

// ==================================================
// DELETE EMPLOYEE (SOFT DELETE)
// Backend: DELETE /users/:id
// ==================================================
export const deleteEmployee = (id) => {
  return api.delete(`/users/${id}`);
};

// ==================================================
// UPDATE EMPLOYEE STATUS
// ==================================================
export const updateEmployeeStatus = (id, status) => {
  return api.put(`/users/status/${id}`, { status });
};

// ==================================================
// UPDATE SALARY
// ==================================================
export const updateEmployeeSalary = (id, data) => {
  return api.put(`/users/${id}/salary`, data);
};

// ==================================================
// GET SALARY HISTORY
// ==================================================
export const getEmployeeSalaryHistory = (id) => {
  return api.get(`/users/${id}/salary-history`);
};
