// import axios from "axios";

// const API_URL = "http://localhost:5000/api/shifts";

// // Get all shifts
// export const getShifts = async () => {
//     const token = localStorage.getItem("token");
//     const response = await axios.get(`${API_URL}/all-shifts`, {
//         headers: {
//             ...(token && { Authorization: `Bearer ${token}` }),
//         },
//     });
//     return response.data;
// };

// // Create a new shift
// export const createShift = async (shiftData) => {
//     const token = localStorage.getItem("token");

//     const response = await axios.post(API_URL, shiftData, {
//         headers: {
//             "Content-Type": "application/json",
//             ...(token && { Authorization: `Bearer ${token}` }),
//         },
//     });

//     return response.data;
// };

// // Delete a shift
// export const deleteShift = async (id) => {
//     const token = localStorage.getItem("token");
//     const response = await axios.delete(`${API_URL}/${id}`, {
//         headers: {
//             ...(token && { Authorization: `Bearer ${token}` }),
//         },
//     });
//     return response.data;
// };












import axios from "axios";

// API URL comes from .env
// Example:
// VITE_API_URL=http://localhost:5000/api

const API_URL = `${import.meta.env.VITE_API_URL}/shifts`;


// ==========================================
// GET ALL SHIFTS
// ==========================================

// export const getShifts = async () => {
//     const token = localStorage.getItem("token");

//     const response = await axios.get(`${API_URL}/all-shifts`, {
//         headers: {
//             ...(token && {
//                 Authorization: `Bearer ${token}`,
//             }),
//         },
//     });

//     return response.data;
// };

// ==========================================
// GET ALL SHIFTS
// ==========================================

export const getShifts = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(API_URL, {
        headers: {
            ...(token && {
                Authorization: `Bearer ${token}`,
            }),
        },
    });

    return response.data;
};


// ==========================================
// CREATE A NEW SHIFT
// ==========================================

export const createShift = async (shiftData) => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
        API_URL,
        shiftData,
        {
            headers: {
                "Content-Type": "application/json",
                ...(token && {
                    Authorization: `Bearer ${token}`,
                }),
            },
        }
    );

    return response.data;
};


// ==========================================
// DELETE SHIFT
// ==========================================

export const deleteShift = async (id) => {
    const token = localStorage.getItem("token");

    const response = await axios.delete(
        `${API_URL}/${id}`,
        {
            headers: {
                ...(token && {
                    Authorization: `Bearer ${token}`,
                }),
            },
        }
    );

    return response.data;
};

