import api from "../api/axios";

// ================= Login =================

export const loginUser = async (data) => {
  return await api.post("/auth1/login", data);
};

// ================= Register =================

export const registerUser = async (data) => {
  return await api.post("/users/register", data);
};


export const createEmployee = async (data) => {
  return await api.post("/users", data);
};


// ===============================
// Update Employee Status
// ===============================

export const updateEmployeeStatus = async (

id,

status

)=>{

return await api.put(

`/users/status/${id}`,

{

status

}

);

};


