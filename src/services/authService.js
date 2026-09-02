// import api from "../api/axios";

// // ================= Login =================

// export const loginUser = async (data) => {
//   return await api.post("/auth1/login", data);
// };

// // ================= Register =================

// export const registerUser = async (data) => {
//   return await api.post("/users/register", data);
// };


// export const createEmployee = async (data) => {
//   return await api.post("/users", data);
// };


// // ===============================
// // Update Employee Status
// // ===============================

// export const updateEmployeeStatus = async (

// id,

// status

// )=>{

// return await api.put(

// `/users/status/${id}`,

// {

// status

// }

// );

// };


import api from "../api/axios";

// ==================================================
// LOGIN
// ==================================================

export const loginUser = async (data) => {
  return await api.post("/auth1/login", data);
};

// ==================================================
// REGISTER CUSTOMER
// ==================================================

export const registerUser = async (data) => {
  return await api.post("/users/register", data);
};

// ==================================================
// CREATE EMPLOYEE
// ==================================================

export const createEmployee = async (data) => {
  return await api.post("/users", data);
};

// ==================================================
// UPDATE EMPLOYEE STATUS
// ==================================================

export const updateEmployeeStatus = async (id, status) => {
  return await api.put(`/users/status/${id}`, {
    status,
  });
};

// ==================================================
// VERIFY EMAIL
// ==================================================

export const verifyEmail = async (data) => {
  return await api.post("/users/verify-email", data);
};

// ==================================================
// RESEND EMAIL VERIFICATION OTP
// ==================================================

export const resendEmailVerificationOtp = async (data) => {
  return await api.post(
    "/users/resend-verification-otp",
    data
  );
};

