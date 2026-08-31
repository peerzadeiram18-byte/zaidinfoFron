import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";


// ======================================================
// AUTH CONFIG
// ======================================================

const authConfig = () => {

    const token =
        localStorage.getItem("token");

    return {
        headers: {
            Authorization: token
                ? `Bearer ${token}`
                : ""
        }
    };
};


// ======================================================
// CREATE AVAILABILITY REQUEST
// PUBLIC
// POST /api/availability-requests
// ======================================================

// export const createAvailabilityRequest =
//     async (data) => {

//         const response =
//             await axios.post(
//                 `${API_URL}/availability-requests`,
//                 data
//             );

//         return response.data;
//     };

export const createAvailabilityRequest =
    async (data) => {

        const response =
            await axios.post(
                `${API_URL}/availability-requests`,
                data,
                authConfig()
            );

        return response.data;
    };


// ======================================================
// GET ALL AVAILABILITY REQUESTS
// ADMIN
// GET /api/availability-requests
// ======================================================

export const getAllAvailabilityRequests =
    async (status = "") => {

        const config =
            authConfig();

        const response =
            await axios.get(
                `${API_URL}/availability-requests`,
                {
                    ...config,

                    params: status
                        ? { status }
                        : {}
                }
            );

        return response.data;
    };


// ======================================================
// GET AVAILABILITY REQUEST BY ID
// ADMIN
// GET /api/availability-requests/:id
// ======================================================

export const getAvailabilityRequestById =
    async (id) => {

        const response =
            await axios.get(
                `${API_URL}/availability-requests/${id}`,
                authConfig()
            );

        return response.data;
    };


// ======================================================
// UPDATE STATUS
// ADMIN
// PATCH /api/availability-requests/:id/status
// ======================================================

export const updateAvailabilityRequestStatus =
    async (id, status) => {

        const response =
            await axios.patch(
                `${API_URL}/availability-requests/${id}/status`,
                {
                    status
                },
                authConfig()
            );

        return response.data;
    };


// ======================================================
// DELETE REQUEST
// ADMIN
// DELETE /api/availability-requests/:id
// ======================================================

export const deleteAvailabilityRequest =
    async (id) => {

        const response =
            await axios.delete(
                `${API_URL}/availability-requests/${id}`,
                authConfig()
            );

        return response.data;
    };

