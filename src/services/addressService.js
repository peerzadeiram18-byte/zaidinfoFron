import axios from "axios";

// const API = "http://localhost:5000/api/addresses";

const API = `${import.meta.env.VITE_API_URL}/addresses`;

const authHeader = () => ({

    headers: {

        Authorization: `Bearer ${localStorage.getItem("token")}`

    }

});

// ===============================
// Get My Addresses
// ===============================

export const getAddresses = async () => {

    return await axios.get(

        API,

        authHeader()

    );

};

// ===============================
// Create Address
// ===============================

export const createAddress = async (data) => {

    return await axios.post(

        API,

        data,

        authHeader()

    );

};

// ===============================
// Get Single Address
// ===============================

export const getAddress = async (id) => {

    return await axios.get(

        `${API}/${id}`,

        authHeader()

    );

};

// ===============================
// Update Address
// ===============================

export const updateAddress = async (id, data) => {

    return await axios.put(

        `${API}/${id}`,

        data,

        authHeader()

    );

};

// ===============================
// Delete Address
// ===============================

export const deleteAddress = async (id) => {

    return await axios.delete(

        `${API}/${id}`,

        authHeader()

    );

};

// ===============================
// Set Default Address
// ===============================

export const setDefaultAddress = async (id) => {

    return await axios.patch(

        `${API}/${id}/default`,

        {},

        authHeader()

    );

};