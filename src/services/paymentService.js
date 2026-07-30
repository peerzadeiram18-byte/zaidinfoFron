import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/payments`;

// ============================================
// GET TOKEN
// ============================================

const getToken = () => {

    return localStorage.getItem("token");

};


// ============================================
// GET CONFIG
// ============================================

const getConfig = () => {

    return {

        headers: {

            Authorization:
                `Bearer ${getToken()}`

        }

    };

};


// ============================================
// CREATE PAYMENT
// ============================================

export const createPayment = async (data) => {

    const res = await axios.post(

        API,

        data,

        getConfig()

    );

    return res.data;

};


// ============================================
// GET MY PAYMENTS
// ============================================

export const getMyPayments = async () => {

    const res = await axios.get(

        `${API}/my`,

        getConfig()

    );

    return res.data;

};


// ============================================
// GET SINGLE PAYMENT
// ============================================

export const getPayment = async (id) => {

    const res = await axios.get(

        `${API}/${id}`,

        getConfig()

    );

    return res.data;

};


// ============================================
// PAYMENT SUCCESS
// ============================================

export const paymentSuccess = async (
    id,
    data
) => {

    const res = await axios.patch(

        `${API}/${id}/success`,

        data,

        getConfig()

    );

    return res.data;

};


// ============================================
// PAYMENT FAILED
// ============================================

export const paymentFailed = async (
    id,
    data
) => {

    const res = await axios.patch(

        `${API}/${id}/failed`,

        data,

        getConfig()

    );

    return res.data;

};