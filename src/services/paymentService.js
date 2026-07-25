import axios from "axios";

const API = "http://localhost:5000/api/payments";

const getToken = () => {

    return localStorage.getItem("token");

};

// =============================
// CREATE PAYMENT
// =============================

export const createPayment = async (data) => {

    const res = await axios.post(

        API,

        data,

        {

            headers: {

                Authorization: `Bearer ${getToken()}`

            }

        }

    );

    return res.data;

};

// =============================
// GET MY PAYMENTS
// =============================

export const getMyPayments = async () => {

    const res = await axios.get(

        `${API}/my`,

        {

            headers: {

                Authorization: `Bearer ${getToken()}`

            }

        }

    );

    return res.data;

};

// =============================
// GET SINGLE PAYMENT
// =============================

export const getPayment = async (id) => {

    const res = await axios.get(

        `${API}/${id}`,

        {

            headers: {

                Authorization: `Bearer ${getToken()}`

            }

        }

    );

    return res.data;

};

// =============================
// PAYMENT SUCCESS
// =============================

export const paymentSuccess = async (

    id,

    data

) => {

    const res = await axios.patch(

        `${API}/${id}/success`,

        data,

        {

            headers: {

                Authorization: `Bearer ${getToken()}`

            }

        }

    );

    return res.data;

};

// =============================
// PAYMENT FAILED
// =============================

export const paymentFailed = async (

    id,

    data

) => {

    const res = await axios.patch(

        `${API}/${id}/failed`,

        data,

        {

            headers: {

                Authorization: `Bearer ${getToken()}`

            }

        }

    );

    return res.data;

};